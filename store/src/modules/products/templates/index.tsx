"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { notFound, usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { isEqual } from "lodash"
import { clx } from "@medusajs/ui"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { getProductPrice } from "@lib/util/get-product-price"
import CraftsmanshipSection from "../components/craftsmanship-section"
import ProductTabs from "../components/product-tabs"
import ProductReviews from "../components/product-reviews"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  relatedProducts: React.ReactNode
}

const optionsAsKeymap = (variantOptions: HttpTypes.StoreProductVariant["options"]) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  countryCode,
  relatedProducts,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const actionsRef = useRef<HTMLDivElement>(null)
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      const variantFromUrl = product.variants.find(v => v.id === searchParams.get("v_id"))
      const initialVariant = variantFromUrl || product.variants[0]
      const variantOptions = optionsAsKeymap(initialVariant.options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants, searchParams])

  const selectedVariant = useMemo(() => {
    if (!product.variants) return
    return product.variants.find((v) => isEqual(optionsAsKeymap(v.options), options))
  }, [product.variants, options])

  const isValidVariant = !!selectedVariant

  const updateOption = (optionId: string, value: string) => {
    setOptions((prev) => ({ ...prev, [optionId]: value }))
  }

  useEffect(() => {
    if (isValidVariant && selectedVariant?.id) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("v_id", selectedVariant.id)
      router.replace(pathname + "?" + params.toString(), { scroll: false })
    }
  }, [selectedVariant, isValidVariant, pathname, router, searchParams])

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return
    setIsAdding(true)
    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
    })
    setIsAdding(false)
  }

  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: selectedVariant?.id,
  })
  const selectedPrice = selectedVariant ? variantPrice : cheapestPrice

  const [showDock, setShowDock] = useState(true)

  if (!product || !product.id) return notFound()

  return (
    <>
      <div className="bg-bg w-full min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-24 lg:py-32 flex flex-col lg:flex-row items-start relative gap-x-12 lg:gap-x-24">
          <div className="w-full lg:w-[50%] space-y-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-white/50 group">
              <Image
                src={selectedVariant?.metadata?.image_url as string || product.images?.[0]?.url || ""}
                alt={product.title || "Product image"}
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(product.images || []).slice(1, 4).map((image, i) => (
                <div key={image.id} className="relative aspect-square w-full overflow-hidden bg-white/50">
                  <Image
                    src={image.url}
                    alt={`Product detail ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[40%]  flex flex-col pt-10 space-y-5 md:space-y-10">

            <div className="space-y-4">
              <span className="font-manrope text-xs md:text-[12x] tracking-[0.3em] uppercase font-regular text-accent/80 block">
                {product.collection?.title || "Limited Edition Collection"}
              </span>
              <h1 className="font-newsreader italic text-4xl lg:text-8xl leading-none text-accent tracking-tighter">
                {product.title}
              </h1>
              <p className="font-newsreader italic text-[15px] md:text-[20px] text-accent/60">
                {selectedVariant?.title || "Experience Selection"}
              </p>
            </div>

            {/* Pricing */}
            <div className="text-2xl md:text-3xl font-manrope font-light tracking-tight text-accent">
              {selectedPrice?.calculated_price}
            </div>

            {/* Description */}
            <div className="max-w-md">
              <p className="font-manrope text-[15px] leading-relaxed font-regular text-black/50 whitespace-pre-line">
                {product.description}
              </p>
            </div>
            <div className="space-y-12" ref={actionsRef}>
              {(product.options || []).map((option) => {
                const isColor = option.title?.toLowerCase() === "color"
                const current = options[option.id]

                return (
                  <div key={option.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-manrope text-[10px] tracking-[0.2em] uppercase font-bold text-accent/90">
                        Select {option.title}
                      </span>
                      {option.title?.toLowerCase() === "size" && (
                        <button className="font-manrope text-[9px] tracking-[0.2em] uppercase font-regular text-accent/90 hover:text-accent transition-colors">
                          Size Guide
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {(option.values || []).map((v) => {
                        const isSelected = v.value === current
                        if (isColor) {
                          const colorMap: Record<string, string> = {
                            olive: "#3E4437",
                            black: "#1a1a1a",
                            cream: "#E8E4D9",
                            white: "#FFFFFF",
                            tan: "#C4A484",
                          }
                          const colorHex = colorMap[v.value.toLowerCase()] || "#cccccc"
                          return (
                            <button
                              key={v.id}
                              onClick={() => updateOption(option.id, v.value)}
                              className={clx("w-10 h-10 rounded-xl border transition-all relative flex items-center justify-center", {
                                "border-accent scale-110": isSelected,
                                "border-accent/10 hover:border-accent/30": !isSelected,
                              })}
                            >
                              <div className="w-9 h-9  rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: colorHex }} />
                            </button>
                          )
                        }
                        return (
                          <button
                            key={v.id}
                            onClick={() => updateOption(option.id, v.value)}
                            className={clx("relative  px-5  py-3 text-[13px] font-manrope tracking-widest uppercase transition-all", {
                              "text-accent font-bold border-b-2 border-black bg-accent/10 ": isSelected,
                              "text-accent/30 hover:text-accent/60 border-b border-black/30": !isSelected,
                            })}
                          >
                            {v.value}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ACTION */}
            <div className="pt-6">
              <button
                onClick={handleAddToCart}
                disabled={!isValidVariant || isAdding}
                className={clx(
                  "w-full h-16 bg-accent text-bg font-manrope text-[12px] font-bold tracking-[0.4em] uppercase transition-all duration-500 overflow-hidden relative group",
                  { "opacity-50 cursor-not-allowed": !isValidVariant || isAdding }
                )}
              >
                <span className="relative z-10">
                  {isAdding ? "Processing Experience..." : (isValidVariant ? "Add to Experience →" : "Select Selection")}
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
            </div>

            {/* PRODUCT TABS */}
            <div className="pt-4 mt-8">
              <ProductTabs product={product} />
            </div>
          </div>

        </div>
        <ProductReviews productId={product.id} />
        <CraftsmanshipSection />
        {relatedProducts}
      </div>

      {/* MOBILE FLOATING DOCK */}
      <AnimatePresence>
        {showDock && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden"
          >
            <div className="bg-bg/80 backdrop-blur-xl border-t border-black/5 px-4 py-4 pb-8 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <p className="font-newsreader italic text-[18px] text-accent truncate max-w-[140px]">
                  {product.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-manrope text-[10px] font-bold uppercase tracking-widest text-accent/40">
                    {selectedVariant?.title || "Quantity: 1"}
                  </span>
                  <span className="text-accent/20">•</span>
                  <span className="font-manrope text-[10px] font-bold uppercase tracking-widest text-accent">
                    {selectedPrice?.calculated_price}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* QUICK SELECTION ACCESS */}
                <button 
                  onClick={() => actionsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-14 aspect-square bg-accent/5 flex items-center justify-center rounded-xl border border-black/5 active:scale-95 transition-all"
                >
                  <span className="font-manrope text-[10px] font-bold uppercase tracking-widest">Op</span>
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!isValidVariant || isAdding}
                  className={clx(
                    "flex-1 h-14 px-6 bg-accent text-bg font-manrope text-[10px] font-bold tracking-[0.2em] uppercase rounded-xl transition-all active:scale-95 flex items-center justify-center",
                    { "opacity-50": !isValidVariant || isAdding }
                  )}
                >
                  {isAdding ? "..." : "Add to Cart →"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductTemplate
