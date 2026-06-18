import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { capturePaymentWorkflow } from "@medusajs/core-flows"

export default async function autoCapturePayment({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  const remoteQuery = container.resolve("remoteQuery")

  const orderId = event.data.id
  if (!orderId) return

  try {
    const [order] = await remoteQuery({
      entryPoint: "order",
      fields: [
        "id",
        "payment_collections.*",
        "payment_collections.payments.*",
      ],
      variables: { id: orderId },
    })

    if (!order) {
      logger.warn(`Auto-capture: Order ${orderId} not found`)
      return
    }

    const paymentCollections = order.payment_collections || []

    for (const pc of paymentCollections) {
      const payments = pc.payments || []
      for (const payment of payments) {
        const capturedAmount = payment.captured_amount || 0
        const amount = payment.amount || 0

        // Only capture if not fully captured
        if (amount > capturedAmount) {
          logger.info(`Auto-capturing payment ${payment.id} for order ${order.id}...`)
          
          await capturePaymentWorkflow(container).run({
            input: {
              payment_id: payment.id,
            }
          })
          
          logger.info(`Successfully captured payment ${payment.id}`)
        }
      }
    }
  } catch (error) {
    logger.error(`Error during auto-capture for order ${orderId}: ${error.message}`)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
