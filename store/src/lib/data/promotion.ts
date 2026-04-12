// lib/get-eligible-promotions.ts
export async function getEligiblePromotions() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/promotions`,
    {
      credentials: "include", // sends customer session cookie
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
      cache: "no-store",
    }
  )
  const data = await res.json()
  return data.promotions ?? []
}