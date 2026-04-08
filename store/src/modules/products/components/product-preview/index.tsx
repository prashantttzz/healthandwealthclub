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
      className="group block w-full mx-auto"
    >
      <div data-testid="product-wrapper" className="relative flex flex-col bg-bg overflow-hidden gap-5">

        {/* Image Container */}
        <div className="relative aspect-[419/502] w-full overflow-hidden">

          {/* Sale Badge */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
            <span className="bg-accent text-bg text-[8px] md:text-[10px] tracking-widest uppercase px-2 py-0.5 md:px-3 md:py-1 opacity-90">
              Sale
            </span>
          </div>

          <Image
            src={product.thumbnail || ""}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="bg-accent py-2.5 md:py-4 flex items-center justify-center gap-1.5 md:gap-2 text-bg transition-colors group-hover:opacity-90">
          <span className="font-manrope text-[10px] md:text-[11px] tracking-[0.2em] md:tracking-[0.3em] uppercase font-bold">
            Shop Now
          </span>
          <svg
            className="w-3 h-3 md:w-4 md:h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </LocalizedClientLink>
  )
}