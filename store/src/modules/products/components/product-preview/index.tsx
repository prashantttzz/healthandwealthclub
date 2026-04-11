import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

export default function ProductPreview({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
}) {
  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block w-full"
    >
      <div data-testid="product-wrapper" className="relative flex flex-col gap-3">
        
        {/* Image Container */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F9F6F2]">
          <Image
            src={product.thumbnail || ""}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
      
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-manrope text-sm font-regular text-accent ">
                {product.title}
              </h3>
              <div className="font-manrope text-[11px] text-accent/90 font-medium">
                {product.variants?.length || 1} {product.variants?.length === 1 ? 'Color' : 'Colors'}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="font-manrope text-[11px] md:text-sm font-bold text-accent">
                {(product as any).variants?.[0]?.calculated_price?.calculated_amount || "$85"} EUR
              </div>
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}