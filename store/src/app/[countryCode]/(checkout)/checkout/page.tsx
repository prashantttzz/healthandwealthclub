import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CheckoutFlow from "@modules/checkout/components/checkout-flow"
import { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Checkout",
}

export const dynamic = "force-dynamic"

export default async function Checkout() {
  const cart = await retrieveCart()

  if (!cart) {
    return redirect("/")
  }


  const customer = await retrieveCustomer()

  return <CheckoutFlow cart={cart} customer={customer} />
}
