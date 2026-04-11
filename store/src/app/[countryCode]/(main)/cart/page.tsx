import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export const dynamic = "force-dynamic"

export default async function Cart(props: {
  params: Promise<{ countryCode: string }>
}) {
  const [cart, customer] = await Promise.all([
    retrieveCart().catch((error) => {
      console.error(error)
      return null
    }),
    retrieveCustomer(),
  ])

  if (!cart) {
    return notFound()
  }

  return <CartTemplate cart={cart} customer={customer} />
}
