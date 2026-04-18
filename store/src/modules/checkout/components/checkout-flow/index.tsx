"use client"

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { HttpTypes } from "@medusajs/types"
import { listCartOptions, setShippingMethod, selectSavedAddress, retrieveCart, updateCart, initiatePaymentSession } from "@lib/data/cart"
import { useCurrencyFormatter } from "@lib/currency"
import { listCartPaymentMethods } from "@lib/data/payment"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@lib/context/cart-context"
import { isStripeLike } from "@lib/constants"

// Sub-components
import AuthSidebar from "./auth-sidebar"
import StepIndicator from "./step-indicator"
import BagStep from "./bag-step"
import AddressStep from "./address-step"
import PaymentStep from "./payment-step"
import MobilePriceDrawer from "./mobile-price-drawer"
import OrderSummary from "./order-summary"
import { getDeliveryEstimate } from "@lib/util/delivery-estimate"

const Ico = {
  check: (c = "") => <Check className={c} strokeWidth={3} />,
  chevLeft: (c = "") => <ChevronLeft className={c} strokeWidth={2} />,
  chevRight: (c = "") => <ChevronRight className={c} strokeWidth={2} />,
}

const CheckoutFlow = ({ cart: initialCart, customer }: { cart: HttpTypes.StoreCart; customer: HttpTypes.StoreCustomer | null }) => {
  const { cart, setCart, optimisticItems } = useCart()
  const { formatPrice } = useCurrencyFormatter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAddress, setSelectedAddress] = useState<HttpTypes.StoreCustomerAddress | null>(() => {
    const countriesInRegion = initialCart?.region?.countries?.map((c) => c.iso_2?.toLowerCase()) || []
    const validAddresses = customer?.addresses?.filter(
      (a) => a.country_code && countriesInRegion.includes(a.country_code.toLowerCase())
    ) || []
    
    return validAddresses.find(a => a.is_default_shipping) ?? validAddresses[0] ?? null
  })
  const [shippingOptions, setShippingOptions] = useState<HttpTypes.StoreCartShippingOption[]>([])
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState<string | null>(null)
  const [isLoadingShipping, setIsLoadingShipping] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const [recipientName, setRecipientName] = useState(cart?.shipping_address?.metadata?.recipient_name as string || "")
  const [recipientPhone, setRecipientPhone] = useState(cart?.shipping_address?.metadata?.recipient_phone as string || "")

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const lastSyncedAddressIdRef = useRef<string | null>(null)
  const shippingRequestRef = useRef(0)
  const [paymentProviders, setPaymentProviders] = useState<HttpTypes.StorePaymentProvider[]>([])

  const selectedShippingPrice = useMemo(() => {
    return shippingOptions.find(o => o.id === selectedShippingOptionId)?.amount || cart?.shipping_total || 0
  }, [selectedShippingOptionId, shippingOptions, cart?.shipping_total])

  const stripeProviderId = useMemo(() => {
    const activeSessionProviderId = cart?.payment_collection?.payment_sessions?.find(
      (session) => session.status === "pending"
    )?.provider_id

    if (activeSessionProviderId && isStripeLike(activeSessionProviderId)) {
      return activeSessionProviderId
    }

    const stripeProvider = paymentProviders.find((provider) => isStripeLike(provider.id))
    return stripeProvider?.id || paymentProviders[0]?.id || null
  }, [cart?.payment_collection?.payment_sessions, paymentProviders])

  useEffect(() => {
    const fetchPaymentProviders = async () => {
      const regionId = cart?.region?.id || initialCart?.region?.id
      if (!regionId) return

      const providers = await listCartPaymentMethods(regionId)
      if (providers) {
        setPaymentProviders(providers)
      }
    }

    fetchPaymentProviders()
  }, [cart?.region?.id, initialCart?.region?.id])

  const syncAddressAndShippingOptions = useCallback(
    async (address: HttpTypes.StoreCustomerAddress) => {
      if (!cart?.id || !address) return

      const requestId = ++shippingRequestRef.current
      setIsLoadingShipping(true)

      try {
        const res = await selectSavedAddress(address)

        if (!res.success) {
          console.error("Failed to sync address:", res.error)
          return
        }

        if (res.cart && requestId === shippingRequestRef.current) {
          setCart(res.cart)
        }

        const opts = await listCartOptions()
        if (requestId !== shippingRequestRef.current) {
          return
        }

        const nextOptions = opts.shipping_options || []
        setShippingOptions(nextOptions)
        lastSyncedAddressIdRef.current = address.id

        setSelectedShippingOptionId((prev) => {
          if (prev && nextOptions.some((option) => option.id === prev)) {
            return prev
          }

          return nextOptions[0]?.id || null
        })
      } catch (err) {
        console.error("Error fetching shipping options:", err)
      } finally {
        if (requestId === shippingRequestRef.current) {
          setIsLoadingShipping(false)
        }
      }
    },
    [cart?.id, setCart]
  )

  // Fetch shipping options when address changes or as early as possible to prefetch
  useEffect(() => {
    if (!selectedAddress || !cart?.id) return
    if (lastSyncedAddressIdRef.current === selectedAddress.id && shippingOptions.length > 0) return

    syncAddressAndShippingOptions(selectedAddress)
  }, [selectedAddress, cart?.id, shippingOptions.length, syncAddressAndShippingOptions])

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
    } else if (currentStep === 0) {
      if (selectedAddress && lastSyncedAddressIdRef.current !== selectedAddress.id) {
        void syncAddressAndShippingOptions(selectedAddress)
      }
      goToStep(1)
    } else if (currentStep === 1) {
      if (selectedShippingOptionId && cart?.id) {
        setIsLoadingShipping(true)
        try {
          // Sync gifting metadata before proceeding
          const currentRecipientName = cart.shipping_address?.metadata?.recipient_name as string || ""
          const currentRecipientPhone = cart.shipping_address?.metadata?.recipient_phone as string || ""
          const metadataChanged = recipientName !== currentRecipientName || recipientPhone !== currentRecipientPhone

          if (metadataChanged) {
            await updateCart({
              shipping_address: {
                metadata: {
                  ...cart.shipping_address?.metadata,
                  recipient_name: recipientName,
                  recipient_phone: recipientPhone
                }
              }
            })
          }
          
          await setShippingMethod({ cartId: cart.id, shippingMethodId: selectedShippingOptionId })

          if (!stripeProviderId) {
            throw new Error("No payment provider is configured for this region.")
          }

          await initiatePaymentSession(cart, { provider_id: stripeProviderId })
          const updatedCart = await retrieveCart()
          if (updatedCart) setCart(updatedCart)
          goToStep(currentStep + 1)
        } catch (err) {
          console.error("Error setting shipping method or payment session:", err)
        } finally {
          setIsLoadingShipping(false)
        }
      } else {
        goToStep(currentStep + 1)
      }
    } else if (currentStep === 2) {
      document.getElementById("submit-stripe-payment-btn")?.click()
    }
  }

  if (showSuccess && cart) {
    const totalPayable = (optimisticItems.reduce((acc, i) => acc + (i.unit_price || 0) * i.quantity, 0)) - (cart.discount_total ?? 0) + selectedShippingPrice
    const deliveryEstimate = getDeliveryEstimate({
      countryCode: selectedAddress?.country_code || cart.shipping_address?.country_code,
      baseDate: new Date(),
    })
    return (
      <div className="fixed inset-0 bg-black/30 z-[200] flex items-center justify-center p-6">
        <div className="bg-bg p-12 max-w-md w-full flex flex-col items-center gap-8 shadow-2xl animate-in zoom-in-95 fade-in duration-500">
          <div className="w-20 h-20 bg-green-50 flex items-center justify-center rounded-full">
            {Ico.check("w-10 h-10 text-green-500")}
          </div>
          <h2 className="font-newsreader italic text-3xl text-accent">Order Placed!</h2>
          <p className="font-manrope text-[14px] text-accent/50 text-center leading-relaxed">
            Estimated delivery by <span className="font-bold text-accent">{deliveryEstimate.formattedDate}</span>
          </p>
          <p className="font-manrope text-[11px] text-accent/40 text-center uppercase tracking-[0.18em]">{deliveryEstimate.label}</p>
          <div className="bg-accent/[0.03] border border-accent/5 p-6 w-full">
            <div className="flex justify-between font-manrope text-[13px] uppercase tracking-widest font-bold"><span className="text-accent/40">Total Paid</span><span className="text-accent">{formatPrice(totalPayable)}</span></div>
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
                  recipientName={recipientName}
                  setRecipientName={setRecipientName}
                  recipientPhone={recipientPhone}
                  setRecipientPhone={setRecipientPhone}
                />
              )}
              {currentStep === 2 && (
                <PaymentStep 
                  cart={cart} 
                  onPaymentSuccess={() => setShowSuccess(true)}
                  setIsPlacingOrder={setIsPlacingOrder}
                />
              )}
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
                selectedShippingOptionId={selectedShippingOptionId}
                shippingOptions={shippingOptions}
                isPlacingOrder={isPlacingOrder}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg border-t shadow-[0_-4px_20px_rgba(0,0,0,0.03)] border-accent/5 px-4 py-3 z-50 flex items-center justify-between">
        <div onClick={() => setDrawerOpen(true)} className="cursor-pointer">
          <p className="font-newsreader italic text-xl text-accent">{formatPrice(payableAmount)}</p>
          {shippingOptions.length === 0 && currentStep === 1 ? (
            <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
               {selectedAddress 
                 ? "No shipping methods available" 
                 : "Select an address"}
            </div>
          ) : (<button className="font-manrope text-[10px] uppercase font-bold tracking-widest text-accent/40 flex items-center gap-1 mt-0.5">View Details {Ico.chevRight("w-3 h-3 -rotate-90")}</button>
          )}
        </div>
        <button onClick={handleProceed} disabled={(currentStep === 1 && (!selectedAddress || shippingOptions.length === 0 || !selectedShippingOptionId || isLoadingShipping)) || isPlacingOrder}
          className="px-8 py-4 bg-accent text-bg font-manrope text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-accent/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
          {(currentStep === 1 && isLoadingShipping) || isPlacingOrder ? "Processing..." : currentStep === 0 ? "PROCEED" : currentStep === 1 ? "CONTINUE" : "PLACE ORDER"}
        </button>
      </div>

      {/* Mobile Price Drawer */}
      <MobilePriceDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedShippingPrice={selectedShippingPrice}
        countryCode={selectedAddress?.country_code || cart.shipping_address?.country_code}
        baseDate={cart.created_at}
      />

      {/* Auth Sidebar */}
      <AuthSidebar isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}

export default CheckoutFlow
