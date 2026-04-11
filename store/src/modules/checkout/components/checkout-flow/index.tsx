"use client"

import React, { useState, useMemo, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { listCartOptions, setShippingMethod, selectSavedAddress } from "@lib/data/cart"
import { deleteCustomerAddress } from "@lib/data/customer"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@lib/context/cart-context"

// Sub-components
import AuthSidebar from "./auth-sidebar"
import StepIndicator from "./step-indicator"
import BagStep from "./bag-step"
import AddressStep from "./address-step"
import PaymentStep from "./payment-step"
import MobilePriceDrawer from "./mobile-price-drawer"
import OrderSummary from "./order-summary"

const Ico = {
  check: (c = "") => <Check className={c} strokeWidth={3} />,
  chevLeft: (c = "") => <ChevronLeft className={c} strokeWidth={2} />,
  chevRight: (c = "") => <ChevronRight className={c} strokeWidth={2} />,
}

const CheckoutFlow = ({ cart: initialCart, customer }: { cart: HttpTypes.StoreCart; customer: HttpTypes.StoreCustomer | null }) => {
  const { cart, setCart, optimisticItems } = useCart()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState<HttpTypes.StoreCustomerAddress | null>(
    customer?.addresses?.find(a => a.is_default_shipping) ?? customer?.addresses?.[0] ?? null
  )
  const [shippingOptions, setShippingOptions] = useState<HttpTypes.StoreCartShippingOption[]>([])
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState<string | null>(null)
  const [isLoadingShipping, setIsLoadingShipping] = useState(false)

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  const selectedShippingPrice = useMemo(() => {
    return shippingOptions.find(o => o.id === selectedShippingOptionId)?.amount || cart?.shipping_total || 0
  }, [selectedShippingOptionId, shippingOptions, cart?.shipping_total])

  // Fetch shipping options when address changes
  useEffect(() => {
    const fetchOptions = async () => {
      if (!cart?.id || !selectedAddress) return
      setIsLoadingShipping(true)
      try {
        // First sync the selected address with the cart in Medusa
        await selectSavedAddress(selectedAddress)
        const opts = await listCartOptions()
        setShippingOptions(opts.shipping_options || [])
        // Auto select first option if none selected
        if (opts.shipping_options?.length > 0 && !selectedShippingOptionId) {
          setSelectedShippingOptionId(opts.shipping_options[0].id)
        }
      } catch (err) {
        console.error("Error fetching shipping options:", err)
      } finally {
        setIsLoadingShipping(false)
      }
    }

    if (currentStep >= 1) {
      fetchOptions()
    }
  }, [selectedAddress, currentStep, cart?.id])

  // Sync prop cart with global provider on mount
  useEffect(() => {
    if (initialCart) {
      setCart(initialCart)
    }
  }, [initialCart, setCart])

  const goToStep = (s: number) => { setCurrentStep(s); window.scrollTo({ top: 0, behavior: "smooth" }) }

  const handleProceed = async () => {
    if (currentStep === 0 && !customer) {
      setAuthOpen(true)
    } else if (currentStep === 1) {
      if (selectedShippingOptionId && cart?.id) {
        setIsLoadingShipping(true)
        try {
          await setShippingMethod({ cartId: cart.id, shippingMethodId: selectedShippingOptionId })
          goToStep(currentStep + 1)
        } catch (err) {
          console.error("Error setting shipping method:", err)
        } finally {
          setIsLoadingShipping(false)
        }
      } else {
        goToStep(currentStep + 1)
      }
    } else if (currentStep < 2) {
      goToStep(currentStep + 1)
    } else {
      setShowSuccess(true)
    }
  }

  if (showSuccess && cart) {
    const totalPayable = (optimisticItems.reduce((acc, i) => acc + (i.unit_price || 0) * i.quantity, 0)) - (cart.discount_total ?? 0) + selectedShippingPrice
    
    return (
      <div className="fixed inset-0 bg-black/30 z-[200] flex items-center justify-center p-6">
        <div className="bg-bg p-12 max-w-md w-full flex flex-col items-center gap-8 shadow-2xl animate-in zoom-in-95 fade-in duration-500">
          <div className="w-20 h-20 bg-green-50 flex items-center justify-center rounded-full">
            {Ico.check("w-10 h-10 text-green-500")}
          </div>
          <h2 className="font-newsreader italic text-3xl text-accent">Order Placed!</h2>
          <p className="font-manrope text-[14px] text-accent/50 text-center leading-relaxed">Estimated delivery by <span className="font-bold text-accent">{new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></p>
          <div className="bg-accent/[0.03] border border-accent/5 p-6 w-full">
            <div className="flex justify-between font-manrope text-[13px] uppercase tracking-widest font-bold"><span className="text-accent/40">Total Paid</span><span className="text-accent">{convertToLocale({ amount: totalPayable, currency_code: cart.currency_code })}</span></div>
          </div>
          <LocalizedClientLink href="/store" className="px-10 py-4 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-accent/90 transition-all">Continue Shopping</LocalizedClientLink>
        </div>
      </div>
    )
  }

  if (!cart) return null

  const payableAmount = (optimisticItems.reduce((acc, i) => acc + (i.unit_price || 0) * i.quantity, 0)) - (cart.discount_total ?? 0) + selectedShippingPrice

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
          <div className="flex-1 lg:max-w-[55%] flex flex-col justify-center items-center">
            <StepIndicator currentStep={currentStep} onStepClick={goToStep} />
            
            <div className="mt-8 w-full">
              {currentStep === 0 && <BagStep onContinue={handleProceed} />}
              {currentStep === 1 && (
                <AddressStep 
                  cart={cart} 
                  customer={customer} 
                  selectedAddress={selectedAddress} 
                  setSelectedAddress={setSelectedAddress} 
                  onContinue={handleProceed}
                  shippingOptions={shippingOptions}
                  selectedShippingOptionId={selectedShippingOptionId}
                  setSelectedShippingOptionId={setSelectedShippingOptionId}
                  isLoadingShipping={isLoadingShipping}
                />
              )}
              {currentStep === 2 && <PaymentStep cart={cart} />}
            </div>
          </div>
          
          {/* RIGHT: ORDER DETAIL SIDEBAR */}
          <div className="hidden lg:block lg:flex-1 bg-accent border-l border-accent/5 min-h-screen -mt-24 -mr-16">
            <div className="sticky top-0 py-24 px-12">
              <OrderSummary 
                currentStep={currentStep} 
                onContinue={handleProceed} 
                selectedAddress={selectedAddress} 
                isLoadingShipping={isLoadingShipping}
                selectedShippingPrice={selectedShippingPrice}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg border-t shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-accent/5 px-4 py-3 z-50 flex items-center justify-between">
        <div onClick={() => setDrawerOpen(true)} className="cursor-pointer">
          <p className="font-newsreader italic text-xl text-accent">{convertToLocale({ amount: payableAmount, currency_code: cart.currency_code })}</p>
          <button className="font-manrope text-[10px] uppercase font-bold tracking-widest text-accent/40 flex items-center gap-1 mt-0.5">View Details {Ico.chevRight("w-3 h-3 -rotate-90")}</button>
        </div>
        <button onClick={handleProceed} disabled={(currentStep === 1 && !selectedAddress) || isLoadingShipping}
          className="px-8 py-4 bg-accent text-bg font-manrope text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-accent/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          {isLoadingShipping ? "Processing..." : currentStep === 0 ? "PROCEED" : currentStep === 1 ? "CONTINUE" : "PLACE ORDER"}
        </button>
      </div>

      {/* Mobile Price Drawer */}
      <MobilePriceDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} selectedShippingPrice={selectedShippingPrice} />

      {/* Auth Sidebar */}
      <AuthSidebar isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default CheckoutFlow
