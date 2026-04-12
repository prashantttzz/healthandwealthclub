import { sdk } from "../config"

export async function getEligiblePromotions(cartId?: string) {
  try {
    const { promotions } = await sdk.client.fetch<{ promotions: any[] }>(
      "/store/promotions",
      {
        method: "GET",
        query: {
          fields: "*application_method",
          cart_id: cartId,
        },
        next: {
          revalidate: 0,
        },
        cache: "no-store",
      }
    )
    return promotions ?? []
  } catch (error) {
    console.error("Error fetching promotions:", error)
    return []
  }
}