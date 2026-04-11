import { Metadata } from "next"

import Overview from "@modules/account/components/overview"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "Account",
  description: "Overview of your account activity.",
}

export const dynamic = "force-dynamic"

export default async function OverviewTemplate(props: {
  params: Promise<{ countryCode: string }>
}) {
  const [customer, orders] = await Promise.all([
    retrieveCustomer().catch(() => null),
    listOrders().catch(() => null),
  ])

  if (!customer) {
    notFound()
  }

  return <Overview customer={customer} orders={orders} />
}
