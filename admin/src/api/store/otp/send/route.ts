import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ICacheService, Logger } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { email } = req.body as { email: string }

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  const customerService = req.scope.resolve(Modules.CUSTOMER)
  const customers = await customerService.listCustomers({ email })

  if (customers && customers.length > 0) {
    return res.status(400).json({ message: "An account with this email already exists" })
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Save to cache (5 minutes expiration)
  const cacheService: ICacheService = req.scope.resolve(Modules.CACHE)
  await cacheService.set(`otp:${email}`, otp, 60 * 5)

  const logoUrl = "https://sxojtfykjtdzhkmchnce.supabase.co/storage/v1/object/public/medusa-media/main-logo-white.png"

  // Send via Resend
  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "The Health & Wealth Club <orders@healthandwealthclub.com>",
      to: email,
      subject: "Your Verification Code — The Health & Wealth Club",
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f3ef;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f3ef;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

  <!-- Header -->
  <tr><td style="background-color:#1a1a1a;padding:28px 40px;text-align:center;">
    <img src="${logoUrl}" alt="The Health & Wealth Club" width="220" style="display:block;margin:0 auto;max-width:220px;height:auto;" />
  </td></tr>

  <!-- Hero -->
  <tr><td style="background-color:#ffffff;padding:50px 40px 20px;text-align:center;">
    <div style="width:56px;height:56px;border-radius:50%;background-color:#f5f3ef;margin:0 auto 24px;line-height:56px;font-size:22px;color:#1a1a1a;">✦</div>
    <h2 style="margin:0 0 12px;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#1a1a1a;font-style:italic;">Verify your email</h2>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#777;max-width:420px;display:inline-block;">Enter the code below to complete your registration with The Health & Wealth Club.</p>
  </td></tr>

  <!-- OTP Code -->
  <tr><td style="background-color:#ffffff;padding:24px 40px 40px;text-align:center;">
    <div style="background-color:#faf9f7;border:2px solid #1a1a1a;padding:28px 40px;display:inline-block;">
      <p style="margin:0 0 8px;font-size:10px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#b8a88a;">Your Verification Code</p>
      <p style="margin:0;font-family:'Georgia',serif;font-size:36px;letter-spacing:12px;color:#1a1a1a;font-weight:600;">${otp}</p>
    </div>
    <p style="margin:20px 0 0;font-size:12px;color:#999;">This code expires in <strong style="color:#1a1a1a;">5 minutes</strong>.</p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;">
    <p style="margin:0 0 6px;font-family:'Georgia',serif;font-size:13px;letter-spacing:0.12em;color:#b8a88a;text-transform:uppercase;">The Health & Wealth Club</p>
    <p style="margin:0 0 16px;font-size:11px;color:#666;letter-spacing:0.05em;">Premium Life & Style</p>
    <p style="margin:0;font-size:10px;color:#555;">If you didn't request this code, you can safely ignore this email.</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
    }),
  })

  if (!resendRes.ok) {
    const logger: Logger = req.scope.resolve("logger")
    logger.error("Failed to send OTP email: " + await resendRes.text())
    return res.status(500).json({ message: "Failed to send OTP email" })
  }

  res.status(200).json({ success: true })
}
