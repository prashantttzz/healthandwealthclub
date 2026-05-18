import NavContent from "@modules/layout/components/nav-content"
import CartButton from "@modules/layout/components/cart-button"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { retrieveCustomer } from "@lib/data/customer"

export default async function Nav() {
  const [categories, { collections }, customer] = await Promise.all([
    listCategories(),
    listCollections(),
    retrieveCustomer(),
  ])

  return (
    <NavContent 
      cartButton={<CartButton />} 
      categories={categories}
      collections={collections}
      customer={customer}
    />
  )
}
