"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { useCart } from "@lib/context/cart-context"
import { convertToLocale } from "@lib/util/money"
import Thumbnail from "@modules/products/components/thumbnail"
import { ArrowRight } from "lucide-react"

const Ico = {
  arrowRight: (c = "") => <ArrowRight className={c} strokeWidth={2} />,
}

const OrderSummary = ({ currentStep, onContinue, selectedAddress, isLoadingShipping }: {
  currentStep: number; 
  onContinue: () => void; 
  selectedAddress: HttpTypes.StoreCustomerAddress | null;
  isLoadingShipping: boolean;
}) => {
  const { cart, optimisticItems: items, subtotal } = useCart()
  const firstItem = items[0]
  const label = currentStep === 0 ? "PROCEED TO ADDRESS" : currentStep === 1 ? "CONTINUE" : "PLACE ORDER"

  if (!cart) return null

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-newsreader italic text-2xl text-bg">Order Summary</h3>
      </div>
      {firstItem && (
        <div className="flex items-center bg-secondaryAccent gap-5 pb-6 border p-2 border-secondaryAccent">
          <div className="w-16 h-20 overflow-hidden flex-shrink-0"><Thumbnail thumbnail={firstItem.thumbnail} size="square" /></div>
          <div className="min-w-0">
            <p className="font-manrope text-[14px] font-bold text-bg truncate">{firstItem.product_title}</p>
            <p className="font-manrope text-[12px] text-bg/30 uppercase tracking-widest mt-0.5">{firstItem.variant?.title} · Qty: {firstItem.quantity}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3 font-manrope text-[13px] uppercase font-regular">
        <div className="flex justify-between"><span className="text-bg">Total MRP</span><span className="text-bg font-semibold">{convertToLocale({ amount: subtotal || 0, currency_code: cart.currency_code })}</span></div>
        {(cart.discount_total ?? 0) > 0 && <div className="flex justify-between"><span className="text-bg">Discount</span><span className="text-green-700">- {convertToLocale({ amount: cart.discount_total || 0, currency_code: cart.currency_code })}</span></div>}
        <div className="flex justify-between">
          <span className="text-bg">Delivery Fee</span>
          <span className="text-green-700">
            {cart.shipping_total === 0 ? "Free" : convertToLocale({ amount: cart.shipping_total || 0, currency_code: cart.currency_code })}
          </span>
        </div>
      </div>
      <div className="border-t border-dashed border-bg/10 pt-6 flex justify-between items-center">
        <span className="font-newsreader italic text-2xl text-bg">Total Payable</span>
        <span className="font-manrope text-xl text-bg font-semibold">{convertToLocale({ amount: cart.total || (subtotal || 0) - (cart.discount_total || 0), currency_code: cart.currency_code })}</span>
      </div>
      <button onClick={onContinue} disabled={(currentStep === 1 && !selectedAddress) || isLoadingShipping}
        className="w-full py-5 bg-bg text-accent font-manrope text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-bg/90 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-30 disabled:cursor-not-allowed">
        {isLoadingShipping ? "Processing..." : label} {Ico.arrowRight("w-4 h-4 group-hover:translate-x-1 transition-transform")}
      </button>
      <p className="font-manrope text-[10px] text-bg/80 text-center tracking-widest leading-relaxed">
        No refunds, no exchange. <br />
        By continuing, you agree to our Terms of Use and Privacy Policy.
      </p>
    </div>
  )
}

export default OrderSummary
