import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { autoCurrencyPricesWorkflow } from "../workflows/auto-currency-prices"

// Fires on both product created AND updated
export default async function autoCurrencyPricesHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")

  logger.info(`[auto-currency] triggering price sync for product ${data.id}`)

  await autoCurrencyPricesWorkflow(container).run({
    input: { product_id: data.id },
  })
}

export const config: SubscriberConfig = {
  // Listen to both create and update so prices stay in sync
  event: ["product.created", "product.updated"],
}