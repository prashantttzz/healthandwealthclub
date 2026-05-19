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
      "subtotal",
      "shipping_total",
      "tax_total",
      "discount_total",
      "summary.*",
      "items.*",
      "shipping_methods.*",
      "shipping_address.*",
    ],
    variables: { id: orderId },
  })

  if (!order || !order.email) {
    logger.warn(`No email found for order ${orderId}, skipping notification.`)
    return
  }

  // Debug: log the order totals to diagnose pricing issues
  logger.info(`[order-email] Order #${order.display_id} totals → total: ${order.total}, subtotal: ${order.subtotal}, shipping_total: ${order.shipping_total}, tax_total: ${order.tax_total}, discount_total: ${order.discount_total}, summary: ${JSON.stringify(order.summary || {})}, shipping_methods: ${JSON.stringify((order.shipping_methods || []).map((s: any) => ({ name: s.name, amount: s.amount, total: s.total })))}`)

  // 3. Determine message based on event type
  let subject = ""
  let title = ""
  let subtext = ""
  let heroIcon = "✦"

  switch (name) {
    case "order.placed":
      subject = `Order Confirmation — #${order.display_id}`
      title = "Thank you for your order."
      subtext = `Your order <strong>#${order.display_id}</strong> has been received and is being prepared with care.`
      heroIcon = "✦"
      break

    case "fulfillment.created":
      if (data.no_notification) return 
      subject = `Order #${order.display_id} — Processing`
      title = "Curating your experience."
      subtext = `We've started preparing the items for your order <strong>#${order.display_id}</strong>. You'll hear from us again once it ships.`
      heroIcon = "⟡"
      break

    case "shipment.created":
      if (data.no_notification) return
      subject = `Order #${order.display_id} — Shipped`
      title = "Your order is on its way."
      subtext = `Great news — order <strong>#${order.display_id}</strong> has been handed to our delivery partner and is en route to you.`
      heroIcon = "→"
      break
    
    case "delivery.created":
    case "order.completed":
      subject = `Order #${order.display_id} — Delivered`
      title = "Your order has arrived."
      subtext = `Order <strong>#${order.display_id}</strong> has been delivered. We hope you enjoy your curated selection.`
      heroIcon = "✓"
      break

    default:
      return
  }

  // 4. Currency & Pricing
  // Medusa v2 stores amounts as actual values (e.g. 78.97), NOT minor units.
  // No division needed.
  const currencyCode = (order.currency_code || "usd").toUpperCase()
  const decimals = ["KWD", "BHD", "OMR"].includes(currencyCode) ? 3 : 2

  const formatMoney = (amount: number) => {
    const val = Number(amount || 0)
    return `${currencyCode} ${val.toFixed(decimals)}`
  }

  // 5. Generate Item Rows
  const itemRows = (order.items || []).map((item: any) => {
    const qty = Number(item.quantity || 1)
    const unitPrice = Number(item.unit_price || 0)
    const itemTotal = Number(item.total || unitPrice * qty)
    return `
      <tr>
        <td style="padding:14px 0;border-bottom:1px solid #f0ede8;vertical-align:top;">
          <span style="font-family:'Georgia',serif;font-size:15px;color:#1a1a1a;">${item.product_title || "Item"}</span>
          ${item.variant_title ? `<br><span style="font-size:12px;color:#999;font-family:'Helvetica Neue',sans-serif;">${item.variant_title}</span>` : ""}
        </td>
        <td style="padding:14px 0;border-bottom:1px solid #f0ede8;text-align:center;font-family:'Helvetica Neue',sans-serif;font-size:14px;color:#666;vertical-align:top;">×${qty}</td>
        <td style="padding:14px 0;border-bottom:1px solid #f0ede8;text-align:right;font-family:'Helvetica Neue',sans-serif;font-size:15px;font-weight:600;color:#1a1a1a;vertical-align:top;">${formatMoney(itemTotal)}</td>
      </tr>`
  }).join("")

  // 6. Cost breakdown — use multiple fallbacks for each field
  const subtotal = Number(order.subtotal || order.summary?.subtotal || 0)
  const shippingMethodsTotal = (order.shipping_methods || []).reduce((sum: number, s: any) => sum + Number(s.total || s.amount || 0), 0)
  const shippingTotal = Number(order.shipping_total || order.summary?.shipping_total || shippingMethodsTotal || 0)
  const taxTotal = Number(order.tax_total || order.summary?.tax_total || 0)
  const discountTotal = Number(order.discount_total || order.summary?.discount_total || 0)
  const orderTotal = Number(order.total || order.summary?.total || 0)

  // 7. Shipping address
  const addr = order.shipping_address
  const addressLine = addr
    ? [addr.first_name, addr.last_name].filter(Boolean).join(" ") +
      (addr.address_1 ? `<br>${addr.address_1}` : "") +
      (addr.address_2 ? `, ${addr.address_2}` : "") +
      (addr.city ? `<br>${addr.city}` : "") +
      (addr.province ? `, ${addr.province}` : "") +
      (addr.postal_code ? ` ${addr.postal_code}` : "") +
      (addr.country_code ? `<br>${addr.country_code.toUpperCase()}` : "")
    : "—"

  const logoUrl = "https://sxojtfykjtdzhkmchnce.supabase.co/storage/v1/object/public/medusa-media/main-logo-white.png"

  // 9. Build premium HTML
  const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f3ef;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ef;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background-color:#1a1a1a;padding:28px 40px;text-align:center;">
    <img src="${logoUrl}" alt="The Health & Wealth Club" width="220" style="display:block;margin:0 auto;max-width:220px;height:auto;" />
  </td></tr>

  <!-- Hero -->
  <tr><td style="background-color:#ffffff;padding:50px 40px 40px;text-align:center;border-bottom:1px solid #f0ede8;">
    <div style="width:56px;height:56px;border-radius:50%;margin:0 auto 24px;line-height:56px;font-size:22px;color:#1a1a1a;">${heroIcon}</div>
    <h2 style="margin:0 0 12px;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#1a1a1a;font-style:italic;">${title}</h2>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#777;max-width:420px;display:inline-block;">${subtext}</p>
  </td></tr>

  <!-- Order Items -->
  <tr><td style="background-color:#ffffff;padding:32px 40px;">
    <p style="margin:0 0 16px;font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#b8a88a;">Order Summary</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:0 0 10px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#999;border-bottom:2px solid #1a1a1a;">Item</td>
        <td style="padding:0 0 10px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#999;text-align:center;border-bottom:2px solid #1a1a1a;">Qty</td>
        <td style="padding:0 0 10px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#999;text-align:right;border-bottom:2px solid #1a1a1a;">Amount</td>
      </tr>
      ${itemRows}
    </table>
  </td></tr>

  <!-- Totals -->
  <tr><td style="background-color:#ffffff;padding:0 40px 32px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
    
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#888;">Shipping</td>
        <td style="padding:8px 0;font-size:13px;color:#1a1a1a;text-align:right;font-weight:500;">${shippingTotal === 0 ? "Free" : formatMoney(shippingTotal)}</td>
      </tr>
      ${taxTotal > 0 ? `<tr>
        <td style="padding:8px 0;font-size:13px;color:#888;">Tax</td>
        <td style="padding:8px 0;font-size:13px;color:#1a1a1a;text-align:right;font-weight:500;">${formatMoney(taxTotal)}</td>
      </tr>` : ""}
      ${discountTotal > 0 ? `<tr>
        <td style="padding:8px 0;font-size:13px;color:#4a8c5c;">Discount</td>
        <td style="padding:8px 0;font-size:13px;color:#4a8c5c;text-align:right;font-weight:600;">- ${formatMoney(discountTotal)}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:8px 0;font-size:13px;color:#888;">Subtotal</td>
        <td style="padding:8px 0;font-size:13px;color:#1a1a1a;text-align:right;font-weight:500;">${formatMoney(subtotal)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding:0;"><div style="border-top:2px solid #1a1a1a;margin:8px 0;"></div></td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-family:'Georgia',serif;font-size:18px;color:#1a1a1a;font-style:italic;">Total</td>
        <td style="padding:10px 0;font-family:'Georgia',serif;font-size:20px;color:#1a1a1a;text-align:right;font-weight:600;">${formatMoney(orderTotal)}</td>
      </tr>
    </table>
  </td></tr>

  <!-- Shipping Address -->
  <tr><td style="background-color:#faf9f7;padding:28px 40px;border-top:1px solid #f0ede8;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="vertical-align:top;width:50%;">
          <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#b8a88a;">Shipping To</p>
          <p style="margin:0;font-size:13px;line-height:1.7;color:#555;">${addressLine}</p>
        </td>
        <td style="vertical-align:top;width:50%;text-align:right;">
          <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#b8a88a;">Order Number</p>
          <p style="margin:0;font-family:'Georgia',serif;font-size:18px;color:#1a1a1a;">#${order.display_id}</p>
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;">
    <p style="margin:0 0 6px;font-family:'Georgia',serif;font-size:13px;letter-spacing:0.12em;color:#b8a88a;text-transform:uppercase;">The Health & Wealth Club</p>
    <p style="margin:0 0 16px;font-size:11px;color:#666;letter-spacing:0.05em;">Premium Life & Style</p>
    <p style="margin:0;font-size:10px;color:#555;">This is an automated notification. Please do not reply to this email.</p>
  </td></tr>

</table>
</td></tr>
</table>

</body>
</html>`

  // 9. Send via Resend
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "The Health & Wealth Club <orders@healthandwealthclub.com>",
        to: order.email,
        subject: subject,
        html: emailHtml,
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
