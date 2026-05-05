import { getColorHex } from "@lib/util/get-color-hex"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import LocalizedPrice from "@modules/common/components/localized-price"
import Image from "next/image"

export default function ProductPreview({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })
  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block w-full"
      target="_blank"
      rel="noreferrer"
    >
      <div data-testid="product-wrapper" className="relative flex flex-col gap-3">
        
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F9F6F2]">
          <Image
            src={product.thumbnail || "/placeholder.png"}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
      
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1.5 px-1">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <h3 className="font-manrope text-[12px] md:text-[14px] font-regular text-accent tracking-tight leading-tight">
                {product.title}
              </h3>
                 <div className="font-manrope text-[13px] font-bold text-accent">
                {cheapestPrice ? (
                  <LocalizedPrice amount={cheapestPrice.calculated_price_number} />
                ) : (
                  "N/A"
                )}
              </div>
             
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}