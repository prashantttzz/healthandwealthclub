"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { useCart } from "@lib/context/cart-context"
import LocalizedPrice from "@modules/common/components/localized-price"
import Thumbnail from "@modules/products/components/thumbnail"
import { ArrowRight } from "lucide-react"
import { getDeliveryEstimate } from "@lib/util/delivery-estimate"

const Ico = {
  arrowRight: (c = "") => <ArrowRight className={c} strokeWidth={2} />,
}

const OrderSummary = ({
  currentStep,
  onContinue,
  selectedAddress,
  isLoadingShipping,
  selectedShippingPrice,
  selectedShippingOptionId,
  shippingOptions,
  isPlacingOrder,
}: {
  currentStep: number
  onContinue: () => void
  selectedAddress: HttpTypes.StoreCustomerAddress | null
  isLoadingShipping: boolean
  selectedShippingPrice?: number
  selectedShippingOptionId?: string | null
  shippingOptions?: HttpTypes.StoreCartShippingOption[]
  isPlacingOrder?: boolean
}) => {
  const { cart, optimisticItems: items, subtotal } = useCart()
  const label = currentStep === 0 ? "PROCEED TO ADDRESS" : currentStep === 1 ? "CONTINUE" : "PLACE ORDER"

  if (!cart) return null

  const deliveryEstimate = getDeliveryEstimate({
    countryCode: selectedAddress?.country_code || cart.shipping_address?.country_code,
    baseDate: cart.created_at,
  })

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-newsreader italic text-2xl text-bg">Order Summary</h3>
      </div>
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center bg-secondaryAccent gap-5 pb-4 border p-2 border-secondaryAccent">
            <div className="w-16 h-20 overflow-hidden flex-shrink-0">
              <Thumbnail thumbnail={item.thumbnail} size="square" />
            </div>
            <div className="min-w-0">
              <p className="font-manrope text-[14px] font-bold text-bg truncate">{item.product_title}</p>
              <p className="font-manrope text-[12px] text-bg/30 uppercase tracking-widest mt-0.5">
                {item.variant?.title} · Qty: {item.quantity}
              </p>
              <p className="font-manrope text-[11px] text-bg/60 mt-1">
                Delivery by <span className="font-bold text-bg">{deliveryEstimate.formattedDate}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 font-manrope text-[13px] uppercase font-regular">
        <div className="flex justify-between">
          <span className="text-bg">Total MRP</span>
          <span className="text-bg font-semibold"><LocalizedPrice amount={subtotal || 0} /></span>
        </div>

        {(cart.discount_total ?? 0) > 0 && (
          <div className="flex justify-between font-bold">
            <span className="text-green-700">Discount</span>
            <span className="text-green-700">- <LocalizedPrice amount={cart.discount_total || 0} /></span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-bg">Delivery Fee</span>
          <span className={(selectedShippingPrice ?? cart.shipping_total ?? 0) === 0 ? "text-bg italic" : "text-bg font-semibold"}>
            {(selectedShippingPrice ?? cart.shipping_total ?? 0) === 0
              ? currentStep === 0 ? "Calculated at next step" : "Free"
              : <LocalizedPrice amount={selectedShippingPrice ?? cart.shipping_total ?? 0} />}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-bg">Delivery ETA</span>
          <span className="text-bg font-semibold">{deliveryEstimate.formattedDate}</span>
        </div>

        {(cart.tax_total ?? 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-bg">Taxes</span>
            <span className="text-bg font-semibold"><LocalizedPrice amount={cart.tax_total || 0} /></span>
          </div>
        )}
      </div>
      <div className="border-t border-dashed border-bg/10 pt-6 flex justify-between items-center">
        <span className="font-newsreader italic text-2xl text-bg">Total Payable</span>
        <span className="font-manrope text-xl text-bg font-semibold">
          <LocalizedPrice amount={(subtotal || 0) - (cart.discount_total ?? 0) + (selectedShippingPrice ?? cart.shipping_total ?? 0) + (cart.tax_total ?? 0)} />
        </span>
      </div>
      <button
        onClick={onContinue}
        disabled={
          (currentStep === 1 && (!selectedAddress || (shippingOptions?.length || 0) === 0 || !selectedShippingOptionId || isLoadingShipping)) ||
          isPlacingOrder
        }
        className="w-full py-5 bg-bg text-accent font-manrope text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-bg/90 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {(currentStep === 1 && isLoadingShipping) || isPlacingOrder ? "Processing..." : label} {Ico.arrowRight("w-4 h-4 group-hover:translate-x-1 transition-transform")}
      </button>
      <p className="font-manrope text-[10px] text-bg/80 text-center tracking-widest leading-relaxed">
        No refunds, no exchange. <br />
        By continuing, you agree to our Terms of Use and Privacy Policy.
      </p>
    </div>
  )
}

export default OrderSummary
