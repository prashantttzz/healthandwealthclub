import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  q?: string
}

import SortDropdown, { SortOptions } from "@modules/store/components/refinement-list/sort-dropdown"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function PaginatedProducts({
  sortBy,
  page,
  categoryId,
  productsIds,
  collectionId,
  countryCode,
  search,
  size,
  color,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  search?: string
  size?: string
  color?: string
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

  if (search) {
    queryParams["q"]  = search
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
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
    sizes: size ? size.split(",") : undefined,
    colors: color ? color.split(",") : undefined,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
   console.log("products",products)

  // Parse active filters for display
  const activeSizes = size ? size.split(",") : []
  const activeColors = color ? color.split(",") : []
  const hasActiveFilters = categoryId || activeSizes.length > 0 || activeColors.length > 0 || search

  return (
    <>
      {/* Dynamic Results Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-[14px] font-manrope font-medium text-accent">
            Showing <span className="font-bold">{products.length}</span> results from total <span className="font-bold">{count}</span>
            {search && <span className="text-accent/60"> for <span className="italic font-bold text-accent">"{search}"</span></span>}
            {categoryId && <span className="text-accent/60"> in <span className="italic font-bold text-accent">Selected Category</span></span>}
          </h2>
        </div>
        <SortDropdown sortBy={sortBy} />
      </div>

      {/* Applied Filters Bar (Dynamic) */}
      <div className="flex flex-wrap items-center gap-2 mb-8 h-10 border-y border-black/5">
        <span className="text-[10px] text-accent/90 uppercase font-semibold tracking-[0.1em] mr-2">Applied Filters:</span>

        {activeSizes.map(s => (
          <div key={s} className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-black/5 rounded-[4px] text-[10px] font-bold text-accent">
            Size: {s}
          </div>
        ))}
        {activeColors.map(c => (
          <div key={c} className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-black/5 rounded-[4px] text-[10px] font-bold text-accent">
            Color: {c}
          </div>
        ))}
        {search && (
          <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-black/5 rounded-[4px] text-[10px] font-bold text-accent">
            Search: {search}
          </div>
        )}
        {categoryId && (
          <div className="flex items-center gap-2 px-3 py-1 bg-accent/5 border border-black/5 rounded-[4px] text-[10px] font-bold text-accent">
            Category Selected
          </div>
        )}
        {hasActiveFilters ? (
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
              <ProductPreview product={p} />
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
