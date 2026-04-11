"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { CreditCard, ShieldCheck, Smartphone } from "lucide-react"

const Ico = {
  card: (c = "") => <CreditCard className={c} strokeWidth={1.5} />,
  shield: (c = "") => <ShieldCheck className={c} strokeWidth={1.5} />,
  apple: (c = "") => <Smartphone className={c} strokeWidth={1.5} />,
}

const PaymentStep = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const [method, setMethod] = useState<"card" | "apple" | "">("")
  const [cardForm, setCardForm] = useState({ number: "", name: "", expiry: "", cvv: "" })

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === "number") { const c = value.replace(/\D/g, "").slice(0, 16); setCardForm(p => ({ ...p, number: c.replace(/(.{4})/g, "$1 ").trim() })) }
    else if (name === "expiry") { const c = value.replace(/\D/g, "").slice(0, 4); setCardForm(p => ({ ...p, expiry: c.length > 2 ? `${c.slice(0, 2)}/${c.slice(2)}` : c })) }
    else if (name === "cvv") setCardForm(p => ({ ...p, cvv: value.replace(/\D/g, "").slice(0, 3) }))
    else setCardForm(p => ({ ...p, [name]: value }))
  }

  const brand = () => { const n = cardForm.number.replace(/\s/g, ""); return n.startsWith("4") ? "VISA" : n.startsWith("5") ? "MASTERCARD" : "" }

  return (
    <div className="flex flex-col gap-10">
      <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em]">Select Payment Method</h3>

      {/* Card */}
      <div className={`border transition-all duration-300 overflow-hidden ${method === "card" ? "border-accent/20 shadow-sm" : "border-accent/5"}`}>
        <button onClick={() => setMethod(method === "card" ? "" : "card")} className="w-full flex items-center justify-between p-6 bg-black/[0.04] lg:bg-black/[0.02]">
          <div className="flex items-center gap-5">{Ico.card(`w-6 h-6 ${method === "card" ? "text-accent" : "text-accent/20"}`)}<span className={`font-manrope text-[15px] font-bold ${method === "card" ? "text-accent" : "text-accent/40"}`}>Credit / Debit Card</span></div>
          <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${method === "card" ? "border-accent bg-accent" : "border-accent/10"}`}>{method === "card" && <div className="w-2 h-2 rounded-full bg-bg" />}</span>
        </button>
        {method === "card" && (
          <div className="px-6 pb-6 border-t border-accent/5 pt-5 animate-in slide-in-from-top-2 fade-in duration-300 bg-secondary/50">
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input name="number" value={cardForm.number} onChange={handleCardChange} placeholder="Card Number" className="w-full h-13 px-4 pr-24 bg-accent/[0.04] lg:bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
                {brand() && <span className="absolute right-4 top-1/2 -translate-y-1/2 font-manrope text-[10px] font-bold text-accent/30 tracking-widest">{brand()}</span>}
              </div>
              <input name="name" value={cardForm.name} onChange={handleCardChange} placeholder="Cardholder Name" className="w-full h-13 px-4 bg-accent/[0.04] lg:bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
              <div className="grid grid-cols-2 gap-4">
                <input name="expiry" value={cardForm.expiry} onChange={handleCardChange} placeholder="MM/YY" className="w-full h-13 px-4 bg-accent/[0.04] lg:bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
                <input name="cvv" value={cardForm.cvv} onChange={handleCardChange} type="password" placeholder="CVV" className="w-full h-13 px-4 bg-accent/[0.04] lg:bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
              </div>
              <div className="flex items-center gap-2 text-accent/20 mt-1">{Ico.shield("w-4 h-4")}<span className="font-manrope text-[10px] uppercase tracking-widest">Secured by 256-bit SSL encryption</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Apple Pay */}
      <div className={`border transition-all duration-300 overflow-hidden ${method === "apple" ? "border-accent/20 shadow-sm" : "border-accent/5"}`}>
        <button onClick={() => setMethod(method === "apple" ? "" : "apple")} className="w-full flex items-center justify-between p-6 bg-black/[0.04] lg:bg-black/[0.02]">
          <div className="flex items-center gap-5">{Ico.apple(`w-6 h-6 ${method === "apple" ? "text-accent" : "text-accent/20"}`)}<span className={`font-manrope text-[15px] font-bold ${method === "apple" ? "text-accent" : "text-accent/40"}`}>Apple Pay</span></div>
          <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${method === "apple" ? "border-accent bg-accent" : "border-accent/10"}`}>{method === "apple" && <div className="w-2 h-2 rounded-full bg-bg" />}</span>
        </button>
        {method === "apple" && (
          <div className="px-6 pb-6 border-t border-accent/5 pt-4 animate-in slide-in-from-top-2 fade-in duration-300 bg-secondary/50">
            <p className="font-manrope text-[14px] text-accent/50">Pay securely using Apple Pay. Integration coming soon.</p>
          </div>
        )}
      </div>

      <p className="font-manrope text-[11px] text-accent/25 text-center mt-2 uppercase tracking-widest">By placing order you agree to our <span className="underline cursor-pointer">Terms & Conditions</span></p>
    </div>
  )
}

export default PaymentStep
