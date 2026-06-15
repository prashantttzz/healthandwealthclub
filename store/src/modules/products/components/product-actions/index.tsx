"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button, clx, toast } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useUI } from "@lib/context/ui-context"
import { useCart } from "@lib/context/cart-context"
import { getProductPrice } from "@lib/util/get-product-price"

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
  const { addItem, optimisticItems } = useCart()
  const [isAdded, setIsAdded] = useState(false)
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

  const isAtMaximumQuantity = useMemo(() => {
    if (!selectedVariant || selectedVariant.manage_inventory === false) return false

    const cartItem = optimisticItems.find(
      (item) => item.variant_id === selectedVariant.id
    )
    const currentQty = cartItem?.quantity || 0

    return currentQty >= (selectedVariant.inventory_quantity || 0)
  }, [selectedVariant, optimisticItems])

  const lowStockMessage = useMemo(() => {
    if (!selectedVariant || selectedVariant.manage_inventory === false) return null

    const cartItem = optimisticItems.find(
      (item) => item.variant_id === selectedVariant.id
    )
    const currentQty = cartItem?.quantity || 0
    const remainingStock = Math.max(
      (selectedVariant.inventory_quantity || 0) - currentQty,
      0
    )

    if (remainingStock <= 0 || remainingStock > 3) return null
    if (remainingStock === 1) return "Only one left in stock"
    if (remainingStock === 2) return "Only two left in stock"

    return `Only ${remainingStock} left in stock`
  }, [selectedVariant, optimisticItems])

  const updateOption = (id: string, value: string) => {
    setOptions((prev) => ({ ...prev, [id]: value }))
  }

  const handleAddToCart = () => {
    if (!selectedVariant?.id || isOutOfStock) return

    if (isAtMaximumQuantity) {
      toast.error("You've reached the maximum available quantity for this item.")
      return
    }

    setIsAdded(true)
    openCartSidebar()

    const timer = setTimeout(() => setIsAdded(false), 2000)

    const { variantPrice, cheapestPrice } = getProductPrice({
      product,
      variantId: selectedVariant.id,
    })
    const priceObject = variantPrice || cheapestPrice
    const unitPrice = priceObject?.calculated_price_number || 0

    addItem(selectedVariant.id, 1, countryCode, {
      title: product.title,
      thumbnail: product.thumbnail,
      unit_price: unitPrice,
      product_handle: product.handle,
      variant: {
        title: selectedVariant.title,
        images: selectedVariant.images,
        product: {
          images: product.images
        }
      }
    }).catch((e) => {
      setIsAdded(false)
      clearTimeout(timer)
      console.error(e)
    })
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
                    disabled={!!disabled}
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
          <ProductPrice product={product} variant={selectedVariant} />

          <div className="flex flex-col gap-y-2">
            <Button
              onClick={handleAddToCart}
              disabled={!selectedVariant || !!disabled || isOutOfStock}
              variant="primary"
              className="w-full h-14 bg-bg text-accent font-manrope text-[13px] font-bold tracking-[0.3em] uppercase transition-all duration-300 hover:bg-bg/90"
              data-testid="add-product-button"
            >
              {!selectedVariant
                ? "Select Option"
                : isOutOfStock
                  ? "Out of Stock"
                  : isAtMaximumQuantity
                    ? "Maximum Quantity Reached"
                    : isAdded
                      ? "Added \u2713"
                      : "Add to Experience"}
            </Button>

            {lowStockMessage && (
              <p className="font-manrope text-[11px] uppercase tracking-[0.18em] text-ui-fg-subtle">
                {lowStockMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOption={updateOption}
        inStock={!isOutOfStock}
        isAtMaximumQuantity={isAtMaximumQuantity}
        handleAddToCart={handleAddToCart}
        isAdding={false}
        isAdded={isAdded}
        show={!inView}
        optionsDisabled={!!disabled}
        isOptionAvailable={isOptionAvailable}
      />
    </>
  )
}
