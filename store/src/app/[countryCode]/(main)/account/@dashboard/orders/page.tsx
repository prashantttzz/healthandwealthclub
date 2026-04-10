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

export default async function Orders() {
  const orders = await listOrders()

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full font-manrope" data-testid="orders-page-wrapper">
      <div className="mb-10 flex flex-col gap-y-2">
        <h1 className="text-3xl font-newsreader italic text-accent">Order Status</h1>
      </div>
      <div>
        <OrderOverview orders={orders} />
      </div>
    </div>
  )
}
