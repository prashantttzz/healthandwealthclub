import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { getProductPrice } from "@lib/util/get-product-price"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const queryParams: HttpTypes.StoreProductListParams = {}
  if (region?.id) {
    queryParams.region_id = region.id
  }
  if (product.collection_id) {
    queryParams.collection_id = [product.collection_id]
  }
  queryParams.is_giftcard = false

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) => {
    return response.products.filter(
      (responseProduct) => responseProduct.id !== product.id
    ).slice(0, 4)
  })

  if (!products.length) {
    return null
  }

  return (
    <div className="bg-bg py-24 lg:py-32 border-t border-black/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <span className="font-manrope text-[10px] tracking-[0.3em] uppercase font-bold text-accent/70 block leading-none">
              CURATION
            </span>
            <h2 className="font-newsreader italic text-4xl lg:text-6xl leading-tight text-accent tracking-tighter">
              Complete the Look
            </h2>
          </div>
          
          <LocalizedClientLink 
            href="/store"
            className="font-manrope text-[10px] font-bold tracking-[0.2em] uppercase text-accent border-b border-accent/20 pb-0.5 hover:opacity-60 transition-all mb-2"
          >
            SHOP ALL
          </LocalizedClientLink>
        </div>

        {/* Minimalist Grid - No Shop Now footer to match reference */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-10 gap-y-12">
          {products.map((p) => {
            const { cheapestPrice } = getProductPrice({ product: p })
            return (
              <LocalizedClientLink 
                key={p.id} 
                href={`/products/${p.handle}`}
                className="group flex flex-col space-y-5"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-white/40">
                  <Image
                    src={p.thumbnail || p.images?.[0]?.url || ""}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-1.5 px-0.5">
                  <h3 className="font-manrope text-[12px] tracking-[0.15em] uppercase font-bold text-accent leading-none">
                    {p.title}
                  </h3>
                  <p className="font-manrope text-[12px] text-accent/80 font-medium">
                    {cheapestPrice?.calculated_price}
                  </p>
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
