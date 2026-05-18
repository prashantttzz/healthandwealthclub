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
      subject: "Password Reset Request",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset your password</h2>
          <p>We received a request to reset your password. Click the link below to choose a new password.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #3d2f20; color: #fff; text-decoration: none; margin-top: 16px;">Reset Password</a>
          <p style="margin-top: 32px; color: #666; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    }),
  })

  if (!resendRes.ok) {
    const logger: Logger = req.scope.resolve("logger")
    logger.error("Failed to send password reset email: " + await resendRes.text())
    return res.status(500).json({ message: "Failed to send password reset email" })
  }

  res.json({ success: true, message: "Password reset email sent" })
}
