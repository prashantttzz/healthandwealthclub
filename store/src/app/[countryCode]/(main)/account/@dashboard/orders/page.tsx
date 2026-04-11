import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"

export const metadata: Metadata = {
  title: "Orders",
  description: "Overview of your previous orders.",
}

export default async function Orders(props: {
  params: Promise<{ countryCode: string }>
}) {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full font-manrope" data-testid="orders-page-wrapper">
      <div className="mb-12 flex flex-col gap-y-3 text-left md:mt-10">
        <h1 className="font-newsreader italic text-5xl lg:text-6xl text-accent tracking-tighter leading-tight">The Archive.</h1>
        <div className="flex flex-col gap-1">
          <span className="font-manrope text-[11px] uppercase font-bold tracking-[0.4em] text-accent/30">Your Order History</span>
          <p className="font-manrope text-[14px] text-accent/60 max-w-xl leading-relaxed">
            Review the progress of your exceptional selections and track their journey to your threshold.
          </p>
        </div>
      </div>
      <div>
        <OrderOverview orders={orders} />
      </div>
    </div>
  )
}
