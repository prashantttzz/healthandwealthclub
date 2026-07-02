import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WorkflowInput = {
  variant_id: string
}

type ExchangeRates = {
  AED_TO_SAR: number
  AED_TO_KWD: number
  AED_TO_QAR: number
  AED_TO_BHD: number
  AED_TO_OMR: number
  AED_TO_USD: number
}

type VariantPrice = {
  variant_id: string
  aed_amount: number
  price_list_id: string | null
}

// ---------------------------------------------------------------------------
// Step 1 – Fetch live exchange rates
// ---------------------------------------------------------------------------

const fetchExchangeRatesStep = createStep(
  "fetch-exchange-rates",
  async (_, { container }) => {
    const logger = container.resolve("logger")

    const FALLBACK: ExchangeRates = {
      AED_TO_SAR: 1.020,
      AED_TO_KWD: 0.084,
      AED_TO_QAR: 0.991,
      AED_TO_BHD: 0.102,
      AED_TO_OMR: 0.105,
      AED_TO_USD: 0.272,
    }

    try {
      const APP_ID = process.env.OPEN_EXCHANGE_RATES_APP_ID
      if (!APP_ID) {
        logger.warn("[auto-currency] OPEN_EXCHANGE_RATES_APP_ID not set, using fallback rates")
        return new StepResponse(FALLBACK)
      }

      const symbols = "AED,SAR,KWD,QAR,BHD,OMR,USD"
      const res = await fetch(
        `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}&base=USD&symbols=${symbols}`
      )

      if (!res.ok) throw new Error(`API returned ${res.status}`)

      const json = await res.json()
      const r = json.rates as Record<string, number>

      const rates: ExchangeRates = {
        AED_TO_SAR: r.SAR / r.AED,
        AED_TO_KWD: r.KWD / r.AED,
        AED_TO_QAR: r.QAR / r.AED,
        AED_TO_BHD: r.BHD / r.AED,
        AED_TO_OMR: r.OMR / r.AED,
        AED_TO_USD: r.USD / r.AED,
      }

      logger.info(
        `[auto-currency] rates fetched — ` +
        `SAR:${rates.AED_TO_SAR.toFixed(4)} ` +
        `KWD:${rates.AED_TO_KWD.toFixed(4)} ` +
        `QAR:${rates.AED_TO_QAR.toFixed(4)} ` +
        `BHD:${rates.AED_TO_BHD.toFixed(4)} ` +
        `OMR:${rates.AED_TO_OMR.toFixed(4)} ` +
        `USD:${rates.AED_TO_USD.toFixed(4)}`
      )

      return new StepResponse(rates)
    } catch (err) {
      logger.warn(`[auto-currency] rate fetch failed (${err}), using fallback`)
      return new StepResponse(FALLBACK)
    }
  }
)

const loadVariantPricesStep = createStep(
  "load-variant-prices",
  async ({ variant_id }: { variant_id: string }, { container }) => {
    const logger = container.resolve("logger")
    const query = container.resolve("query")

    const { data: variants } = await query.graph({
      entity: "variant",
      fields: [
        "id",
        "price_set.prices.*",
      ],
      filters: { id: variant_id },
    })

    const variant = variants[0] as any
    if (!variant) {
      logger.warn(`[auto-currency] variant ${variant_id} not found`)
      return new StepResponse([] as VariantPrice[])
    }

    const prices = variant?.price_set?.prices ?? []

    // Grab all AED prices, including base prices (price_list_id is null) AND price lists (sales)
    const aedPrices = prices.filter(
      (p: any) => p.currency_code === "aed"
    )

    if (aedPrices.length === 0) {
      logger.warn(`[auto-currency] variant ${variant.id} has no AED price, skipping`)
      return new StepResponse([] as VariantPrice[])
    }

    const variantPrices: VariantPrice[] = aedPrices.map((p: any) => ({
      variant_id: variant.id,
      aed_amount: p.amount,
      price_list_id: p.price_list_id || null,
    }))

    return new StepResponse(variantPrices)
  }
)

// ---------------------------------------------------------------------------
// Step 3 – Upsert all converted prices
// ---------------------------------------------------------------------------

const upsertConvertedPricesStep = createStep(
  "upsert-converted-prices",
  async (
    {
      rates,
      variantPrices,
    }: {
      rates: ExchangeRates
      variantPrices: VariantPrice[]
    },
    { container }
  ) => {
    const logger = container.resolve("logger")
    const pricingModuleService = container.resolve(Modules.PRICING)
    const query = container.resolve("query")

    if (variantPrices.length === 0) {
      return new StepResponse({ updated: 0 })
    }

    // All currencies to write, mapped from AED
    const CONVERSIONS = [
      { currency_code: "sar", rate: rates.AED_TO_SAR },
      { currency_code: "kwd", rate: rates.AED_TO_KWD },
      { currency_code: "qar", rate: rates.AED_TO_QAR },
      { currency_code: "bhd", rate: rates.AED_TO_BHD },
      { currency_code: "omr", rate: rates.AED_TO_OMR },
      { currency_code: "usd", rate: rates.AED_TO_USD },
    ]

    let updated = 0

    for (const { variant_id, aed_amount, price_list_id } of variantPrices) {
      const { data: variants } = await query.graph({
        entity: "variant",
        fields: ["id", "price_set.id"],
        filters: { id: variant_id },
      })

      const priceSetId = variants[0]?.price_set?.id
      if (!priceSetId) {
        logger.warn(`[auto-currency] no price set found for variant ${variant_id}`)
        continue
      }

      // Prepare payload - include price_list_id if we are syncing a sale!
      const convertedPrices = CONVERSIONS.map(({ currency_code, rate }) => {
        const payload: any = {
          currency_code,
          amount: Number((aed_amount * rate).toFixed(2)),
        }
        if (price_list_id) {
          payload.price_list_id = price_list_id
        }
        return payload
      })

      // 1. Fetch ALL current non-AED prices for this price set AND specifically this price_list_id tier
      const { data: currentPrices } = await query.graph({
        entity: "price",
        fields: ["id", "currency_code"],
        filters: {
          price_set_id: priceSetId,
          price_list_id: price_list_id,
        },
      })

      // Identify all prices that are NOT AED to clear them out and replace with fresh calc
      const pricesToRemove = (currentPrices as any[])
        .filter(p => p.currency_code !== "aed")
        .map(p => p.id)

      logger.info(
        `[auto-currency] variant ${variant_id} (PriceList: ${price_list_id}): clearing ${pricesToRemove.length} existing prices and re-adding ${convertedPrices.length} new ones`
      )

      // 2. Remove old prices
      if (pricesToRemove.length > 0) {
        await pricingModuleService.removePrices(pricesToRemove)
      }

      // 3. Add fresh calculated prices
      await pricingModuleService.addPrices([
        {
          priceSetId,
          prices: convertedPrices,
        },
      ])

      updated++
    }

    logger.info(`[auto-currency] updated prices for ${updated} base/sale variant tiers`)
    return new StepResponse({ updated })
  }
)

// ---------------------------------------------------------------------------
// Workflow
// ---------------------------------------------------------------------------

export const autoCurrencyPricesWorkflow = createWorkflow(
  "auto-currency-prices",
  (input: WorkflowInput) => {
    const rates = fetchExchangeRatesStep()
    const variantPrices = loadVariantPricesStep({ variant_id: input.variant_id })

    const result = upsertConvertedPricesStep({
      rates,
      variantPrices,
    })

    return new WorkflowResponse(result)
  }
)