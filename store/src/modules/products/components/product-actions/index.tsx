"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useUI } from "@lib/context/ui-context"
import { useCart } from "@lib/context/cart-context"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  if (!variantOptions) return {}

  return variantOptions.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  region,
  disabled,
}: ProductActionsProps) {
  const [options, setOptions] = useState<Record<string, string>>({})
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addItem } = useCart()
  const { openCartSidebar } = useUI()

  const countryCode = useParams().countryCode as string

  // If there's only one variant, pre-select its options
  useEffect(() => {
    if (product.variants?.length === 1 && product.variants[0].options) {
      setOptions(optionsAsKeymap(product.variants[0].options))
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return undefined

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Function to check if a specific option value combination is available (has stock)
  const isOptionAvailable = (optionId: string, value: string) => {
    if (!product.variants) return false
    
    // Try to find ANY variant that has this value and is in stock
    return product.variants.some(v => {
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
      if (v.manage_inventory === false) return true
      return (v.inventory_quantity || 0) > 0
    })
  }

  // Determine if the current selection is out of stock
  const isOutOfStock = useMemo(() => {
    if (selectedVariant) {
      if (selectedVariant.manage_inventory === false) return false
      return (selectedVariant.inventory_quantity || 0) <= 0
    }
    return false
  }, [selectedVariant])

  const updateOption = (id: string, value: string) => {
    setOptions((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddToCart = async () => {
    if (!selectedVariant?.id || isOutOfStock) return

    setIsAdding(true)
    setIsAdded(true)
    openCartSidebar()
    
    const timer = setTimeout(() => setIsAdded(false), 2000)

    try {
      await addItem(selectedVariant.id, 1, countryCode)
    } catch (e) {
      setIsAdded(false)
      clearTimeout(timer)
    } finally {
      setIsAdding(false)
    }
  }

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  return (
    <>
      <div className="flex flex-col gap-y-12" ref={actionsRef}>
        <div>
          {product.variants && product.variants.length > 1 && (
            <div className="flex flex-col gap-y-8">
              {(product.options || []).map((option) => (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={updateOption}
                    title={option.title || ""}
                    disabled={!!disabled || isAdding}
                    // Pass availability logic or specific map
                    availableValues={
                      (option.values || []).map(v => v.value).filter(val => isOptionAvailable(option.id, val))
                    }
                  />
                </div>
              ))}
              <Divider />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-y-4">
          <ProductPrice product={product} variant={selectedVariant}  />
          
          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || !!disabled || isAdding || isOutOfStock}
            variant="primary"
            className="w-full h-14 bg-bg text-accent font-manrope text-[13px] font-bold tracking-[0.3em] uppercase transition-all duration-300 hover:bg-bg/90"
            data-testid="add-product-button"
          >
            {!selectedVariant
              ? "Select Option"
              : isOutOfStock
              ? "Out of Stock"
              : isAdded 
              ? "Added \u2713"
              : "Add to Experience"}
          </Button>
        </div>
      </div>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOption={updateOption}
        inStock={!isOutOfStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
        isOptionAvailable={isOptionAvailable}
      />
    </>
  )
}
