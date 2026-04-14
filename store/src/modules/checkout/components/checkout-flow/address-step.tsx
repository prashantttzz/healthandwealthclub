"use client"

import React, { useState, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { Home, Truck, Plus, ChevronRight } from "lucide-react"
import Thumbnail from "@modules/products/components/thumbnail"
import AddressSidebar from "../address-sidebar"
import { deleteCustomerAddress } from "@lib/data/customer"
import LocalizedPrice from "@modules/common/components/localized-price"

const Ico = {
  plus: (c = "") => <Plus className={c} strokeWidth={2.5}  />,
  chevRight: (c = "") => <ChevronRight className={c} strokeWidth={2} />,
  home: (c = "") => <Home className={c} strokeWidth={1.5} />,
  truck: (c = "") => <Truck className={c} strokeWidth={1.5} />,
}

const AddressStep = ({ cart, customer, selectedAddress, setSelectedAddress, shippingOptions, selectedShippingOptionId, setSelectedShippingOptionId, isLoadingShipping, recipientName, setRecipientName, recipientPhone, setRecipientPhone }: {
  cart: HttpTypes.StoreCart; 
  customer: HttpTypes.StoreCustomer | null
  selectedAddress: HttpTypes.StoreCustomerAddress | null; 
  setSelectedAddress: (a: HttpTypes.StoreCustomerAddress | null) => void; 
  onContinue: () => void;
  shippingOptions: HttpTypes.StoreCartShippingOption[];
  selectedShippingOptionId: string | null;
  setSelectedShippingOptionId: (id: string) => void;
  isLoadingShipping: boolean;
  recipientName: string;
  setRecipientName: (val: string) => void;
  recipientPhone: string;
  setRecipientPhone: (val: string) => void;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isGift, setIsGift] = useState(!!recipientName || !!recipientPhone)

  const deliveryOptions = useMemo(() => {
    return shippingOptions.map(opt => ({
      id: opt.id,
      label: opt.name,
      amount: opt.amount,
      enabled: true
    }))
  }, [shippingOptions])

  const addressesInRegion = useMemo(() => {
    const countriesInRegion = cart?.region?.countries?.map((c) => c.iso_2?.toLowerCase()) || []
    return customer?.addresses.filter(
      (a) => a.country_code && countriesInRegion.includes(a.country_code.toLowerCase())
    ) || []
  }, [customer?.addresses, cart?.region])
  return (
    <div className="flex flex-col gap-14 mb-20 md:mt-0">
      {/* Delivery Address */}
      <div className="w-full">
        <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em] mb-6">Delivery Address</h3>
        {selectedAddress ? (
          <div className="flex items-start justify-between p-6 border border-accent/10 bg-secondary shadow-inner">
            <div className="flex items-start gap-4">
              {Ico.home("w-5 h-5 text-accent/30 mt-0.5 flex-shrink-0")}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-manrope text-[15px] font-bold text-accent">{selectedAddress.first_name}&apos;s Home</span>
                  {selectedAddress.is_default_shipping && <span className="font-manrope text-[9px] bg-accent/5 text-accent/50 px-2 py-0.5 uppercase tracking-widest font-bold">Default</span>}
                </div>
                <p className="font-manrope text-[13px] text-accent/40 leading-relaxed">{selectedAddress.address_1}{selectedAddress.city ? `, ${selectedAddress.city}` : ""} {selectedAddress.postal_code}</p>
                <p className="font-manrope text-[12px] text-accent/20 mt-2 italic">Standard Phone: {selectedAddress.phone}</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="px-5 py-3 border border-accent/10 font-manrope text-[11px] font-bold text-accent uppercase tracking-widest hover:border-accent hover:bg-accent hover:text-bg transition-all duration-300 flex-shrink-0">Change Address</button>
          </div>
        ) : (
          <button onClick={() => setSidebarOpen(true)} className="w-full flex items-center justify-between p-5 border border-accent/10 text-accent/50 hover:border-accent/30 hover:bg-black/[0.02] transition-all duration-300 bg-black/[0.04] lg:bg-black/[0.02] shadow-sm">
            <div className="flex items-center gap-4">
              {Ico.plus("w-5 h-5")}
              <span className="font-manrope text-[13px] font-bold uppercase tracking-widest">Add New Address</span>
            </div>
            {Ico.chevRight("w-4 h-4")}
          </button>
        )}

        {/* Gifting Details Form */}
        {selectedAddress && (
          <div className="mt-8 border border-accent/10 bg-black/[0.02] p-8">
            <label className="flex items-center gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={isGift} 
                onChange={(e) => setIsGift(e.target.checked)}
                className="w-5 h-5 rounded-none border-accent/20 text-accent focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer"
              />
              <div>
                <span className="font-newsreader italic text-xl text-accent block">Is this a gift?</span>
                <span className="font-manrope text-[11px] text-accent/30 uppercase tracking-widest font-bold">Add recipient name and phone number</span>
              </div>
            </label>

            {isGift && (
              <div className="mt-8 pt-8 border-t border-accent/5 grid md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-500">
                <div className="flex flex-col gap-3">
                  <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Recipient Name</label>
                  <input 
                    value={recipientName} 
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full h-12 px-4 bg-bg border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" 
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Recipient Phone</label>
                  <input 
                    value={recipientPhone} 
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    placeholder="+971 00 000 0000"
                    className="w-full h-12 px-4 bg-bg border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" 
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delivery Options */}
      <div>
        <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em] mb-6">Delivery Options</h3>
        <div className="flex flex-col gap-3">
          {isLoadingShipping ? (
             <div className="py-12 flex flex-col items-center justify-center border border-accent/5 bg-secondary/20">
                <div className="w-6 h-6 border-2 border-accent border-t-transparent animate-spin rounded-full mb-3" />
                <span className="font-manrope text-[10px] uppercase font-bold tracking-widest text-accent/30">Fetching Options...</span>
             </div>
          ) : deliveryOptions.length === 0 ? (
            <div className="p-6 border border-accent/10 bg-black/[0.02] text-center">
               <p className="font-newsreader italic text-lg text-accent/30">Please provide a valid address to see shipping options</p>
            </div>
          ) : (
            deliveryOptions.map((opt) => {
              const sel = selectedShippingOptionId === opt.id
              return (
                <button key={opt.id} disabled={!opt.enabled} onClick={() => opt.enabled && setSelectedShippingOptionId(opt.id)}
                  className={`w-full flex items-center justify-between p-6 border text-left transition-all duration-300
                    ${sel ? "border-accent/10 bg-secondary shadow-inner translate-y-[1px]" : "bg-transparent border-accent/5 hover:border-accent/10 hover:bg-secondary/30"}
                    ${!opt.enabled ? "opacity-30 cursor-not-allowed border-accent/5" : "cursor-pointer"}`}>
                  <div className="flex items-center gap-5">
                    <div className={`transition-colors duration-300 ${sel ? "text-accent" : "text-accent/20"}`}>
                      {Ico.truck("w-6 h-6")}
                    </div>
                    <div>
                      <p className={`font-manrope text-[15px] font-bold transition-colors duration-300 ${sel ? "text-accent" : "text-accent/40"}`}>{opt.label}</p>
                      <p className={`font-manrope text-[12px] transition-colors duration-300 ${sel ? "text-accent/60" : "text-accent/20"} mt-0.5`}>
                        {opt.amount === 0 ? "Free Shipping" : <LocalizedPrice amount={opt.amount} />}
                      </p>
                    </div>
                  </div>
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${sel ? "border-accent bg-accent" : "border-accent/10"}`}>
                    {sel && <div className="w-1.5 h-1.5 rounded-full bg-bg" />}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Delivery Estimates */}
      {selectedAddress && cart.items?.[0] && (
        <div>
          <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em] mb-6">Delivery Estimates</h3>
          <div className="flex items-center gap-5 p-6 bg-black/[0.04] lg:bg-black/[0.02] border border-accent/5 shadow-sm">
            <div className="w-14 h-16 bg-accent/[0.02] overflow-hidden flex-shrink-0"><Thumbnail thumbnail={cart.items[0].thumbnail} size="square" /></div>
            <div>
              <p className="font-manrope text-[14px] font-bold text-accent">{cart.items[0].product_title}</p>
              <p className="font-manrope text-[12px] text-accent/40 mt-0.5">Estimated Delivery: <span className="font-bold text-accent/70">{new Date(Date.now() + 5 * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></p>
            </div>
          </div>
        </div>
      )}

      <AddressSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        addresses={addressesInRegion} 
        onSelect={setSelectedAddress} 
        onDelete={async (id) => { try { await deleteCustomerAddress(id) } catch {} }} 
        countries={cart?.region?.countries}
      />
    </div>
  )
}

export default AddressStep
