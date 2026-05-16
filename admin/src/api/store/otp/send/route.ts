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

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Save to cache (5 minutes expiration)
  const cacheService: ICacheService = req.scope.resolve(Modules.CACHE)
  await cacheService.set(`otp:${email}`, otp, 60 * 5)

  // Send via Resend
  const resendRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Health & Wealth Club <orders@healthandwealthclub.com>",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Verification Code</h2>
          <p style="color: #555; font-size: 16px;">Your one-time password (OTP) is:</p>
          <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; color: #111; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #888; font-size: 14px;">This code will expire in 5 minutes.</p>
        </div>
      `,
    }),
  })

  if (!resendRes.ok) {
    const logger: Logger = req.scope.resolve("logger")
    logger.error("Failed to send OTP email: " + await resendRes.text())
    return res.status(500).json({ message: "Failed to send OTP email" })
  }

  res.status(200).json({ success: true })
}
