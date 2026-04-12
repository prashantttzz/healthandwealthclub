import type { MedusaRequest, MedusaResponse, MedusaStoreRequest } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaStoreRequest, res: MedusaResponse) => {
  const promotionService = req.scope.resolve(Modules.PROMOTION)
  const customerService = req.scope.resolve(Modules.CUSTOMER)

  // Optionally get the logged-in customer
  const customerId = req.auth_context?.actor_id

  // Fetch all active promotions with is_automatic=false (coupon codes only)
  const [promotions] = await promotionService.listAndCountPromotions(
    { is_automatic: false, status: ["active"] },
    {
      select: ["id", "code", "type", "status", "application_method"],
      relations: ["application_method", "rules", "rules.values"],
    }
  )

  let eligiblePromos = promotions

  // If customer is logged in, filter by customer group rules
  if (customerId) {
    const customer = await customerService.retrieveCustomer(customerId, {
      relations: ["groups"],
    })

    const customerGroupIds = customer.groups?.map((g) => g.id) ?? []

    eligiblePromos = eligiblePromos.filter((promo) => {
      const groupRules = promo.rules?.filter(
        (r) => r.attribute === "customer_group_id"
      )
      // If no group rules, promo is open to everyone
      if (!groupRules || groupRules.length === 0) return true
      // Otherwise check if customer is in the required group
      return groupRules.some((r) =>
        customerGroupIds.includes(r.values?.[0]?.value as string)
      )
    })
  } else {
    // Only show promos with no customer group restriction to guests
    eligiblePromos = eligiblePromos.filter((promo) => {
      const groupRules = promo.rules?.filter(
        (r) => r.attribute === "customer_group_id"
      )
      return !groupRules || groupRules.length === 0
    })
  }

  res.json({ promotions: eligiblePromos })
}