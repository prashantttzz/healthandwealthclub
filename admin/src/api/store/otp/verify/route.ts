import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ICacheService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { email, otp } = req.body as { email: string; otp: string }

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" })
  }

  const cacheService: ICacheService = req.scope.resolve(Modules.CACHE)
  const savedOtp = await cacheService.get<string>(`otp:${email}`)

  if (!savedOtp) {
    return res.status(400).json({ message: "OTP expired or not requested" })
  }

  if (savedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" })
  }

  // Clear OTP
  await cacheService.set(`otp:${email}`, "", 1) // Invalidate cache by overwriting with short TTL

  res.status(200).json({ success: true })
}
