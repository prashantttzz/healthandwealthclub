"use client"

import React, { useState, useMemo, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { updateLineItem, deleteLineItem, applyPromotions, getAvailablePromotions } from "@lib/data/cart"
import { deleteCustomerAddress, addCustomerAddress, login, signup } from "@lib/data/customer"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useActionState } from "react"
import { AppleIcon } from "lucide-react"
import { useCart } from "@lib/context/cart-context"

import { Check, X, Minus, Plus, ChevronRight, ChevronLeft, Home, Truck, CreditCard, ShieldCheck, Tag, MoreHorizontal, Banknote, ShoppingBag, ArrowRight } from "lucide-react"

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
  apple: (c = "") => <AppleIcon className={c} />,
}

/* ━━━━━━━━━━ STEP INDICATOR ━━━━━━━━━━ */
const StepIndicator = ({ currentStep, onStepClick }: { currentStep: number; onStepClick: (s: number) => void }) => {
  const steps = ["Bag", "Address", "Payment"]

  return (
    <div className="flex items-center justify-between gap-0 mb-16 select-none max-w-[400px] md:max-w-[500px] mx-auto lg:mx-0 w-full relative">
      <div className="absolute top-[18px] left-10 right-10 h-[1.5px] bg-accent/10 -z-0" />
      <div 
        className="absolute top-[18px] left-10 h-[1.5px] bg-accent transition-all duration-1000 -z-0" 
        style={{ width: currentStep === 0 ? "0%" : currentStep === 1 ? "42%" : "83%" }}
      />
      {steps.map((label, idx) => {
        const done = idx < currentStep, active = idx === currentStep, future = idx > currentStep
        const status = done ? "Completed" : active ? "In Progress" : "Pending"
        return (
          <button key={label} onClick={() => done && onStepClick(idx)} disabled={future} className="flex flex-col items-center gap-4 relative z-10 group">
            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${done ? "border-accent bg-secondary shadow-sm" : ""} ${active ? "border-accent bg-bg shadow-inner scale-105" : "border-accent/10 bg-bg"} ${future ? "border-accent/5 opacity-40" : ""}`}>
              {done ? <Check className="w-5 h-5 text-accent" strokeWidth={3} /> : <span className={`font-manrope text-[11px] font-bold transition-colors duration-500 ${active ? "text-accent" : "text-accent/10"}`}>{idx + 1}</span>}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className={`font-newsreader text-[13px] font-bold tracking-tight transition-colors duration-500 ${active || done ? "text-accent" : "text-accent/30"}`}>{label}</span>
              <span className={`font-manrope text-[8px] uppercase font-bold tracking-[0.15em] px-2.5 py-1 rounded-full transition-all duration-500 mt-1.5 ${done ? "bg-accent/5 text-accent" : ""} ${active ? "bg-accent/10 text-accent" : "bg-black/[0.02] text-black/10"}`}>{status}</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* ━━━━━━━━━━ BAG STEP ━━━━━━━━━━ */
const BagStep = ({ onContinue }: { onContinue: () => void }) => {
  const { optimisticItems: items, updateQuantity, removeItem, cart } = useCart()

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-accent/[0.02] border border-dashed border-accent/10">
        {Ico.bag("w-12 h-12 text-accent/20 mb-6")}
        <h3 className="font-newsreader italic text-2xl text-accent mb-4">Your bag is empty</h3>
        <LocalizedClientLink href="/store" className="text-accent/40 font-manrope text-[11px] uppercase tracking-widest hover:text-accent transition-colors">Start Shopping</LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 z-0">
      {items.map((item) => (
        <div key={item.id} className="group relative bg-bg border border-accent/5 p-4 md:p-6 transition-all duration-500 hover:border-accent/10 hover:shadow-sm">
          <div className="flex gap-6">
            <div className="relative w-24 h-32 md:w-32 md:h-40 bg-accent/5 overflow-hidden">
               <Thumbnail thumbnail={item.thumbnail} size="square" className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-newsreader italic text-xl md:text-2xl text-accent leading-none">{item.title}</h3>
                  <button onClick={() => removeItem(item.id)} className="p-2 -mr-2 text-accent/20 hover:text-accent transition-colors">{Ico.x("w-4 h-4")}</button>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
                  {item.variant?.options?.map(opt => (
                    <span key={opt.id} className="font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold">{opt.value}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex items-center border border-accent/10 rounded-full h-10 px-1 bg-accent/[0.02]">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-accent/40 hover:text-accent transition-colors">{Ico.minus("w-3 h-3")}</button>
                  <span className="w-8 text-center font-manrope text-[12px] font-bold text-accent">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-accent/40 hover:text-accent transition-colors">{Ico.plus("w-3 h-3")}</button>
                </div>
                <span className="font-manrope text-[15px] font-bold text-accent">
                   {convertToLocale({ amount: (item.unit_price || 0) * item.quantity, currency_code: cart?.currency_code || "INR" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button onClick={onContinue} className="w-full mt-10 py-5 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-black transition-all group flex items-center justify-center gap-3">
        Review Shipping Details {Ico.arrowRight("w-4 h-4 group-hover:translate-x-1 transition-transform border-l border-white/20 pl-3")}
      </button>
    </div>
  )
}

/* ━━━━━━━━━━ ADDRESS STEP (Stub for now) ━━━━━━━━━━ */
const AddressStep = ({ cart, customer, selectedAddress, setSelectedAddress, onContinue }: any) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="bg-bg border border-accent/10 p-10 flex flex-col items-center text-center">
        <Home className="w-10 h-10 text-accent/20 mb-6" />
        <h3 className="font-newsreader italic text-3xl text-accent mb-4">Shipping Address</h3>
        <p className="font-manrope text-[13px] text-accent/50 mb-8 max-w-sm">Please select or add a delivery address to proceed with your order.</p>
        <button onClick={onContinue} className="px-12 py-4 bg-accent text-bg font-manrope text-[13px] font-bold uppercase tracking-widest">Select Address & Continue</button>
      </div>
    </div>
  )
}

/* ━━━━━━━━━━ PAYMENT STEP (Stub for now) ━━━━━━━━━━ */
const PaymentStep = ({ cart }: any) => {
  return (
    <div className="bg-bg border border-accent/10 p-10 flex flex-col items-center text-center">
       <CreditCard className="w-10 h-10 text-accent/20 mb-6" />
       <h3 className="font-newsreader italic text-3xl text-accent mb-4">Secure Payment</h3>
       <p className="font-manrope text-[13px] text-accent/50 mb-8 max-w-sm">Complete your experience via our secure high-end payment gateway.</p>
    </div>
  )
}

/* ━━━━━━━━━━ ORDER SUMMARY ━━━━━━━━━━ */
const OrderSummary = ({ currentStep, onContinue, selectedAddress }: any) => {
  const { subtotal, cart } = useCart()
  const label = currentStep === 0 ? "Checkout Now" : currentStep === 1 ? "Review Payment" : "Place Order"

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <h2 className="font-newsreader italic text-3xl text-bg leading-none">Order Details</h2>
        <div className="flex flex-col gap-3 font-manrope text-[13px] uppercase font-regular">
          <div className="flex justify-between"><span className="text-bg">Total MRP</span><span className="text-bg font-semibold">{convertToLocale({ amount: subtotal, currency_code: cart?.currency_code || "INR" })}</span></div>
          {(cart?.discount_total ?? 0) > 0 && <div className="flex justify-between"><span className="text-bg">Discount</span><span className="text-green-700">- {convertToLocale({ amount: cart?.discount_total || 0, currency_code: cart?.currency_code || "INR" })}</span></div>}
          <div className="flex justify-between"><span className="text-bg">Delivery Fee</span><span className="text-green-700">Free</span></div>
        </div>
        <div className="border-t border-dashed border-bg/10 pt-6 flex justify-between items-center">
          <span className="font-newsreader italic text-2xl text-bg">Total Payable</span>
          <span className="font-manrope text-xl text-bg font-semibold">{convertToLocale({ amount: subtotal - (cart?.discount_total || 0), currency_code: cart?.currency_code || "INR" })}</span>
        </div>
        <button onClick={onContinue} className="w-full py-5 bg-bg text-accent font-manrope text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-bg/90 transition-all flex items-center justify-center gap-3 group">
          {label} {Ico.arrowRight("w-4 h-4 group-hover:translate-x-1 transition-transform")}
        </button>
      </div>
    </div>
  )
}

const CheckoutFlow = ({ customer }: { customer: HttpTypes.StoreCustomer | null }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState<HttpTypes.StoreCustomerAddress | null>(
    customer?.addresses?.find(a => a.is_default_shipping) ?? customer?.addresses?.[0] ?? null
  )
  const [showSuccess, setShowSuccess] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const { cart } = useCart()

  const goToStep = (s: number) => { setCurrentStep(s); window.scrollTo({ top: 0, behavior: "smooth" }) }

  const handleProceed = () => {
    if (currentStep === 0 && !customer) { setAuthOpen(true) }
    else if (currentStep < 2) { goToStep(currentStep + 1) }
    else { setShowSuccess(true) }
  }

  if (showSuccess && cart) {
    return (
       <div className="fixed inset-0 bg-black/30 z-[200] flex items-center justify-center p-6">
         <div className="bg-bg p-12 max-w-md w-full flex flex-col items-center gap-8 shadow-2xl">
           <div className="w-20 h-20 bg-green-50 flex items-center justify-center rounded-full"><Check className="w-10 h-10 text-green-500" /></div>
           <h2 className="font-newsreader italic text-3xl text-accent">Experience Confirmed</h2>
           <p className="font-manrope text-[14px] text-accent/50 text-center leading-relaxed">Your order has been successfully placed.</p>
           <LocalizedClientLink href="/store" className="w-full py-4 bg-accent text-bg text-center font-bold uppercase tracking-widest">Back to Store</LocalizedClientLink>
         </div>
       </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg selection:bg-accent selection:text-bg pt-24">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-0">
          <div className="flex-[1.5] lg:pr-24 pb-24">
            <StepIndicator currentStep={currentStep} onStepClick={goToStep} />
            <div className="mt-8 w-full">
               {currentStep === 0 && <BagStep onContinue={handleProceed} />}
               {currentStep === 1 && cart && <AddressStep cart={cart} customer={customer} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} onContinue={handleProceed} />}
               {currentStep === 2 && cart && <PaymentStep cart={cart} />}
            </div>
          </div>
          <div className="hidden lg:block lg:flex-1 bg-accent border-l border-accent/5 min-h-screen -mt-24 -mr-16">
            <div className="sticky top-0 py-24 px-12">
              <OrderSummary currentStep={currentStep} onContinue={handleProceed} selectedAddress={selectedAddress} />
            </div>
          </div>
        </div>
      </div>
       <AuthSidebar isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

/* ━━━━━━━━━━ STUB AUTH SIDEBAR ━━━━━━━━━━ */
const AuthSidebar = ({ isOpen, onClose }: any) => {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[300] flex justify-end">
      <div className="bg-bg w-full max-w-md h-full p-12 flex flex-col">
        <button onClick={onClose} className="self-end mb-10"><X /></button>
        <h2 className="font-newsreader italic text-4xl text-accent mb-6">Join the Club</h2>
        <p className="font-manrope text-[13px] text-accent/50 mb-10">Sign in or create an account to proceed to checkout.</p>
        <div className="space-y-4">
          <button className="w-full py-4 bg-accent text-bg font-bold uppercase tracking-widest">Sign In</button>
          <button className="w-full py-4 border border-accent text-accent font-bold uppercase tracking-widest">Register</button>
        </div>
      </div>
    </div>
  )
}

export default CheckoutFlow
