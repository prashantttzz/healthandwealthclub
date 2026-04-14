import { retrieveCart } from "@lib/data/cart"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import { RegionProvider } from "@lib/context/region-context"
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
  const { countryCode } = await props.params

  const [customer, cart, regions] = await Promise.all([
    retrieveCustomer(),
    retrieveCart(),
    listRegions(),
  ])

  return (
    <RegionProvider regions={regions || []} countryCode={countryCode}>
      <CartInitializer cart={cart} />
      <CartSidebar />
      <Nav />
      {props.children}
      <Footer />
    </RegionProvider>
  )
}
