import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import StoreBanner from "@modules/store/components/store-banner"
import Breadcrumb from "@modules/common/components/breadcrumb"
import PaginatedProducts from "./paginated-products"
import MobileActions from "../components/mobile-actions"

const StoreTemplate = ({
  sortBy,
  page,
  minPrice,
  maxPrice,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  minPrice?: string
  maxPrice?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="flex flex-col bg-bg min-h-screen">
      <StoreBanner />
      
      <div className="flex flex-col py-8 px-4 md:px-8 max-w-[1540px] mx-auto w-full">
        {/* Breadcrumb section - hidden on mobile */}
        <div className="hidden md:block">
          <Breadcrumb 
            items={[
              { label: "Home", href: "/" },
              { label: "Browse Products" }
            ]} 
          />
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          <div className="hidden lg:block w-full lg:w-[280px] shrink-0 sticky top-24">
            <RefinementList sortBy={sort} />
          </div>
          <div className="w-full flex-1">
            <Suspense fallback={<SkeletonProductGrid />}>
              <PaginatedProducts
                sortBy={sort}
                page={pageNumber}
                minPrice={minPrice}
                maxPrice={maxPrice}
                countryCode={countryCode}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom Actions */}
      <MobileActions sortBy={sort} />
    </div>
  )
}

export default StoreTemplate
