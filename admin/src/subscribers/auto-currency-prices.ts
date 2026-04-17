import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { autoCurrencyPricesWorkflow } from "../workflows/auto-currency-prices"

export default async function autoCurrencyPricesHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const query = container.resolve("query")

  let productId = event.data.id

  if (event.name.startsWith("pricing.price")) {
    // Event is price.updated, price.created, etc.
    // The ID provided is a Price or PriceSet ID. We need the Product ID.
    const { data } = await query.graph({
      entity: event.name.includes("price-set") ? "price_set" : "price",
      fields: ["id", "price_set.variant.product.id", "variant.product.id"],
      filters: { id: event.data.id },
    })
    
    // Resolve productId safely depending on entity (price or price_set)
    const record = data[0] as any
    productId = record?.variant?.product?.id 
             || record?.price_set?.variant?.product?.id 
             || null

    if (!productId) {
      logger.warn(`[auto-currency] could not resolve product_id from price event ${event.data.id}`)
      return
    }
  }

  logger.info(`[auto-currency] triggering price sync for product ${productId} (via ${event.name})`)

  await autoCurrencyPricesWorkflow(container).run({
    input: { product_id: productId },
  })
}

export const config: SubscriberConfig = {
  event: [
    "product.created", 
    "product.updated",
    "pricing.price.created",
    "pricing.price.updated",
    "pricing.price-set.created",
    "pricing.price-set.updated"
  ],
}