import NavContent from "@modules/layout/components/nav-content"
import CartButton from "@modules/layout/components/cart-button"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"

export default async function Nav() {
  const categories = await listCategories()
  const { collections } = await listCollections()

  return (
    <NavContent 
      cartButton={<CartButton />} 
      categories={categories}
      collections={collections}
    />
  )
}