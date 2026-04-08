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
      <div data-testid="product-wrapper" className="relative flex flex-col bg-bg overflow-hidden">

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

        {/* Color swatches */}
        <div className="bg-bg py-2 flex items-center justify-center gap-1.5 border-b border-black/5">
          {product.options
            ?.find(opt => opt.title?.toLowerCase() === "color")
            ?.values?.map((v: any, idx: number) => {
              const colorMap: Record<string, string> = {
                olive: "#2C3A2C",
                cream: "#F8F6F1",
                white: "#FFFFFF",
                black: "#1a1a1a",
                tan: "#D2B48C",
                navy: "#1a1f2c",
              }
              const colorHex = colorMap[v.value.toLowerCase()] || "#cccccc"
              
              return (
                <div
                  key={idx}
                  className="w-2.5 h-2.5 rounded-full border border-black/5 shadow-sm"
                  style={{ backgroundColor: colorHex }}
                  title={v.value}
                />
              )
            })}
          {(!product.options?.find(opt => opt.title?.toLowerCase() === "color")) && (
             <span className="font-manrope text-[8px] tracking-widest text-accent/20 uppercase">No variants</span>
          )}
        </div>

        {/* Shop Now Footer */}
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