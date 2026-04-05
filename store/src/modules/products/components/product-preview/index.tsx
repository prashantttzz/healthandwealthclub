import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

import Image from "next/image"

export default async function ProductPreview({
  product,
  isFeatured,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
}) {
  return (
    <LocalizedClientLink 
      href={`/products/${product.handle}`} 
      className="group block w-full mx-auto max-w-[280px] sm:max-w-[400px]"
    >
      <div data-testid="product-wrapper" className="relative flex flex-col bg-white overflow-hidden">
        
        {/* 1. Image Container - Aspect ratio stays locked */}
        <div className="relative aspect-[419/502] w-full overflow-hidden">
          
          {/* 2. Sale Badge - Smaller on mobile */}
          <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
            <span className="bg-[#333d33] text-white text-[8px] md:text-[10px] tracking-widest uppercase px-2 py-0.5 md:px-3 md:py-1 rounded-full opacity-90">
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

        {/* 3. Shop Now Footer - Responsive padding and text */}
        <div className="bg-[#333d33] py-2.5 md:py-4 flex items-center justify-center gap-1.5 md:gap-2 text-white transition-colors group-hover:bg-[#2a322a]">
          <span className="font-gilda text-[10px] md:text-sm tracking-[0.15em] md:tracking-[0.2em] uppercase">
            Shop Now
          </span>
          <svg 
            className="w-3 h-3 md:w-4 md:h-4" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </LocalizedClientLink>
  )
}