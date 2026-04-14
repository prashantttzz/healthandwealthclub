import { retrieveCart } from "@lib/data/cart"
import { listRegions } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import { RegionProvider } from "@lib/context/region-context"
import CartInitializer from "@modules/cart/components/cart-initializer"

export default async function CheckoutLayout(props: {
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
      {props.children}
    </RegionProvider>
  )
}
