"use client"

import React, { useState, useMemo, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { updateLineItem, deleteLineItem, applyPromotions, getAvailablePromotions } from "@lib/data/cart"
import { deleteCustomerAddress, addCustomerAddress, login, signup } from "@lib/data/customer"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useActionState } from "react"

import { Check, X, Minus, Plus, ChevronRight, ChevronLeft, Home, Truck, CreditCard, ShieldCheck, Tag, MoreHorizontal, Banknote, ShoppingBag, ArrowRight } from "lucide-react"

/* ─── INLINE ICONS ─── */
const Ico = {
  check: (c = "") => <Check className={c} strokeWidth={3} />,
  x: (c = "") => <X className={c} strokeWidth={2} />,
  minus: (c = "") => <Minus className={c} strokeWidth={2.5}  />,
  plus: (c = "") => <Plus className={c} strokeWidth={2.5} />,
  chevRight: (c = "") => <ChevronRight className={c} strokeWidth={2} />,
  chevLeft: (c = "") => <ChevronLeft className={c} strokeWidth={2} />,
  home: (c = "") => <Home className={c} strokeWidth={1.5} />,
  truck: (c = "") => <Truck className={c} strokeWidth={1.5} />,
  card: (c = "") => <CreditCard className={c} strokeWidth={1.5} />,
  shield: (c = "") => <ShieldCheck className={c} strokeWidth={1.5} />,
  tag: (c = "") => <Tag className={c} strokeWidth={1.5} />,
  dots: (c = "") => <MoreHorizontal className={c} />,
  money: (c = "") => <Banknote className={c} strokeWidth={1.5} />,
  bag: (c = "") => <ShoppingBag className={c} strokeWidth={1.5} />,
  arrowRight: (c = "") => <ArrowRight className={c} strokeWidth={2} />,
}

