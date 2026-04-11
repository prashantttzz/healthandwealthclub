import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import Nav from "@modules/layout/templates/nav"
import Footer from "@modules/layout/templates/footer"
import CartInitializer from "@modules/cart/components/cart-initializer"
import dynamic from "next/dynamic"

const CartSidebar = dynamic(
  () => import("@modules/cart/components/cart-sidebar")
)

export default async function PageLayout(props: {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const [customer, cart] = await Promise.all([
    retrieveCustomer(),
    retrieveCart(),
  ])

  return (
    <>
      <CartInitializer cart={cart} />
      <CartSidebar />
      <Nav />
      {props.children}
      <Footer />
    </>
  )
}
