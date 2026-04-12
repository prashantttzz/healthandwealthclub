import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import Breadcrumb from "@modules/common/components/breadcrumb"
import PaginatedProducts from "./paginated-products"
import MobileActions from "../components/mobile-actions"

import { listCategories } from "@lib/data/categories"
import CustomOrderSection from "../../collections/components/custom-order-section"
import { SortOptions } from "../components/refinement-list/sort-dropdown"
import { getCollectionByHandle } from "@lib/data/collections"

const StoreTemplate = async ({
  sortBy,
  page,

  search,
  category,
  size,
  color,
  collection,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  search?: string
  category?: string
  size?: string
  color?: string
  collection?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const categories = await listCategories()
  let collectionId: string | undefined
  let collectionTitle: string | undefined
  if (collection) {
    const col = await getCollectionByHandle(collection)
    collectionId = col?.id
    collectionTitle = col?.title
  }

  return (
    <div className="flex flex-col bg-bg min-h-screen">
      {/* <StoreBanner /> */}
      <div className="sticky top-16 z-40 bg-bg border-b border-black/5 hidden md:block w-full">
        <div className="max-w-[1540px] mx-auto px-4 md:px-8">
          <Breadcrumb 
            items={[
              { label: "Home", href: "/" },
              { label: "Collection", href: "/store" },
              ...(collectionTitle ? [{ label: collectionTitle }] : [])
            ]} 
            className="py-5"
          />
        </div>
      </div>

      <div className="flex flex-col mt-10 py-8 px-4 md:px-8 max-w-[1540px] mx-auto w-full min-h-screen">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="hidden lg:block w-full lg:w-[280px] shrink-0 sticky top-24">
            <RefinementList 
              sortBy={sort} 
              categories={categories}
              activeCategory={category}
              activeSize={size}
              activeColor={color}
            />
          </div>
          <div className="w-full flex-1">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                search={search}
                categoryId={category}
                collectionId={collectionId}
                size={size}
                color={color}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
        <CustomOrderSection />
      </div>

      {/* Sticky Mobile Bottom Actions */}
      <MobileActions 
        sortBy={sort} 
        categories={categories}
        activeCategory={category}
        activeSize={size}
        activeColor={color}
      />
    </div>
  )
}

export default StoreTemplate
