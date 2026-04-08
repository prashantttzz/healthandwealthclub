import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="space-y-6 lg:space-y-8 mt-5">
      <div className="flex flex-col gap-y-2">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="font-manrope text-[10px] tracking-[0.5em] uppercase font-bold text-accent/40 hover:text-accent transition-colors duration-300"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
           <h1
            className="font-manrope text-xs tracking-widest mb-3 uppercase font-regular text-accent/80 hover:text-accent transition-colors duration-300"
          >
            LIMTED EDITON COLLECTION
          </h1>
      
        <h1 
          className="font-newsreader italic text-5xl lg:text-7xl leading-[1.1] text-accent tracking-tighter"
          data-testid="product-title"
        >
          {product.title}
        </h1>
        <p className="font-newsreader text-base italic mb-3 font-regular text-accent/80 hover:text-accent transition-colors duration-300">Estate Olive</p>
      </div>
         <div className="mt-5"></div>
      <div className="flex flex-col gap-y-4">
        <p 
          className="font-manrope text-[14px] leading-relaxed font-light text-accent/70 max-w-[450px] whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </p>
      </div>
    </div>
  )
}

export default ProductInfo
