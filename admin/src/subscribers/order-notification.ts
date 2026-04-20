import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"


/**
 * Subscriber to handle Order Notifications using Resend (Free Tier)
 * Handles Order Confirmation and Fulfillment/Shipping updates.
 */
export default async function orderNotificationHandler({
  event,
  container,
}: SubscriberArgs<any>) {
  const { name, data } = event
  const logger = container.resolve("logger")

  const remoteQuery = container.resolve("remoteQuery")

  // 1. Resolve the Order ID
  let orderId = data.id
  
  // If the event is from fulfillment/shipment/delivery, we need to find the linked order
  if (name.startsWith("fulfillment") || name.startsWith("shipment") || name.startsWith("delivery")) {
    const query = {
      entryPoint: "fulfillment",
      fields: ["order.id"],
      variables: { id: data.id },
    }
    const [fulfillment] = await remoteQuery(query)
    orderId = fulfillment?.order?.id
  }

  if (!orderId) {
    logger.warn(`Could not resolve orderId for event ${name}, skipping notification.`)
    return
  }

  // 2. Fetch the order with customer and item details using remoteQuery to ensure totals are included
  const [order] = await remoteQuery({
    entryPoint: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "total",
      "summary.*",
      "items.*",
      "shipping_address.*",
    ],
    variables: { id: orderId },
  })

  if (!order || !order.email) {
    logger.warn(`No email found for order ${orderId}, skipping notification.`)
    return
  }

  // 3. Determine message based on event type
  let subject = ""
  let title = ""
  let subtext = ""

  switch (name) {
    case "order.placed":
      subject = `Order Confirmation `
      title = "Thank you for your order!"
      subtext = `Welcome to the Health & Wealth Club. We've received your order #${order.display_id} and are preparing it for your curated experience.`
      break

    case "fulfillment.created":
      if (data.no_notification) return 
      subject = `Processing your order`
      title = "Curating your experience..."
      subtext = `We've started preparing your items for order #${order.display_id}. You'll receive another update once it's on the way.`
      break

    case "shipment.created":
      if (data.no_notification) return
      subject = `Your order has shipped!`
      title = "It's on the way!"
      subtext = `Great news! Your order #${order.display_id} has been handed over to our delivery partner. You can now track its journey reaching you soon.`
      break
    
    case "delivery.created":
    case "order.completed":
      subject = `Order Delivered!`
      title = "Curated delivered."
      subtext = `Your experience with order #${order.display_id} is now complete. We hope you enjoy your curated items from the Health & Wealth Club.`
      break

    default:
      return
  }

  // 3. Setup Currency & Pricing Helpers
  const currencyCode = (order.currency_code || "USD").toUpperCase()
  const decimalFactor = ["KWD", "BHD", "OMR"].includes(currencyCode) ? 1000 : 100
  const decimals = ["KWD", "BHD", "OMR"].includes(currencyCode) ? 3 : 2

  // 4. Generate Item Rows (with manual calculation fallback to prevent NaN)
  const itemRows = (order.items || []).map(item => {
    const itemTotal = Number(item.total || (Number(item.unit_price || 0) * Number(item.quantity || 0)))
    return `
    <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
      <div style="font-size: 14px;"><strong>${item.product_title}</strong> x ${item.quantity}  =  </div>
      <div style="font-size: 14px; font-weight: bold;">
        ${(itemTotal / decimalFactor).toFixed(decimals)} ${currencyCode}
      </div>
    </div>
    `
  }).join('')

  // 5. Grand Total (Check direct field, then summary field, then fallback to 0)
  const orderTotal = Number(order.total || order.summary?.total || 0)

  // 6. Send via Resend
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Health & Wealth Club <orders@healthandwealthclub.com>",
        to: order.email,
        subject: subject,
        html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #162917; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="font-style: italic; font-weight: 300; font-size: 28px; margin: 0;">HEALTH & WEALTH CLUB</h2>
            </div>
            
            <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">${title}</h1>
            <p style="font-size: 16px; line-height: 1.6; color: #4a4a4a; margin-bottom: 30px;">
              ${subtext}
            </p>

            <div style="background-color: #f9f9f9; padding: 25px; border-radius: 4px; margin-bottom: 30px;">
              <h3 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1a1; margin-bottom: 15px;">Order Summary</h3>
              ${itemRows}
              <div style="display: flex; justify-content: space-between; padding-top: 15px; font-weight: bold; font-size: 18px;">
                <span>Total</span>
                <span>
                  ${(orderTotal / decimalFactor).toFixed(decimals)} ${currencyCode}
                </span>
              </div>
            </div>

            <div style="text-align: center; font-size: 12px; color: #a1a1a1; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
              <p>Health & Wealth Club | Premium Life & Style</p>
              <p>This is an automated notification. Please do not reply to this email.</p>
            </div>
          </div>
        `,
      }),
    })

    if (res.ok) {
      logger.info(`Successfully sent ${name} notification to ${order.email}`)
    } else {
      const errorBody = await res.json()
      logger.error(`Resend API error: ${JSON.stringify(errorBody)}`)
    }
  } catch (error) {
    logger.error(`Subscriber Error: Failed to send notification for ${name}. Error: ${error}`)
  }
}

export const config: SubscriberConfig = {
  event: [
    "order.placed", 
    "fulfillment.created", 
    "shipment.created", 
    "delivery.created",
    "order.completed"
  ],
}
