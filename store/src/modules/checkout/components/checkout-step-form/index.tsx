"use client"

import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"
import CheckoutTabs from "@modules/checkout/components/checkout-tabs"
import Addresses from "@modules/checkout/components/addresses"
import Shipping from "@modules/checkout/components/shipping"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"

const CheckoutStepForm = ({
  cart,
  customer,
  shippingMethods,
  paymentMethods,
}: {
  cart: HttpTypes.StoreCart
  customer: HttpTypes.StoreCustomer | null
  shippingMethods: HttpTypes.StoreCartShippingOption[]
  paymentMethods: HttpTypes.StorePaymentProvider[]
}) => {
  const searchParams = useSearchParams()
  const step = searchParams.get("step") || "address"

  const isShippingTab = step === "address" || step === "delivery"
  const isPaymentTab = step === "payment"
  const isSummaryTab = step === "review"

  return (
    <div className="w-full flex flex-col">
      <CheckoutTabs />
      
      <div className="w-full">
        {isShippingTab && (
          <div className="flex flex-col gap-y-12">
            <Addresses cart={cart} customer={customer} />
            <Shipping cart={cart} availableShippingMethods={shippingMethods} />
          </div>
        )}

        {isPaymentTab && (
          <div className="flex flex-col">
            <Payment cart={cart} availablePaymentMethods={paymentMethods} />
          </div>
        )}

        {isSummaryTab && (
          <div className="flex flex-col">
            <Review cart={cart} />
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutStepForm
