"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-10">
      <Heading 
        level="h2" 
        className="font-newsreader italic text-3xl md:text-4xl text-accent"
      >
        Summary
      </Heading>
      
      <div className="space-y-6">
        <DiscountCode cart={cart} />
        <CartTotals totals={cart} />
      </div>

      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
        className="w-full"
      >
        <button className="w-full py-4 bg-accent text-bg font-manrope text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-accent/90 transition-all duration-300 ">
          Secure Checkout
        </button>
      </LocalizedClientLink>

      <div className="flex flex-col gap-2 pt-4 border-t border-black/5">
        <span className="font-manrope text-[10px] uppercase font-bold text-accent/30 tracking-widest text-center">
          Delivery charges calculated at checkout
        </span>
      </div>
    </div>
  )
}

export default Summary