/* ━━━━━━━━━━ STEP INDICATOR (centered) ━━━━━━━━━━ */
const StepIndicator = ({ currentStep, onStepClick }: { currentStep: number; onStepClick: (s: number) => void }) => {
  const steps = ["Bag", "Address", "Payment"]

  return (
    <div className="flex items-center justify-between gap-0 mb-16 select-none max-w-[400px] md:max-w-[500px] mx-auto lg:mx-0 w-full relative">
      {/* Background Progress Line */}
      <div className="absolute top-[18px] left-10 right-10 h-[1.5px] bg-accent/10 -z-0" />
      
      {/* Active Progress Line */}
      <div 
        className="absolute top-[18px] left-10 h-[1.5px] bg-accent transition-all duration-1000 -z-0" 
        style={{ 
          width: currentStep === 0 ? "0%" : currentStep === 1 ? "42%" : "83%",
        }}
      />
      
      {/* Steps */}
      {steps.map((label, idx) => {
        const done = idx < currentStep, active = idx === currentStep, future = idx > currentStep
        const status = done ? "Completed" : active ? "In Progress" : "Pending"
        
        return (
          <button
            key={label}
            onClick={() => done && onStepClick(idx)}
            disabled={future}
            className="flex flex-col items-center gap-4 relative z-10 group"
          >
            {/* Step Marker */}
            <div className={`
              w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-700
              ${done ? "border-accent bg-secondary shadow-sm" : ""}
              ${active ? "border-accent bg-bg shadow-inner scale-105" : "border-accent/10 bg-bg"}
              ${future ? "border-accent/5 opacity-40" : ""}
            `}>
              {done ? (
                <Check className="w-5 h-5 text-accent" strokeWidth={3} />
              ) : (
                <span className={`font-manrope text-[11px] font-bold transition-colors duration-500 ${active ? "text-accent" : "text-accent/10"}`}>
                  {idx + 1}
                </span>
              )}
            </div>

            {/* Labels */}
            <div className="flex flex-col items-center gap-0.5">
              <span className={`
                font-newsreader text-[13px] font-bold tracking-tight transition-colors duration-500
                ${active || done ? "text-accent" : "text-accent/30"}
              `}>
                {label}
              </span>
              <span className={`
                font-manrope text-[8px] uppercase font-bold tracking-[0.15em] px-2.5 py-1 rounded-full transition-all duration-500 mt-1.5
                ${done ? "bg-accent/5 text-accent" : ""}
                ${active ? "bg-accent/10 text-accent" : "bg-black/[0.02] text-black/10"}
              `}>
                {status}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* ━━━━━━━━━━ COUPON SIDEBAR ━━━━━━━━━━ */
const CouponSidebar = ({ isOpen, onClose, onApply }: { isOpen: boolean, onClose: () => void, onApply: (code: string) => void }) => {
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [customCode, setCustomCode] = useState("")

  useEffect(() => {
    if (isOpen && promotions.length === 0) {
      getAvailablePromotions().then(setPromotions)
    }
  }, [isOpen])

  return (
    <>
      <div className={`fixed inset-0 bg-black/30 z-[90] transition-opacity duration-500 lg:hidden ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed bottom-0 left-0 w-full max-h-[85vh] bg-bg z-[100] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:top-0 lg:right-0 lg:h-full lg:w-full lg:max-w-[460px] lg:left-auto lg:max-h-none ${isOpen ? "translate-y-0 lg:translate-x-0" : "translate-y-full lg:translate-x-full lg:translate-y-0"}`}>
        <div className="flex justify-center py-4 lg:hidden" onClick={onClose}>
          <div className="w-12 h-1.5 bg-accent/10 rounded-full" />
        </div>
        <div className="flex items-center justify-between px-8 pb-6 lg:pt-6 border-b border-accent/5">
          <h2 className="font-newsreader italic text-2xl text-accent">Apply Coupon</h2>
          <button onClick={onClose} className="p-2 text-accent/30 hover:text-accent transition-colors hidden lg:block">{Ico.x("w-5 h-5")}</button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 flex flex-col gap-8">
          <div className="flex gap-3">
            <input value={customCode} onChange={e => setCustomCode(e.target.value)} placeholder="Enter coupon code" className="flex-1 h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[13px] text-accent outline-none focus:border-accent/30 transition-colors uppercase placeholder:normal-case placeholder:text-accent/20" />
            <button onClick={() => { if (customCode) { setLoading(true); onApply(customCode); setLoading(false); onClose(); } }} disabled={!customCode || loading} className="px-6 bg-accent text-bg font-manrope text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-accent/90 transition-all disabled:opacity-50">Apply</button>
          </div>

          <div>
            <p className="font-manrope text-[12px] font-bold text-accent/30 uppercase tracking-[0.2em] mb-5">Available Offers</p>
            {promotions.length === 0 ? (
              <p className="font-newsreader italic text-lg text-accent/20 text-center py-8">No specific offers available</p>
            ) : (
              <div className="flex flex-col gap-4 pb-8">
                {promotions.map((promo: any) => (
                  <div key={promo.id} className="p-5 border border-accent/10 bg-black/[0.02]">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2 text-accent">
                        {Ico.tag("w-4 h-4")}
                        <span className="font-manrope text-[14px] font-bold tracking-widest">{promo.code}</span>
                      </div>
                      <button onClick={async () => { setLoading(true); await onApply(promo.code); setLoading(false); onClose(); }} className="text-[11px] font-manrope font-bold uppercase tracking-[0.1em] text-accent underline underline-offset-4 hover:text-accent/60 transition-colors">Apply</button>
                    </div>
                    <p className="font-manrope text-[12px] text-accent/50 mt-3 leading-relaxed">{promo.description || promo.name || "Special promotion offer"}</p>
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

const BagStep = ({ cart, onContinue }: { cart: HttpTypes.StoreCart; onContinue: () => void }) => {
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [couponOpen, setCouponOpen] = useState(false)
  const items = useMemo(() => cart.items?.sort((a, b) => (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1) ?? [], [cart.items])

  const changeQty = async (lineId: string, qty: number) => {
    setUpdatingId(lineId)
    try { qty < 1 ? await deleteLineItem(lineId) : await updateLineItem({ lineId, quantity: qty }) } catch {}
    setUpdatingId(null)
  }

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-8">
        {Ico.bag("text-accent/10 w-16 h-16")}
        <p className="font-newsreader italic text-3xl text-accent/30">Your bag is empty</p>
        <LocalizedClientLink href="/store" className="font-manrope text-[13px] uppercase font-bold tracking-[0.2em] text-accent underline underline-offset-4 hover:text-accent/70 transition-colors">Continue Shopping</LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className={`flex flex-col gap-10 transition-opacity duration-300 ${updatingId === "promo" ? "opacity-30 pointer-events-none" : ""}`}>
      <div className="flex flex-col gap-4 lg:gap-0 lg:divide-y lg:divide-accent/5">
        {items.map((item) => (
          <div key={item.id} className={`flex gap-6 p-4 bg-secondary border border-accent/10  lg:py-8  transition-opacity duration-300 ${updatingId === item.id ? "opacity-30 pointer-events-none" : ""}`}>
            <div className="w-[90px] h-[95px] bg-accent/[0.04] lg:bg-accent/[0.02] flex-shrink-0 overflow-hidden">
              <Thumbnail thumbnail={item.thumbnail} images={item.variant?.product?.images} size="square" />
            </div>
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-manrope text-lg md:text-xl text-accent font-bold leading-snug truncate">{item.product_title}</p>
                  <p className="font-manrope text-[12px] text-accent/40 mt-1.5 uppercase tracking-widest">{item.variant?.title || "Default"}</p>
                </div>
                <button onClick={() => { setUpdatingId(item.id); deleteLineItem(item.id).finally(() => setUpdatingId(null)) }} className="p-1.5 text-accent hover:text-red-500 transition-colors flex-shrink-0">{Ico.x("w-4 h-4")}</button>
              </div>
              <div className="flex items-center gap-4 mt-4">
                {item.variant?.title && (
                  <span className="font-manrope text-[9px] md:text-[11px] text-accent/80 border border-accent/10 px-3 py-1.5 uppercase tracking-widest font-bold">Size: {item.variant.title}</span>
                )}
                <div className="flex items-center border border-accent/10">
                  <button onClick={() => changeQty(item.id, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center text-accent/30 hover:text-accent hover:bg-accent/5 transition-all">{Ico.minus("w-3.5 h-3.5")}</button>
                  <span className="w-9 h-9 flex items-center justify-center font-manrope text-[13px] font-bold text-accent border-x border-accent/10">{item.quantity}</span>
                  <button onClick={() => changeQty(item.id, item.quantity + 1)} className="w-9 h-9 flex items-center justify-center text-accent/30 hover:text-accent hover:bg-accent/5 transition-all">{Ico.plus("w-3.5 h-3.5")}</button>
                </div>
              </div>
              <div className="mt-4">
                <p className="font-manrope text-[16px] font-bold text-accent">{convertToLocale({ amount: item.unit_price || 0, currency_code: cart.currency_code })}</p>
                <p className="font-manrope text-[11px] text-accent/70 mt-1  tracking-widest">Estimated Delivery by {new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupons */}
      <div className="flex items-center justify-between border border-accent bg-accent text-bg p-6">
        <div className="flex items-center gap-3">{Ico.tag("text-bg w-4 h-4")}<span className="font-manrope text-[14px] font-bold text-bg">Coupons & Offers</span></div>
        <button onClick={() => setCouponOpen(true)} className="font-manrope text-[12px] uppercase font-bold tracking-[0.15em] text-bg flex items-center gap-1 hover:text-accent transition-colors">Apply Coupon {Ico.chevRight("w-4 h-4")}</button>
      </div>

      <CouponSidebar isOpen={couponOpen} onClose={() => setCouponOpen(false)} onApply={async (code) => { setUpdatingId("promo"); try { await applyPromotions([code]) } finally { setUpdatingId(null) } }} />
    </div>
  )
}

/* ━━━━━━━━━━ ADDRESS SIDEBAR ━━━━━━━━━━ */
const AddressSidebar = ({ isOpen, onClose, addresses, onSelect, onDelete }: {
  isOpen: boolean; onClose: () => void; addresses: HttpTypes.StoreCustomerAddress[]
  onSelect: (a: HttpTypes.StoreCustomerAddress) => void; onDelete: (id: string) => void
}) => {
  const [view, setView] = useState<"list" | "form">("list")
  const [formData, setFormData] = useState({ first_name: "", last_name: "", phone: "", address_1: "", address_2: "", city: "", province: "", postal_code: "", country_code: "in", address_name: "Home" })
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    setIsSaving(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
    const res = await addCustomerAddress({}, fd)
    setIsSaving(false)
    if (res.success) {
      setView("list")
      onClose()
    } else {
      console.error(res.error)
    }
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black/30 z-[90] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-[460px] bg-bg z-[100] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-accent/5">
          <h2 className="font-newsreader italic text-2xl text-accent">{view === "list" ? "Select From Saved Addresses" : "Add New Address"}</h2>
          <button onClick={onClose} className="p-2 text-accent/30 hover:text-accent transition-colors">{Ico.x("w-5 h-5")}</button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {view === "list" ? (
            <>
              <button onClick={() => setView("form")} className="w-full flex items-center justify-between p-6 bg-accent/[0.03] border border-accent/10 mb-8 hover:bg-accent/[0.06] transition-colors group">
                <span className="text-accent font-manrope text-[13px] font-bold flex items-center gap-3 uppercase tracking-widest">{Ico.plus("w-4 h-4 text-accent")} Add New Address</span>
                {Ico.chevRight("w-4 h-4 text-accent/30 group-hover:translate-x-0.5 transition-transform")}
              </button>
              <div className="flex items-center gap-4 mb-8"><div className="flex-1 h-px bg-accent/5" /><span className="font-manrope text-[11px] text-accent/20 uppercase tracking-widest">or</span><div className="flex-1 h-px bg-accent/5" /></div>
              <p className="font-manrope text-[12px] font-bold text-accent/30 uppercase tracking-[0.2em] mb-5">Saved Addresses</p>
              {addresses.length === 0 ? (
                <p className="font-newsreader italic text-lg text-accent/20 text-center py-16">No saved addresses yet</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {addresses.map((addr) => (
                    <button key={addr.id} onClick={() => { onSelect(addr); onClose() }} className="w-full text-left p-6 border border-accent/5 hover:border-accent/20 transition-all group bg-bg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 mb-2">{Ico.home("w-4 h-4 text-accent/30")}<span className="font-manrope text-[15px] font-bold text-accent">{addr.first_name}&apos;s Home</span>{addr.is_default_shipping && <span className="font-manrope text-[9px] bg-accent/5 text-accent/50 px-2 py-0.5 uppercase tracking-widest font-bold">Default</span>}</div>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(addr.id) }} className="p-1.5 text-accent/15 hover:text-red-500 transition-colors">{Ico.dots("w-4 h-4")}</button>
                      </div>
                      <p className="font-manrope text-[13px] text-accent/40 leading-relaxed pl-8">{addr.address_1}{addr.city ? `, ${addr.city}` : ""} {addr.postal_code}{addr.phone ? ` , +91 ${addr.phone}` : ""}</p>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-5">
              <button onClick={() => setView("list")} className="flex items-center gap-2 text-accent font-manrope text-[12px] font-bold uppercase tracking-widest mb-4">{Ico.chevLeft("w-4 h-4")} Back to list</button>
              {[
                { n: "first_name", l: "Full Name" }, { n: "phone", l: "Phone Number" },
                { n: "address_1", l: "Address Line 1" }, { n: "address_2", l: "Address Line 2" },
                { n: "city", l: "City" }, { n: "province", l: "State" }, { n: "postal_code", l: "Pincode" },
              ].map((f) => (
                <div key={f.n} className="flex flex-col gap-2">
                  <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">{f.l}</label>
                  <input name={f.n} value={(formData as any)[f.n]} onChange={handleChange} className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                {["Home", "Work", "Other"].map((t) => (
                  <button key={t} onClick={() => setFormData(p => ({ ...p, address_name: t }))} className={`px-5 py-3 font-manrope text-[11px] font-bold uppercase tracking-widest border transition-all ${formData.address_name === t ? "bg-accent text-bg border-accent" : "bg-transparent text-accent/40 border-accent/10 hover:border-accent/30"}`}>{t}</button>
                ))}
              </div>
              <button onClick={handleSave} disabled={isSaving} className="w-full py-4 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase mt-4 hover:bg-accent/90 transition-all disabled:opacity-50">
                {isSaving ? "Saving..." : "Save Address"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

/* ━━━━━━━━━━ AUTH SIDEBAR ━━━━━━━━━━ */
const AuthSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [view, setView] = useState<"login" | "signup">("login")
  const [loginMessage, loginAction, pendingLogin] = useActionState(login, null)
  const [signupMessage, signupAction, pendingSignup] = useActionState(signup, null)

  // Listen to successful login (message is undefined on success)
  useEffect(() => {
    if (isOpen && pendingLogin === false && loginMessage === undefined) {
      window.location.reload()
    }
  }, [pendingLogin, loginMessage, isOpen])

  // Listen to successful signup (message is an object on success)
  useEffect(() => {
    if (isOpen && pendingSignup === false && signupMessage && typeof signupMessage === "object") {
      window.location.reload()
    }
  }, [pendingSignup, signupMessage, isOpen])

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-[460px] bg-bg z-[100] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-accent/5">
          <h2 className="font-newsreader italic text-3xl text-accent">{view === "login" ? "Welcome Back" : "Join the Club"}</h2>
          <button onClick={onClose} className="p-2 text-accent/30 hover:text-accent transition-colors">{Ico.x("w-5 h-5")}</button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {view === "login" ? (
            <form action={loginAction} className="flex flex-col gap-5">
              <p className="font-manrope text-[13px] text-accent/50 mb-4 leading-relaxed">Sign in to sync your bag and access your saved addresses for a seamless experience.</p>
              
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Email Address</label>
                <input name="email" type="email" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Password</label>
                <input name="password" type="password" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
              </div>
              
              {loginMessage && typeof loginMessage === "string" && (
                <p className="text-red-500 font-manrope text-[11px] font-bold mt-2">{loginMessage}</p>
              )}

              <button disabled={pendingLogin} className="w-full py-4 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase mt-4 hover:bg-accent/90 transition-all disabled:opacity-50">
                {pendingLogin ? "Authenticating..." : "Sign In"}
              </button>

              <button type="button" onClick={() => setView("signup")} className="mt-8 font-manrope text-[12px] uppercase font-bold tracking-[0.1em] text-accent/50 hover:text-accent transition-colors">
                New here? create an account
              </button>
            </form>
          ) : (
            <form action={signupAction} className="flex flex-col gap-5">
              <p className="font-manrope text-[13px] text-accent/50 mb-4 leading-relaxed">Create an account to checkout faster and track your orders seamlessly.</p>
              
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">First Name</label>
                  <input name="first_name" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Last Name</label>
                  <input name="last_name" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Phone</label>
                <input name="phone" type="tel" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Email Address</label>
                <input name="email" type="email" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Password</label>
                <input name="password" type="password" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
              </div>

              {signupMessage && typeof signupMessage === "string" && (
                <p className="text-red-500 font-manrope text-[11px] font-bold mt-2">{signupMessage}</p>
              )}

              <button disabled={pendingSignup} className="w-full py-4 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase mt-4 hover:bg-accent/90 transition-all disabled:opacity-50">
                {pendingSignup ? "Creating..." : "Create Account"}
              </button>

              <button type="button" onClick={() => setView("login")} className="mt-8 font-manrope text-[12px] uppercase font-bold tracking-[0.1em] text-accent/50 hover:text-accent transition-colors">
                Already a member? Sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

/* ━━━━━━━━━━ STEP 2 — ADDRESS ━━━━━━━━━━ */
const AddressStep = ({ cart, customer, selectedAddress, setSelectedAddress, onContinue }: {
  cart: HttpTypes.StoreCart; customer: HttpTypes.StoreCustomer | null
  selectedAddress: HttpTypes.StoreCustomerAddress | null; setSelectedAddress: (a: HttpTypes.StoreCustomerAddress | null) => void; onContinue: () => void
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [deliveryOption, setDeliveryOption] = useState("standard")

  const deliveryOptions = [
    { id: "standard", label: "Standard Delivery", sub: `Estimated Delivery by ${new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`, enabled: true },
    { id: "express", label: "Express Delivery", sub: "Some items aren't eligible for Express Delivery", enabled: false },
    { id: "pickup", label: "Express Store Pickup", sub: "Some items aren't eligible for Express Delivery", enabled: false },
  ]

  return (
    <div className="flex flex-col gap-14 mb-20 md:mt-0">
      {/* Delivery Address */}
      <div>
        <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em] mb-6">Delivery Address</h3>
        {selectedAddress ? (
          <div className="flex items-start justify-between p-6 border border-accent/10 bg-secondary shadow-inner">
            <div className="flex items-start gap-4">
              {Ico.home("w-5 h-5 text-accent/30 mt-0.5 flex-shrink-0")}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-manrope text-[15px] font-bold text-accent">{selectedAddress.first_name}&apos;s Home</span>
                  {selectedAddress.is_default_shipping && <span className="font-manrope text-[9px] bg-accent/5 text-accent/50 px-2 py-0.5 uppercase tracking-widest font-bold">Default</span>}
                </div>
                <p className="font-manrope text-[13px] text-accent/40 leading-relaxed">{selectedAddress.address_1}{selectedAddress.city ? `, ${selectedAddress.city}` : ""} {selectedAddress.postal_code}{selectedAddress.phone ? ` , +91 ${selectedAddress.phone}` : ""}</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="px-5 py-3 border border-accent/10 font-manrope text-[11px] font-bold text-accent uppercase tracking-widest hover:border-accent hover:bg-accent hover:text-bg transition-all duration-300 flex-shrink-0">Change Address</button>
          </div>
        ) : (
          <button onClick={() => setSidebarOpen(true)} className="w-full flex items-center justify-between p-5 border border-accent/10 text-accent/50 hover:border-accent/30 hover:bg-black/[0.02] transition-all duration-300 bg-black/[0.04] lg:bg-black/[0.02] shadow-sm">
            <div className="flex items-center gap-4">
              {Ico.plus("w-5 h-5")}
              <span className="font-manrope text-[13px] font-bold uppercase tracking-widest">Add New Address</span>
            </div>
            {Ico.chevRight("w-4 h-4")}
          </button>
        )}
      </div>

      {/* Delivery Options */}
      <div>
        <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em] mb-6">Delivery Options</h3>
        <div className="flex flex-col gap-3">
          {deliveryOptions.map((opt) => {
            const sel = deliveryOption === opt.id
            return (
              <button key={opt.id} disabled={!opt.enabled} onClick={() => opt.enabled && setDeliveryOption(opt.id)}
                className={`w-full flex items-center justify-between p-6 border text-left transition-all duration-300
                  ${sel ? "border-accent/10 bg-secondary shadow-inner translate-y-[1px]" : "bg-transparent border-accent/5 hover:border-accent/10 hover:bg-secondary/30"}
                  ${!opt.enabled ? "opacity-30 cursor-not-allowed border-accent/5" : "cursor-pointer"}`}>
                <div className="flex items-center gap-5">
                  <div className={`transition-colors duration-300 ${sel ? "text-accent" : "text-accent/20"}`}>
                    {Ico.truck("w-6 h-6")}
                  </div>
                  <div>
                    <p className={`font-manrope text-[15px] font-bold transition-colors duration-300 ${sel ? "text-accent" : "text-accent/40"}`}>{opt.label}</p>
                    <p className={`font-manrope text-[12px] transition-colors duration-300 ${sel ? "text-accent/60" : "text-accent/20"} mt-0.5`}>{opt.sub}</p>
                  </div>
                </div>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${sel ? "border-accent bg-accent" : "border-accent/10"}`}>
                  {sel && <div className="w-1.5 h-1.5 rounded-full bg-bg" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Delivery Estimates */}
      {selectedAddress && cart.items?.[0] && (
        <div>
          <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em] mb-6">Delivery Estimates</h3>
          <div className="flex items-center gap-5 p-6 bg-black/[0.04] lg:bg-black/[0.02] border border-accent/5 shadow-sm">
            <div className="w-14 h-16 bg-accent/[0.02] overflow-hidden flex-shrink-0"><Thumbnail thumbnail={cart.items[0].thumbnail} size="square" /></div>
            <div>
              <p className="font-manrope text-[14px] font-bold text-accent">{cart.items[0].product_title}</p>
              <p className="font-manrope text-[12px] text-accent/40 mt-0.5">Estimated Delivery: <span className="font-bold text-accent/70">{new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></p>
            </div>
          </div>
        </div>
      )}

      <AddressSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} addresses={customer?.addresses ?? []} onSelect={setSelectedAddress} onDelete={async (id) => { try { await deleteCustomerAddress(id) } catch {} }} />
    </div>
  )
}

/* ━━━━━━━━━━ STEP 3 — PAYMENT ━━━━━━━━━━ */
const PaymentStep = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const [method, setMethod] = useState<"card" | "cod" | "">("")
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

      {/* COD */}
      <div className={`border transition-all duration-300 overflow-hidden ${method === "cod" ? "border-accent/20 shadow-sm" : "border-accent/5"}`}>
        <button onClick={() => setMethod(method === "cod" ? "" : "cod")} className="w-full flex items-center justify-between p-6 bg-black/[0.04] lg:bg-black/[0.02]">
          <div className="flex items-center gap-5">{Ico.money(`w-6 h-6 ${method === "cod" ? "text-accent" : "text-accent/20"}`)}<span className={`font-manrope text-[15px] font-bold ${method === "cod" ? "text-accent" : "text-accent/40"}`}>Cash on Delivery (COD)</span></div>
          <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${method === "cod" ? "border-accent bg-accent" : "border-accent/10"}`}>{method === "cod" && <div className="w-2 h-2 rounded-full bg-bg" />}</span>
        </button>
        {method === "cod" && (
          <div className="px-6 pb-6 border-t border-accent/5 pt-4 animate-in slide-in-from-top-2 fade-in duration-300 bg-secondary/50">
            <p className="font-manrope text-[14px] text-accent/50">Pay <span className="font-bold text-accent">{convertToLocale({ amount: cart.total || 0, currency_code: cart.currency_code })}</span> in cash at the time of delivery.</p>
          </div>
        )}
      </div>

      <p className="font-manrope text-[11px] text-accent/25 text-center mt-2 uppercase tracking-widest">By placing order you agree to our <span className="underline cursor-pointer">Terms & Conditions</span></p>
    </div>
  )
}

/* ━━━━━━━━━━ MOBILE PRICE DRAWER ━━━━━━━━━━ */
const MobilePriceDrawer = ({ isOpen, onClose, cart }: { isOpen: boolean, onClose: () => void, cart: HttpTypes.StoreCart }) => {
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
            <div className="flex justify-between"><span className="text-bg/60">Total MRP</span><span className="text-bg font-semibold">{convertToLocale({ amount: cart.item_subtotal || 0, currency_code: cart.currency_code })}</span></div>
            {(cart.discount_total ?? 0) > 0 && <div className="flex justify-between"><span className="text-bg/60">Discount</span><span className="text-green-400 font-bold">- {convertToLocale({ amount: cart.discount_total || 0, currency_code: cart.currency_code })}</span></div>}
            <div className="flex justify-between"><span className="text-bg/60">Delivery Fee</span><span className="text-green-400 font-bold">Free</span></div>
          </div>
          
          <div className="border-t border-dashed border-bg/10 pt-8 flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <span className="font-manrope text-[10px] uppercase font-bold tracking-[0.2em] text-bg/30">Total Payable</span>
              <span className="font-newsreader italic text-3xl text-bg leading-none">{convertToLocale({ amount: cart.total || 0, currency_code: cart.currency_code })}</span>
            </div>
            <button onClick={onClose} className="bg-bg text-accent px-10 py-5 font-manrope text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg animate-in fade-in zoom-in duration-500 delay-300">Got it</button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ━━━━━━━━━━ ORDER SUMMARY (Right Column) ━━━━━━━━━━ */
const OrderSummary = ({ cart, currentStep, onContinue, selectedAddress }: {
  cart: HttpTypes.StoreCart; currentStep: number; onContinue: () => void; selectedAddress: HttpTypes.StoreCustomerAddress | null
}) => {
  const items = cart.items ?? []
  const firstItem = items[0]
  const label = currentStep === 0 ? "PROCEED TO ADDRESS" : currentStep === 1 ? "CONTINUE" : "PLACE ORDER"

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-newsreader italic text-2xl text-bg">Order Summary</h3>
      </div>
      {firstItem && (
        <div className="flex items-center bg-secondaryAccent  gap-5 pb-6 border p-2 border-secondaryAccent">
          <div className="w-16 h-20  overflow-hidden flex-shrink-0"><Thumbnail thumbnail={firstItem.thumbnail} size="square" /></div>
          <div className="min-w-0">
            <p className="font-manrope text-[14px] font-bold text-bg truncate">{firstItem.product_title}</p>
            <p className="font-manrope text-[12px] text-bg/30 uppercase tracking-widest mt-0.5">{firstItem.variant?.title} · Qty: {firstItem.quantity}</p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3 font-manrope text-[13px] uppercase  font-regular">
        <div className="flex justify-between"><span className="text-bg">Total MRP</span><span className="text-bg font-semibold">{convertToLocale({ amount: cart.item_subtotal || 0, currency_code: cart.currency_code })}</span></div>
        {(cart.discount_total ?? 0) > 0 && <div className="flex justify-between"><span className="text-bg">Discount</span><span className="text-green-700">- {convertToLocale({ amount: cart.discount_total || 0, currency_code: cart.currency_code })}</span></div>}
        <div className="flex justify-between"><span className="text-bg">Delivery Fee</span><span className="text-green-700">Free</span></div>
      </div>
      <div className="border-t border-dashed border-bg/10 pt-6 flex justify-between items-center">
        <span className="font-newsreader italic text-2xl text-bg">Total Payable</span>
        <span className="font-manrope text-xl text-bg font-semibold">{convertToLocale({ amount: cart.total || 0, currency_code: cart.currency_code })}</span>
      </div>
      <button onClick={onContinue} disabled={currentStep === 1 && !selectedAddress}
        className="w-full py-5 bg-bg text-accent font-manrope text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-bg/90 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-30 disabled:cursor-not-allowed">
        {label} {Ico.arrowRight("w-4 h-4 group-hover:translate-x-1 transition-transform")}
      </button>
      <p className="font-manrope text-[10px] text-bg/80 text-center  tracking-widest leading-relaxed">By continuing, you agree to our Terms of Use and Privacy Policy.</p>
    </div>
  )
}

/* ━━━━━━━━━━ MAIN COMPONENT ━━━━━━━━━━ */
const CheckoutFlow = ({ cart, customer }: { cart: HttpTypes.StoreCart; customer: HttpTypes.StoreCustomer | null }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState<HttpTypes.StoreCustomerAddress | null>(
    customer?.addresses?.find(a => a.is_default_shipping) ?? customer?.addresses?.[0] ?? null
  )
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const goToStep = (s: number) => { setCurrentStep(s); window.scrollTo({ top: 0, behavior: "smooth" }) }

  const handleProceed = () => {
    if (currentStep === 0 && !customer) {
      setAuthOpen(true)
    } else if (currentStep < 2) {
      goToStep(currentStep + 1)
    } else {
      setShowSuccess(true)
    }
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/30 z-[200] flex items-center justify-center p-6">
        <div className="bg-bg p-12 max-w-md w-full flex flex-col items-center gap-8 shadow-2xl animate-in zoom-in-95 fade-in duration-500">
          <div className="w-20 h-20 bg-green-50 flex items-center justify-center rounded-full">
            {Ico.check("w-10 h-10 text-green-500")}
          </div>
          <h2 className="font-newsreader italic text-3xl text-accent">Order Placed!</h2>
          <p className="font-manrope text-[14px] text-accent/50 text-center leading-relaxed">Estimated delivery by <span className="font-bold text-accent">{new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></p>
          <div className="bg-accent/[0.03] border border-accent/5 p-6 w-full">
            <div className="flex justify-between font-manrope text-[13px] uppercase tracking-widest font-bold"><span className="text-accent/40">Total Paid</span><span className="text-accent">{convertToLocale({ amount: cart.total || 0, currency_code: cart.currency_code })}</span></div>
          </div>
          <LocalizedClientLink href="/store" className="px-10 py-4 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-accent/90 transition-all">Continue Shopping</LocalizedClientLink>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-bg border-b border-accent/5 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center h-16">
          <button onClick={() => currentStep > 0 && goToStep(currentStep - 1)} className="mr-4 lg:hidden">{currentStep > 0 && Ico.chevLeft("w-5 h-5 text-accent/40")}</button>
          <LocalizedClientLink href="/" className="font-newsreader italic text-2xl text-accent tracking-tight mr-auto hidden lg:block">Health & Wealth Club</LocalizedClientLink>
          <h1 className="font-newsreader italic text-xl text-accent lg:hidden">{["Bag", "Address", "Payment"][currentStep]}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto px-6 md:px-12 lg:px-16 py-10">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">
          
          {/* LEFT: PROGRESS & FORMS */}
          <div className="flex-1 lg:max-w-[55%]  flex flex-col justify-center items-center">
            <StepIndicator currentStep={currentStep} onStepClick={goToStep} />
            
            <div className="mt-8  w-full">
              {currentStep === 0 && <BagStep cart={cart} onContinue={handleProceed} />}
              {currentStep === 1 && <AddressStep cart={cart} customer={customer} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} onContinue={handleProceed} />}
              {currentStep === 2 && <PaymentStep cart={cart} />}
            </div>
          </div>
          
          {/* RIGHT: ORDER DETAIL SIDEBAR */}
          <div className="hidden lg:block lg:flex-1 bg-accent border-l border-accent/5 min-h-screen -mt-24 -mr-16">
            <div className="sticky top-0 py-24 px-12">
              <OrderSummary cart={cart} currentStep={currentStep} onContinue={handleProceed} selectedAddress={selectedAddress} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg border-t shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-accent/5 px-4 py-3 z-50 flex items-center justify-between">
        <div onClick={() => setDrawerOpen(true)} className="cursor-pointer">
          <p className="font-newsreader italic text-xl text-accent">{convertToLocale({ amount: cart.total || 0, currency_code: cart.currency_code })}</p>
          <button className="font-manrope text-[10px] uppercase font-bold tracking-widest text-accent/40 flex items-center gap-1 mt-0.5">View Details {Ico.chevRight("w-3 h-3 -rotate-90")}</button>
        </div>
        <button onClick={handleProceed} disabled={currentStep === 1 && !selectedAddress}
          className="px-8 py-4 bg-accent text-bg font-manrope text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-accent/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          {currentStep === 0 ? "PROCEED" : currentStep === 1 ? "CONTINUE" : "PLACE ORDER"}
        </button>
      </div>

      {/* Mobile Price Drawer */}
      <MobilePriceDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} cart={cart} />

      {/* Auth Sidebar */}
      <AuthSidebar isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default CheckoutFlow
