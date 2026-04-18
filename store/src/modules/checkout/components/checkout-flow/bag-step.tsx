"use client"

import React, { useState } from "react"
import { useCart } from "@lib/context/cart-context"
import { applyPromotions } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { toast } from "@medusajs/ui"
import LocalizedPrice from "@modules/common/components/localized-price"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { X, Minus, Plus, ShoppingBag, Tag, ChevronRight } from "lucide-react"
import CouponSidebar from "./coupon-sidebar"

const Ico = {
  x: (c = "") => <X className={c} strokeWidth={2} />,
  minus: (c = "") => <Minus className={c} strokeWidth={2.5}  />,
  plus: (c = "") => <Plus className={c} strokeWidth={2.5} />,
  tag: (c = "") => <Tag className={c} strokeWidth={1.5} />,
  bag: (c = "") => <ShoppingBag className={c} strokeWidth={1.5} />,
  chevRight: (c = "") => <ChevronRight className={c} strokeWidth={2} />,
}

const BagStep = ({ onContinue }: { onContinue: () => void }) => {
  const { optimisticItems: items, updateQuantity, removeItem, cart } = useCart()
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [couponOpen, setCouponOpen] = useState(false)

  const changeQty = async (item: HttpTypes.StoreCartLineItem, qty: number) => {
    if (qty < 1) return

    const inventory = item.variant?.inventory_quantity
    const manageInventory = item.variant?.manage_inventory !== false

    if (qty > item.quantity && manageInventory && typeof inventory === "number" && qty > inventory) {
      toast.error("Maximum quantity reached for this item.")
      return
    }

    setUpdatingId(item.id)
    await updateQuantity(item.id, qty)
    setUpdatingId(null)
  }

  if (!items.length || !cart) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-8">
        {Ico.bag("text-accent/10 w-16 h-16")}
        <p className="font-newsreader italic text-3xl text-accent/30">Your bag is empty</p>
        <LocalizedClientLink href="/store" className="font-manrope text-[13px] uppercase font-bold tracking-[0.2em] text-accent underline underline-offset-4 hover:text-accent/70 transition-all duration-300">Continue Shopping</LocalizedClientLink>
      </div>
    )
  }

  return (
    <>
      <div className={`flex flex-col gap-10 transition-opacity duration-300 ${updatingId === "promo" ? "opacity-30 pointer-events-none" : ""}`}>
        <div className="flex flex-col gap-4 lg:gap-0 lg:divide-y lg:divide-accent/5">
          {items.map((item) => (
            <div key={item.id} className={`flex gap-6 p-4 bg-secondary border border-accent/10 lg:py-8 transition-opacity duration-300 ${updatingId === item.id ? "opacity-30 pointer-events-none" : ""}`}>
              <div className="w-[90px] h-[95px] bg-accent/[0.04] flex-shrink-0 overflow-hidden">
                <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
              </div>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-manrope text-lg md:text-xl text-accent leading-snug truncate">{item.product_title}</p>
                    <p className="font-manrope text-[12px] text-accent/40 mt-1.5 uppercase tracking-widest">{item.variant?.title || "Default"}</p>
                  </div>
                  <button onClick={() => { setUpdatingId(item.id); removeItem(item.id).finally(() => setUpdatingId(null)) }} className="p-1.5 text-accent hover:text-red-500 transition-colors flex-shrink-0">{Ico.x("w-4 h-4")}</button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-accent/10">
                    <button onClick={() => changeQty(item, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-accent/30 hover:text-accent transition-all">{Ico.minus("w-3.5 h-3.5")}</button>
                    <span className="w-7 h-7 flex items-center justify-center font-manrope text-[13px] font-bold text-accent border-x border-accent/10">{item.quantity}</span>
                    <button 
                      onClick={() => changeQty(item, item.quantity + 1)} 
                      disabled={item.variant?.manage_inventory !== false && typeof item.variant?.inventory_quantity === "number" && item.quantity >= item.variant.inventory_quantity}
                      className="w-7 h-7 flex items-center justify-center text-accent/30 hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {Ico.plus("w-3.5 h-3.5")}
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-manrope text-[16px] font-bold text-accent"><LocalizedPrice amount={(item.unit_price || 0) * item.quantity} /></p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border border-accent bg-accent text-bg p-6">
          <div className="flex items-center gap-3">{Ico.tag("text-bg w-4 h-4")}<span className="font-manrope text-[14px] font-semibold text-bg">Coupons & Offers</span></div>
          <button onClick={() => setCouponOpen(true)} className="font-manrope text-[12px] uppercase font-semibold tracking-[0.15em] text-bg flex items-center gap-1">Apply Coupon {Ico.chevRight("w-4 h-4")}</button>
        </div>
      </div>
      <CouponSidebar isOpen={couponOpen} onClose={() => setCouponOpen(false)} onApply={async (code) => { setUpdatingId("promo"); try { await applyPromotions([code]) } finally { setUpdatingId(null) } }} />
    </>
  )
}

export default BagStep
