"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { notFound, usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"
import { isEqual } from "lodash"
import { clx } from "@medusajs/ui"
import { useCart } from "@lib/context/cart-context"
import { useUI } from "@lib/context/ui-context"
import { toast } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { getColorHex } from "@lib/util/get-color-hex"
import CraftsmanshipSection from "../components/craftsmanship-section"
import ProductTabs from "../components/product-tabs"
import ProductReviews from "../components/product-reviews"
import ImageCarousel from "../components/image-carousel"
import LocalizedPrice from "@modules/common/components/localized-price"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  relatedProducts: React.ReactNode
}

const optionsAsKeymap = (variantOptions: HttpTypes.StoreProductVariant["options"]) => {
  return (
    variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
      acc[varopt.option_id] = varopt.value
      return acc
    }, {} as Record<string, string>) || {}
  )
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
  const { addItem, optimisticItems } = useCart()
  const { openCartSidebar } = useUI()
  const [isAdding, setIsAdding] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
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

  const isAtMaximumQuantity = useMemo(() => {
    if (!selectedVariant || selectedVariant.manage_inventory === false) return false

    const cartItem = optimisticItems.find(
      (item) => item.variant_id === selectedVariant.id
    )
    const currentQty = cartItem?.quantity || 0

    return currentQty >= (selectedVariant.inventory_quantity || 0)
  }, [selectedVariant, optimisticItems])

  // Function to check if a specific option value combination is available (has stock)
  const isOptionAvailable = (optionId: string, value: string) => {
    if (!product.variants) return false
    
    // Try to find ANY variant that has this value and is in stock
    const isAvailable = product.variants.some(v => {
      // Must match the current other selected options
      const variantOptions = optionsAsKeymap(v.options)
      
      // Filter out variants that don't match OTHER currently selected options
      const matchesOtherOptions = Object.entries(options).every(([key, val]) => {
        if (key === optionId) return true // Ignore the option we are testing
        return variantOptions[key] === val
      })

      if (!matchesOtherOptions) return false

      // Check if this variant has this specific value
      if (variantOptions[optionId] !== value) return false

      // Check stock
      const manageInventory = v.manage_inventory ?? false
      const inventoryQuantity = v.inventory_quantity ?? 0

      return !manageInventory || inventoryQuantity > 0
    })

    return isAvailable
  }

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
    
    if (isAtMaximumQuantity) {
      toast.error("You've reached the maximum available quantity for this item.")
      return
    }

    // Optimistic UI updates
    setIsAdding(true)
    setIsSuccess(true)
    openCartSidebar()
    
    try {
      const optimisticData = {
        product_title: product.title || "",
        thumbnail: product.thumbnail || "",
        unit_price: selectedPrice?.calculated_price || 0,
        variant: {
          title: selectedVariant.title || "",
          product: {
            images: product.images || []
          }
        }
      }

      await addItem(selectedVariant.id, 1, countryCode, optimisticData)
      // Keep success state for a moment
      setTimeout(() => setIsSuccess(false), 2000)
    } catch (error) {
      setIsSuccess(false)
    } finally {
      setIsAdding(false)
    }
  }

  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: selectedVariant?.id,
  })
  const selectedPrice = selectedVariant ? variantPrice : cheapestPrice

  const [showDock, setShowDock] = useState(true)

  // Determine if we should show the selection options
  // Hide if there's ONLY one variant and its options are default/minimal
  const hasMultipleVariants = (product.variants?.length || 0) > 1
  const hasOptions = (product.options?.length || 0) > 0
  const showOptions = hasMultipleVariants || (hasOptions && product.options?.some(o => (o.values?.length || 0) > 1))

  const inStock = useMemo(() => {
    if (!selectedVariant) return false
    const manageInventory = selectedVariant.manage_inventory ?? false
    if (!manageInventory) return true
    return (selectedVariant.inventory_quantity ?? 0) > 0
  }, [selectedVariant])

  if (!product || !product.id) return notFound()
  return (
    <>
      <div className="bg-bg w-full min-h-screen">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-24 lg:py-32 flex flex-col lg:flex-row items-start relative gap-x-12 lg:gap-x-24">
          {/* PRODUCT IMAGE GALLERY */}
          <div className="w-full lg:w-[60%]">
            {/* Mobile Carousel */}
            <div className="lg:hidden mb-8">
              <ImageCarousel 
                images={product.images || []} 
                title={product.title || ""} 
              />
            </div>

            {/* Desktop Editorial Grid */}
            <div className="hidden lg:flex flex-col gap-4">
              <div 
                className="relative aspect-[4/5] w-full overflow-hidden bg-white/50 group border border-black/5"
              >
                <Image
                  src={selectedVariant?.metadata?.image_url as string || product.images?.[0]?.url || ""}
                  alt={product.title || "Product main image"}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {(product.images || []).slice(1, 4).map((image, i) => (
                  <div key={image.id} className="relative aspect-square w-full overflow-hidden bg-white/50 border border-black/5">
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
          </div>
          <div className="w-full lg:w-[40%]  flex flex-col  space-y-5 md:space-y-5">

            <div className="space-y-4">
              <span className="font-manrope text-xs md:text-[12x] tracking-[0.2em] uppercase font-regular text-accent/80 block">
                {product.collection?.title || "Limited Edition Collection"}
              </span>
              <h1 className="font-newsreader text-4xl lg:text-6xl leading-none text-accent  italic font-medium">
                {product.title}
              </h1>
              <p className="font-newsreader text-[13px] md:text-[15px] italic text-accent/60 font-regular">
                {showOptions ? (selectedVariant?.title || "Experience Selection") : ""}
              </p>
            </div>

            {/* Pricing */}
            <div className="text-2xl md:text-3xl font-manrope font-light tracking-tight text-accent">
           <LocalizedPrice amount={selectedPrice?.calculated_price_number}/>
            </div>

            {/* Description */}
         
            {showOptions && (
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
                          const isAvailable = isOptionAvailable(option.id, v.value)

                          if (isColor) {
                            const colorHexFromMetadata = (v.metadata?.visual as string) || (v.metadata?.hex as string) || (v.metadata?.color as string)
                            const colorHex = colorHexFromMetadata || getColorHex(v.value)
                            return (
                              <button
                                key={v.id}
                                disabled={!isAvailable}
                                onClick={() => updateOption(option.id, v.value)}
                                className={clx("w-10 h-10 border transition-all relative flex items-center justify-center", {
                                  "border-accent scale-110": isSelected,
                                  "border-accent/10 hover:border-accent/30": !isSelected && isAvailable,
                                  "opacity-40 cursor-not-allowed grayscale-[0.6] border-black/5": !isAvailable,
                                })}
                                title={v.value + (!isAvailable ? " (Out of Stock)" : "")}
                              >
                                <div className="w-9 h-9 shadow-inner border border-black/5" style={{ backgroundColor: colorHex }} />
                                {!isAvailable && (
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <div className="w-[120%] h-[2px] bg-red-500/80 rotate-45 absolute" />
                                    <div className="w-[120%] h-[2px] bg-red-500/80 -rotate-45 absolute" />
                                  </div>
                                )}
                              </button>
                            )
                          }
                          return (
                            <button
                              key={v.id}
                              disabled={!isAvailable}
                              onClick={() => updateOption(option.id, v.value)}
                              className={clx("relative px-5 py-3 text-[13px] font-manrope tracking-widest uppercase transition-all", {
                                "text-accent font-bold border-b-2 border-black bg-accent/10 ": isSelected,
                                "text-accent/30 hover:text-accent/60 border-b border-black/30": !isSelected && isAvailable,
                                "opacity-50 cursor-not-allowed": !isAvailable,
                              })}
                            >
                              <span className={clx({ "opacity-40": !isAvailable })}>{v.value}</span>
                              {!isAvailable && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                  <div className="w-[120%] h-[2px] bg-red-500/80 rotate-45 absolute" />
                                  <div className="w-[120%] h-[2px] bg-red-500/80 -rotate-45 absolute" />
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* ACTION / STOCK STATUS */}
            <div className="pt-6">
              {!inStock ? (
                <div className="p-8 border border-red-500/10 bg-red-500/[0.02] flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-manrope text-[11px] font-bold uppercase tracking-[0.2em] text-red-500">
                      Currently Unavailable
                    </p>
                    <p className="font-newsreader text-[14px] italic text-accent/60">
                      This selection is out of stock. Please check back soon.
                    </p>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={!isValidVariant || isAdding || isAtMaximumQuantity}
                  className={clx(
                    "w-full h-16 bg-accent text-bg font-manrope text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden relative group",
                    { "opacity-50 cursor-not-allowed": !isValidVariant || isAdding || isAtMaximumQuantity }
                  )}
                >
                  <span className="relative z-10">
                    {isSuccess ? "Added to Cart!" : (isAtMaximumQuantity ? "Limit Reached" : (isValidVariant ? "Add to cart →" : "Select Selection"))}
                  </span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </button>
              )}
            </div>
            <div className="max-w-md pt-8 border-t border-accent/10 mt-8">
              <p className="font-manrope text-[15px] leading-relaxed font-regular text-black/50 whitespace-pre-line">
                {product.description}
              </p>
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
                <p className="font-manrope font-bold uppercase tracking-widest text-[14px] text-accent truncate max-w-[140px]">
                  {product.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-manrope text-[10px] font-bold uppercase tracking-widest text-accent/40">
                    {showOptions ? (selectedVariant?.title || "Quantity: 1") : "Quantity: 1"}
                  </span>
                  <span className="text-accent/20">•</span>
                  <span className="font-manrope text-[10px] font-bold uppercase tracking-widest text-accent">
                    {!inStock ? "OUT OF STOCK" : <LocalizedPrice amount={selectedPrice?.calculated_price_number}/>}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* QUICK SELECTION ACCESS */}
                <button 
                  onClick={() => actionsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                  className="h-14 aspect-square bg-accent/5 flex items-center justify-center border border-black/5 active:scale-95 transition-all"
                >
                  <span className="font-manrope text-[10px] font-bold uppercase tracking-widest">Op</span>
                </button>
                
                <button
                  onClick={handleAddToCart}
                  disabled={!isValidVariant || isAdding || !inStock || isAtMaximumQuantity}
                  className={clx(
                    "flex-1 h-14 px-6 bg-accent text-bg font-manrope text-[10px] font-bold tracking-[0.2em] uppercase transition-all active:scale-95 flex items-center justify-center",
                    { "opacity-50": !isValidVariant || isAdding || !inStock || isAtMaximumQuantity }
                  )}
                >
                  {isSuccess ? "Added!" : (isAdding ? "..." : (!inStock ? "Out of Stock" : (isAtMaximumQuantity ? "Limit Reached" : "Add to Cart →")))}
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
