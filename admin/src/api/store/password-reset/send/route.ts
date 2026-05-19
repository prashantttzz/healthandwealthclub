import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ICacheService, ICustomerModuleService, Logger } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import crypto from "crypto"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { email } = req.body as { email: string }

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  // Check if customer exists
  const customerService: ICustomerModuleService = req.scope.resolve(Modules.CUSTOMER)
  const customers = await customerService.listCustomers({ email })

  if (!customers || customers.length === 0) {
    return res.status(400).json({ message: "No account found with this email" })
  }

  // Generate a secure token
  const token = crypto.randomBytes(32).toString("hex")

  // Save to cache (15 minutes expiration)
  const cacheService: ICacheService = req.scope.resolve(Modules.CACHE)
  await cacheService.set(`pw_reset:${email}`, token, 60 * 15)

  // Use the frontend URL (you should configure this in env)
  const frontendUrl = process.env.STORE_CORS?.split(",")[0] || "http://localhost:8000"
  const resetLink = `${frontendUrl}/in/reset-password?email=${encodeURIComponent(email)}&token=${token}`

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
      subject: "Reset Your Password — The Health & Wealth Club",
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
    <div style="width:56px;height:56px;border-radius:50%;background-color:#f5f3ef;margin:0 auto 24px;line-height:56px;font-size:22px;color:#1a1a1a;">⟡</div>
    <h2 style="margin:0 0 12px;font-family:'Georgia',serif;font-size:26px;font-weight:400;color:#1a1a1a;font-style:italic;">Reset your password</h2>
    <p style="margin:0;font-size:14px;line-height:1.7;color:#777;max-width:420px;display:inline-block;">We received a request to reset the password for your account. Click the button below to choose a new one.</p>
  </td></tr>

  <!-- CTA Button -->
  <tr><td style="background-color:#ffffff;padding:24px 40px 40px;text-align:center;">
    <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
      <tr><td style="background-color:#1a1a1a;padding:16px 48px;">
        <a href="${resetLink}" style="font-family:'Helvetica Neue',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.25em;text-transform:uppercase;color:#ffffff;text-decoration:none;">Reset Password</a>
      </td></tr>
    </table>
    <p style="margin:20px 0 0;font-size:12px;color:#999;">This link expires in <strong style="color:#1a1a1a;">15 minutes</strong>.</p>
    <p style="margin:12px 0 0;font-size:11px;color:#bbb;word-break:break-all;max-width:420px;display:inline-block;">If the button doesn't work, copy and paste this link:<br>${resetLink}</p>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background-color:#1a1a1a;padding:32px 40px;text-align:center;">
    <p style="margin:0 0 6px;font-family:'Georgia',serif;font-size:13px;letter-spacing:0.12em;color:#b8a88a;text-transform:uppercase;">The Health & Wealth Club</p>
    <p style="margin:0 0 16px;font-size:11px;color:#666;letter-spacing:0.05em;">Premium Life & Style</p>
    <p style="margin:0;font-size:10px;color:#555;">If you didn't request this, you can safely ignore this email.</p>
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
    logger.error("Failed to send password reset email: " + await resendRes.text())
    return res.status(500).json({ message: "Failed to send password reset email" })
  }

  res.json({ success: true, message: "Password reset email sent" })
}
