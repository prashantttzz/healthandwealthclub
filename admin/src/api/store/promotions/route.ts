import type { MedusaRequest, MedusaResponse, MedusaStoreRequest } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaStoreRequest, res: MedusaResponse) => {
  const promotionService = req.scope.resolve(Modules.PROMOTION)
  const customerService = req.scope.resolve(Modules.CUSTOMER)
  const cartService = req.scope.resolve(Modules.CART)
  const orderService = req.scope.resolve(Modules.ORDER)

  const customerId = req.auth_context?.actor_id
  const cartId = req.query.cart_id as string

  // 1. Fetch all candidate promotions
  const [promotions] = await promotionService.listAndCountPromotions(
    { is_automatic: false, status: ["active"] },
    {
      select: ["id", "code", "type", "status", "application_method"],
      relations: ["application_method", "rules", "rules.values"],
    }
  )

  // 2. Fetch Context Data
  let cart: any = null
  if (cartId) {
    cart = await cartService.retrieveCart(cartId).catch(() => null)
  }

  let orderCount = 0
  let customerGroups: string[] = []
  if (customerId) {
    const customer = await customerService.retrieveCustomer(customerId, {
      relations: ["groups"],
    }).catch(() => null)
    
    if (customer) {
      customerGroups = customer.groups?.map((g: any) => g.id) ?? []
      const [, count] = await orderService.listAndCountOrders({ customer_id: customerId }).catch(() => [0, 0])
      orderCount = count
    }
  }

  // 3. Filter by eligibility
  const eligiblePromos = promotions.filter((promo: any) => {
    const rules = promo.rules || []

    // Rule A: Customer Group Restriction
    const groupRules = rules.filter((r: any) => r.attribute === "customer_group_id")
    if (groupRules.length > 0) {
      const allowedGroups = groupRules.flatMap((r: any) => r.values?.map((v: any) => v.value) || [])
      const isMember = customerGroups.some(id => allowedGroups.includes(id))
      if (!isMember) return false
    } else if (customerId === undefined) {
      // If there are specific groups but no customer is logged in, hide it?
      // Actually, standard group rules often imply restriction.
    }

    // Rule B: First Order Only
    // Custom check for "first_order" attribute in rules
    const firstOrderRule = rules.find((r: any) => r.attribute === "is_first_order" || r.attribute === "first_order")
    if (firstOrderRule) {
      const isFirstOrderRequired = firstOrderRule.values?.[0]?.value === "true" || firstOrderRule.values?.[0]?.value === "1"
      if (isFirstOrderRequired && orderCount > 0) return false
    }

    // Rule C: Minimum Subtotal
    // We check against application_method rules if they exist
    const subtotalRule = rules.find((r: any) => r.attribute === "total" || r.attribute === "subtotal")
    if (subtotalRule && cart) {
      const minAmount = parseFloat(subtotalRule.values?.[0]?.value as string || "0")
      if (cart.subtotal < minAmount) return false
    }

    return true
  })

  res.json({ promotions: eligiblePromos })
}