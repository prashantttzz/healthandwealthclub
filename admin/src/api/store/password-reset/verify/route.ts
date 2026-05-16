import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ICacheService, IAuthModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { email, token, new_password } = req.body as any

  if (!email || !token || !new_password) {
    return res.status(400).json({ message: "Email, token, and new password are required" })
  }

  // Validate cache
  const cacheService: ICacheService = req.scope.resolve(Modules.CACHE)
  const cachedToken = await cacheService.get(`pw_reset:${email}`)

  if (cachedToken !== token) {
    return res.status(400).json({ message: "Invalid or expired reset token" })
  }

  try {
    // Update password in Auth Module for emailpass provider
    const authModuleService: IAuthModuleService = req.scope.resolve(Modules.AUTH)
    
    const updateRes = await authModuleService.updateProvider("emailpass", {
      entity_id: email,
      password: new_password,
    })

    if (!updateRes.success) {
      throw new Error(updateRes.error || "Failed to update password in Auth module")
    }

    // Delete token from cache so it cannot be reused
    await cacheService.invalidate(`pw_reset:${email}`)

    return res.json({ success: true, message: "Password updated successfully" })
  } catch (error: any) {
    const logger = req.scope.resolve("logger")
    logger.error("Error updating password: " + error.message)
    return res.status(500).json({ message: "Failed to update password" })
  }
}
