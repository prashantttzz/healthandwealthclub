"use client"

import { Stripe, StripeElementsOptions } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { HttpTypes } from "@medusajs/types"
import { createContext } from "react"

type StripeWrapperProps = {
  paymentSession: HttpTypes.StorePaymentSession
  stripeKey?: string
  stripePromise: Promise<Stripe | null> | null
  children: React.ReactNode
}

export const StripeContext = createContext(false)

const StripeWrapper: React.FC<StripeWrapperProps> = ({
  paymentSession,
  stripeKey,
  stripePromise,
  children,
}) => {
  const options: StripeElementsOptions = {
    clientSecret: paymentSession!.data?.client_secret as string | undefined,
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#263723",
        colorBackground: "#ffffff",
        colorText: "#263723",
        colorDanger: "#df1b41",
        fontFamily: "var(--font-manrope), sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
        gridColumnSpacing: "16px",
        gridRowSpacing: "16px",
      },
      rules: {
        ".Input": {
          padding: "14px 12px",
          border: "1px solid rgba(38, 55, 35, 0.15)",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
          backgroundColor: "#ffffff",
          transition: "border 0.2s ease, box-shadow 0.2s ease",
        },
        ".Input:focus": {
          border: "1px solid #263723",
          boxShadow: "0px 0px 0px 1px #263723",
        },
        ".Label": {
          fontWeight: "700",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          fontSize: "10px",
          color: "rgba(38, 55, 35, 0.6)",
          marginBottom: "8px",
        },
        ".Tab": {
          border: "1px solid rgba(38, 55, 35, 0.1)",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
          backgroundColor: "#ffffff",
          padding: "10px 14px",
        },
        ".Tab:hover": {
          color: "var(--colorPrimary)",
        },
        ".Tab--selected": {
          borderColor: "#263723",
          borderWidth: "2px",
          boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  }

  if (!stripeKey) {
    throw new Error(
      "Stripe key is missing. Set NEXT_PUBLIC_STRIPE_KEY environment variable."
    )
  }

  if (!stripePromise) {
    throw new Error(
      "Stripe promise is missing. Make sure you have provided a valid Stripe key."
    )
  }

  if (!paymentSession?.data?.client_secret) {
    throw new Error(
      "Stripe client secret is missing. Cannot initialize Stripe."
    )
  }

  return (
    <StripeContext.Provider value={true}>
      <Elements options={options} stripe={stripePromise}>
        {children}
      </Elements>
    </StripeContext.Provider>
  )
}

export default StripeWrapper
