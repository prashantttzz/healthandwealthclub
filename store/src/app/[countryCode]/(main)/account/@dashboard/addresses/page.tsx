import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"

export const metadata: Metadata = {
  title: "Addresses",
  description: "View your addresses",
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-12 flex flex-col gap-y-3 text-left">
        <h1 className="font-newsreader italic text-5xl lg:text-6xl text-accent tracking-tighter leading-tight">My Sanctuaries.</h1>
        <div className="flex flex-col gap-1">
          <span className="font-manrope text-[11px] uppercase font-bold tracking-[0.4em] text-accent/30">Your Shipping Destinations</span>
          <p className="font-manrope text-[14px] text-accent/60 max-w-xl leading-relaxed">
            Curate your delivery locations for a seamless movement of artifacts between the Club and your residence.
          </p>
        </div>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
