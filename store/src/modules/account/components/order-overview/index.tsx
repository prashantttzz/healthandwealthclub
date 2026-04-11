"use client"

import { Button } from "@medusajs/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const OrderOverview = ({ orders }: { orders: HttpTypes.StoreOrder[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div
            key={o.id}
            className="border-b border-gray-200 pb-6 last:pb-0 last:border-none"
          >
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center justify-center py-24 text-center"
      data-testid="no-orders-container"
    >
      <div className="flex flex-col gap-6 items-center max-w-md">
        <h2 className="font-newsreader italic text-5xl text-accent leading-tight">Nothing to see here</h2>
        <p className="font-manrope text-[14px] text-accent/50 leading-relaxed">
          You don&apos;t have any orders yet, let us change that <span className="italic font-newsreader text-lg leading-none -ml-1 text-accent/30">:)</span>
        </p>
        <div className="mt-8">
          <LocalizedClientLink href="/store" className="inline-block px-12 py-5 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-accent/90 transition-all duration-300 shadow-lg">
            Continue shopping
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}

export default OrderOverview
