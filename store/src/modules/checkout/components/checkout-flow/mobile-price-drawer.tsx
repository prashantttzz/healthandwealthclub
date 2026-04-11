"use client"

import React from "react"
import { useCart } from "@lib/context/cart-context"
import { convertToLocale } from "@lib/util/money"
import { X } from "lucide-react"

const Ico = {
  x: (c = "") => <X className={c} strokeWidth={2} />,
}

const MobilePriceDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { cart, subtotal } = useCart()
  if (!cart) return null

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-[90] transition-opacity duration-500 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed bottom-0 left-0 right-0 bg-accent z-[100] rounded-t-[40px] shadow-2xl flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden ${isOpen ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex justify-center pt-6 pb-2" onClick={onClose}>
          <div className="w-12 h-1.5 bg-bg/20 rounded-full" />
        </div>
        <div className="px-10 pb-12 pt-6 flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <h3 className="font-manrope text-[11px] uppercase font-bold tracking-[0.3em] text-bg/40">Order Breakdown</h3>
            <button onClick={onClose} className="p-2 text-bg/30 hover:text-bg transition-colors">{Ico.x("w-5 h-5")}</button>
          </div>
          
          <div className="flex flex-col gap-5 font-manrope text-[13px] uppercase tracking-[0.15em]">
            <div className="flex justify-between"><span className="text-bg/60">Total MRP</span><span className="text-bg font-semibold">{convertToLocale({ amount: subtotal || 0, currency_code: cart.currency_code })}</span></div>
            {(cart.discount_total ?? 0) > 0 && <div className="flex justify-between"><span className="text-bg/60">Discount</span><span className="text-green-400 font-bold">- {convertToLocale({ amount: cart.discount_total || 0, currency_code: cart.currency_code })}</span></div>}
            <div className="flex justify-between"><span className="text-bg/60">Delivery Fee</span><span className="text-green-400 font-bold">Free</span></div>
          </div>
          <div className="border-t border-dashed border-bg/10 pt-8 flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="font-manrope text-[10px] uppercase font-bold tracking-[0.2em] text-bg/30">Total Payable</span>
              <span className="font-newsreader italic text-3xl text-bg leading-none">{convertToLocale({ amount: (subtotal || 0) - (cart.discount_total || 0), currency_code: cart.currency_code })}</span>
            </div>
            <button onClick={onClose} className="bg-bg text-accent px-10 py-5 font-manrope text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg animate-in fade-in zoom-in duration-500 delay-300">Got it</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobilePriceDrawer
