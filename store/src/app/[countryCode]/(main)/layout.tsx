import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import Nav from "@modules/layout/templates/nav"
import Footer from "@modules/layout/templates/footer"
import CartInitializer from "@modules/cart/components/cart-initializer"
import CartSidebar from "@modules/cart/components/cart-sidebar"

export default async function PageLayout(props: {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()

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
