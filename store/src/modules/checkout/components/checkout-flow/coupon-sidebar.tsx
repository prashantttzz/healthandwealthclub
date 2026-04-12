"use client"

import React, { useState, useEffect } from "react"
import { getEligiblePromotions } from "@lib/data/promotion"
import { useCart } from "@lib/context/cart-context"
import { Tag, X } from "lucide-react"

const Ico = {
  x: (c = "") => <X className={c} strokeWidth={2} />,
  tag: (c = "") => <Tag className={c} strokeWidth={1.5} />,
}

const CouponSidebar = ({ isOpen, onClose, onApply }: { isOpen: boolean, onClose: () => void, onApply: (code: string) => void }) => {
  const { cart } = useCart()
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(false)
  const [customCode, setCustomCode] = useState("")

  useEffect(() => {
    if (isOpen && !hasFetched) {
      setLoading(true)
      getEligiblePromotions(cart?.id)
        .then(res => {
           setPromotions(res)
           setHasFetched(true)
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, hasFetched, cart?.id])

  return (
    <>
      <div className={`fixed inset-0 bg-black/30 z-[90] transition-opacity duration-500 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed bottom-0 left-0 w-full max-h-[85vh] bg-bg z-[100] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:top-0 lg:right-0 lg:h-full lg:w-full lg:max-w-[460px] lg:left-auto lg:max-h-none ${isOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-x-full lg:translate-y-0"}`}>
        <div className="flex justify-center py-4 lg:hidden" onClick={onClose}><div className="w-12 h-1.5 bg-accent/10 rounded-full" /></div>
        <div className="flex items-center justify-between px-8 pb-6 lg:pt-6 border-b border-accent/5">
          <h2 className="font-newsreader italic text-2xl text-accent">Apply Coupon</h2>
          <button onClick={onClose} className="p-2 text-accent/30 hover:text-accent transition-colors hidden lg:block">{Ico.x("w-5 h-5")}</button>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-8">
          <div className="flex gap-3">
            <input value={customCode} onChange={e => setCustomCode(e.target.value)} placeholder="Enter coupon code" className="flex-1 h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[13px] text-accent outline-none focus:border-accent/30 transition-colors uppercase placeholder:text-accent/20" />
            <button onClick={() => { if (customCode) { setLoading(true); onApply(customCode); setLoading(false); onClose(); } }} disabled={!customCode || loading} className="px-6 bg-accent text-bg font-manrope text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-accent/90 transition-all disabled:opacity-50">Apply</button>
          </div>
          <div>
            <p className="font-manrope text-[12px] font-bold text-accent/30 uppercase tracking-[0.2em] mb-5">Available Offers</p>
            {promotions.length === 0 ? <p className="font-newsreader italic text-lg text-accent/20 text-center py-8">No specific offers available</p> : (
              <div className="flex flex-col gap-4 pb-8">
                {promotions.map((promo: any) => (
                  <div key={promo.id} className="p-5 border border-accent/10 bg-black/[0.02]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-accent">
                        {Ico.tag("w-4 h-4")}
                        <span className="font-manrope text-[14px] font-bold tracking-widest">{promo.code}</span>
                      </div>
                      <button 
                        onClick={async () => { 
                          setLoading(true); 
                          await onApply(promo.code); 
                          setLoading(false); 
                          onClose(); 
                        }} 
                        className="text-[11px] font-manrope font-bold uppercase tracking-[0.1em] text-accent underline underline-offset-4 hover:text-accent/60 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {(promo.application_method?.description || promo.name) && (
                      <p className="font-manrope text-[12px] text-accent/50 mt-3 leading-relaxed">
                        {promo.application_method?.description || promo.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default CouponSidebar
