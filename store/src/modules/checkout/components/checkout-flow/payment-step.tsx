"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { CreditCard, ShieldCheck } from "lucide-react"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { placeOrder } from "@lib/data/cart"

const Ico = {
  card: (c = "") => <CreditCard className={c} strokeWidth={1.5} />,
  shield: (c = "") => <ShieldCheck className={c} strokeWidth={1.5} />,
}

const PaymentStepContent = ({
  cart,
  onPaymentSuccess,
  setIsPlacingOrder,
}: {
  cart: HttpTypes.StoreCart
  onPaymentSuccess: () => void
  setIsPlacingOrder: (loading: boolean) => void
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const finalizeOrder = async () => {
    setSuccessMessage("Payment authorized successfully. Finalizing your order...")
    await placeOrder(cart.id).catch(() => {})
    onPaymentSuccess()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPlacingOrder(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!stripe || !elements) {
      setErrorMessage("Stripe payment form is still loading. Please wait a moment.")
      setIsPlacingOrder(false)
      return
    }

    const paymentElement = elements.getElement("payment")
    if (!paymentElement) {
      setErrorMessage("Stripe payment UI is not ready yet. Please refresh and try again.")
      setIsPlacingOrder(false)
      return
    }

    const paymentSession = cart.payment_collection?.payment_sessions?.find(
      (s) => s.status === "pending"
    )
    const clientSecret = paymentSession?.data?.client_secret as string | undefined

    if (!clientSecret) {
      setErrorMessage("Missing Stripe payment session. Please refresh and try again.")
      setIsPlacingOrder(false)
      return
    }

    try {
      const existingIntent = await stripe.retrievePaymentIntent(clientSecret)
      const existingStatus = existingIntent.paymentIntent?.status

      if (existingStatus === "requires_capture" || existingStatus === "succeeded") {
        await finalizeOrder()
        return
      }

      const submitResult = await elements.submit()

      if (submitResult.error) {
        setErrorMessage(submitResult.error.message || "Please check your payment details.")
        return
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: cart.email || undefined,
        },
        redirect: "if_required",
      })

      if (error) {
        const errorIntentStatus = error.payment_intent?.status

        if (errorIntentStatus === "requires_capture" || errorIntentStatus === "succeeded") {
          await finalizeOrder()
          return
        }

        setErrorMessage(error.message || "An error occurred with your payment.")
      } else if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "requires_capture")) {
        await finalizeOrder()
      } else {
        setErrorMessage("Payment was not successful. Status: " + paymentIntent?.status)
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.")
    } finally {
      setIsPlacingOrder(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em]">Select Payment Method</h3>

      <div className="border border-accent/20 shadow-sm overflow-hidden">
        <div className="w-full flex items-center justify-between p-6 bg-black/[0.04] lg:bg-black/[0.02]">
          <div className="flex items-center gap-5">
            {Ico.card("w-6 h-6 text-accent")}
            <span className="font-manrope text-[15px] font-bold text-accent">Credit / Debit Card</span>
          </div>
          <span className="w-6 h-6 rounded-full border-2 border-accent bg-accent flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-bg" />
          </span>
        </div>
        <div className="px-6 pb-6 border-t border-accent/5 pt-5 animate-in slide-in-from-top-2 fade-in duration-300 bg-secondary/50">
          <div className="flex flex-col gap-4">
            <div className="w-full mt-2">
              <PaymentElement
                onChange={() => {
                  if (errorMessage) setErrorMessage(null)
                  if (successMessage) setSuccessMessage(null)
                }}
              />
            </div>

            {errorMessage && (
              <p className="font-manrope text-[11px] text-red-500 font-bold uppercase tracking-widest mt-1">
                {errorMessage}
              </p>
            )}

            {successMessage && (
              <p className="font-manrope text-[11px] text-green-600 font-bold uppercase tracking-widest mt-1">
                {successMessage}
              </p>
            )}

            <div className="flex items-center gap-2 text-accent/30 mt-1">
              {Ico.shield("w-4 h-4")}
              <span className="font-manrope text-[10px] uppercase tracking-widest">
                Powered by Stripe secure checkout
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="font-manrope text-[11px] text-accent/25 text-center mt-2 uppercase tracking-widest">
        By placing order you agree to our <span className="underline cursor-pointer">Terms & Conditions</span>
      </p>

      {/* Hidden button triggered from external OrderSummary sidebar */}
      <button type="submit" id="submit-stripe-payment-btn" className="hidden">Submit</button>
    </form>
  )
}

const PaymentStep = ({
  cart,
  onPaymentSuccess,
  setIsPlacingOrder,
}: {
  cart: HttpTypes.StoreCart
  onPaymentSuccess: () => void
  setIsPlacingOrder: (loading: boolean) => void
}) => {
  return (
    <PaymentWrapper cart={cart}>
      <PaymentStepContent
        cart={cart}
        onPaymentSuccess={onPaymentSuccess}
        setIsPlacingOrder={setIsPlacingOrder}
      />
    </PaymentWrapper>
  )
}

export default PaymentStep
