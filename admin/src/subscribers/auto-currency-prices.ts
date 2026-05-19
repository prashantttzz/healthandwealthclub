import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { autoCurrencyPricesWorkflow } from "../workflows/auto-currency-prices"

export default async function autoCurrencyPricesHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  // Handle Price List Updates (Batch edits in admin)
  if (event.name.includes("price-list") || event.name.includes("price_list")) {
    const { data } = await query.graph({
      entity: "price_list",
      fields: ["prices.price_set.variant.id"],
      filters: { id: event.data.id },
    })
    
    const record = data[0] as any
    if (!record) return

    const variantIds = new Set<string>()
    record?.prices?.forEach((p: any) => {
      const vId = p.price_set?.variant?.id
      if (vId) variantIds.add(vId)
    })

    logger.info(`[auto-currency] detected Price List update, syncing ${variantIds.size} variant(s)...`)

    for (const vId of variantIds) {
      await autoCurrencyPricesWorkflow(container).run({
        input: { variant_id: vId },
      })
    }
    return
  }

  // Handle Individual Price Updates
  let variantId: string | null = null

  if (event.name.startsWith("pricing.price") || event.name === "price.updated" || event.name === "price.created") {
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
    "pricing.price.updated",
    "price.created",
    "price.updated",
    "price-list.created",
    "price-list.updated",
    "pricing.price_list.updated",
    "pricing.price_list.created"
  ],
}