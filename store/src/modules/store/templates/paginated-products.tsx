import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  price?: {
    min?: number
    max?: number
  }
}

import SortDropdown from "@modules/store/components/refinement-list/sort-dropdown"
import MobileFilterBar from "@modules/store/components/mobile-filter-bar"

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  minPrice,
  maxPrice,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  minPrice?: string
  maxPrice?: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  if (minPrice || maxPrice) {
    queryParams["price"] = {
      ...(minPrice ? { min: parseInt(minPrice) } : {}),
      ...(maxPrice ? { max: parseInt(maxPrice) } : {}),
    }
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
   console.log("products",products)
  return (
    <>
      {/* Dynamic Results Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-[14px] font-manrope font-medium text-accent">
            Showing <span className="font-bold">{products.length}</span> results from total <span className="font-bold">{count}</span> for <span className="italic">"{categoryId || 'the collection'}"</span>
          </h2>
        </div>
        
        <SortDropdown sortBy={sortBy} />
      </div>

      {/* Applied Filters Bar (Dynamic) */}
      <div className="flex flex-wrap items-center gap-2 mb-8 h-10 border-y border-black/5">
        <span className="text-[10px] text-accent/50 uppercase font-bold tracking-[0.2em] mr-2">Applied Filters:</span>
        {minPrice && (
          <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-black/5 rounded-full text-[10px] font-bold text-accent italic">
            Min: {minPrice}
            <button className="hover:text-red-500 transition-colors">×</button>
          </div>
        )}
        {maxPrice && (
          <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-black/5 rounded-full text-[10px] font-bold text-accent italic">
            Max: {maxPrice}
            <button className="hover:text-red-500 transition-colors">×</button>
          </div>
        )}
        {(categoryId || minPrice || maxPrice) ? (
          <LocalizedClientLink 
            href="/store"
            className="text-[10px] text-accent/40 hover:text-red-500 underline underline-offset-4 ml-2 transition-colors"
          >
            Clear all
          </LocalizedClientLink>
        ) : (
          <span className="text-[10px] text-accent/20 italic font-medium tracking-widest">None</span>
        )}
      </div>

      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
        data-testid="products-list"
      >
        {products.map((p) => {
          return (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}
