import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { autoCurrencyPricesWorkflow } from "../workflows/auto-currency-prices"

export default async function autoCurrencyPricesHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  let variantId: string | null = null

  if (event.name.startsWith("pricing.price")) {
    const { data } = await query.graph({
      entity: event.name.includes("price-set") ? "price_set" : "price",
      fields: ["id", "currency_code", "variant.id", "price_set.variant.id"],
      filters: { id: event.data.id },
    })
    
    const record = data[0] as any
    if (record?.currency_code && record.currency_code !== "aed") {
      return
    }

    variantId = record?.variant?.id || record?.price_set?.variant?.id || null
  } else if (event.name.startsWith("product")) {
    // For product events, we'd need to sync ALL variants. 
    // To keep it simple and avoid loops, we'll let the individual price events handle it
    // since price.created is fired when a product is created with prices.
    return
  }

  if (!variantId) {
    return
  }

  logger.info(`[auto-currency] triggering price sync for variant ${variantId} (via ${event.name})`)

  await autoCurrencyPricesWorkflow(container).run({
    input: { variant_id: variantId },
  })
}

export const config: SubscriberConfig = {
  event: [
    "pricing.price.created",
    "pricing.price.updated"
  ],
}