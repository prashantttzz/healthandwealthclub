"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { clx, Heading, Text } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useCheckout } from "@lib/context/checkout-context"
import { useEffect, useState } from "react"
import { CreditCard, ChevronRight, Wallet, Landmark, Zap, Gift, ShieldCheck, ChevronDown } from "lucide-react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: HttpTypes.StoreCart
  availablePaymentMethods: HttpTypes.StorePaymentProvider[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const { currentStep, setIsSubmitting, goToStep, setOnSubmit, setCanContinue } = useCheckout()
  const [error, setError] = useState<string | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const isOpen = currentStep === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const checkActiveSession = activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }
      
      // If it's the final step, we might want to go to review or place order
      // Assuming we go to review for final confirmation as per Medusa flow
      goToStep("review")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Register submit action to global context
  useEffect(() => {
    if (isOpen) {
      setOnSubmit(() => handleSubmit)
      setCanContinue(!!selectedPaymentMethod)
    }
    return () => {
      setOnSubmit(null)
    }
  }, [isOpen, selectedPaymentMethod])

  if (!isOpen) return null

  // Map to visual row data
  const getProviderIcon = (id: string) => {
    if (id.includes("stripe")) return <CreditCard size={20} />
    if (id.includes("upi")) return <Zap size={20} />
    if (id.includes("wallet")) return <Wallet size={20} />
    return <Landmark size={20} />
  }

  const getProviderTitle = (id: string, originalName: string) => {
    if (id.includes("stripe")) return "Credit / Debit Card"
    if (id.includes("upi")) return "UPI (PhonePe, Google Pay, etc.)"
    if (id.includes("wallet")) return "Wallets"
    return originalName
  }

  return (
    <div className="flex flex-col gap-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div>
        <Heading className="font-manrope text-[11px] uppercase font-bold tracking-[0.2em] text-accent/40 mb-6">
          Other Payments
        </Heading>

        <div className="bg-bg border border-black/5 divide-y divide-black/5 shadow-sm">
          <RadioGroup
            value={selectedPaymentMethod}
            onChange={setPaymentMethod}
            className="flex flex-col"
          >
            {availablePaymentMethods.map((paymentMethod) => {
              const isActive = selectedPaymentMethod === paymentMethod.id
              
              return (
                <RadioGroup.Option
                  key={paymentMethod.id}
                  value={paymentMethod.id}
                  className={clx(
                    "flex items-center justify-between p-6 cursor-pointer transition-all duration-300 group",
                    {
                      "bg-accent/[0.02]": isActive,
                      "hover:bg-accent/[0.01]": !isActive,
                    }
                  )}
                >
                  <div className="flex items-center gap-x-6">
                    <div className={clx(
                      "h-10 w-10 flex items-center justify-center transition-colors",
                      {
                        "text-accent": isActive,
                        "text-accent/30 group-hover:text-accent/60": !isActive,
                      }
                    )}>
                      {getProviderIcon(paymentMethod.id)}
                    </div>
                    <span className={clx(
                      "font-manrope text-[14px] font-bold transition-colors",
                      {
                        "text-accent": isActive,
                        "text-accent/60": !isActive,
                      }
                    )}>
                      {getProviderTitle(paymentMethod.id, paymentMethod.id)}
                    </span>
                  </div>
                  
                  <ChevronRight 
                    size={16} 
                    className={clx(
                      "transition-all duration-300",
                      {
                        "text-accent translate-x-1": isActive,
                        "text-accent/20": !isActive,
                      }
                    )} 
                  />
                </RadioGroup.Option>
              )
            })}
          </RadioGroup>
        </div>
      </div>

      <ErrorMessage error={error} />

      {/* Accordions Section */}
      <div className="flex flex-col gap-y-4">
        {[
          { label: "First Citizen", icon: <ShieldCheck size={18} /> },
          { label: "Gift Card / E-Gift Voucher", icon: <Gift size={18} /> },
        ].map((item, i) => (
          <div key={i} className="bg-bg border border-black/5 p-6 flex items-center justify-between cursor-pointer hover:border-black/20 transition-all duration-300 group">
            <div className="flex items-center gap-x-4">
              <div className="text-accent/30 group-hover:text-accent transition-colors">
                {item.icon}
              </div>
              <span className="font-manrope text-[12px] font-bold text-accent/60 group-hover:text-accent uppercase tracking-wider transition-colors">
                {item.label}
              </span>
            </div>
            <ChevronDown size={16} className="text-accent/20 group-hover:text-accent transition-colors" />
          </div>
        ))}
      </div>

      {/* Security Message */}
      <div className="flex items-center justify-center gap-x-3 text-accent/20 opacity-50 select-none py-4">
         <ShieldCheck size={14} />
         <span className="font-manrope text-[10px] uppercase font-bold tracking-[0.2em]">100% Secure & Encrypted Payments</span>
      </div>
    </div>
  )
}

export default Payment
