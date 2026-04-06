import NavContent from "@modules/layout/components/nav-content"
import CartButton from "@modules/layout/components/cart-button"

export default async function Nav() {
  return <NavContent cartButton={<CartButton />} />
}