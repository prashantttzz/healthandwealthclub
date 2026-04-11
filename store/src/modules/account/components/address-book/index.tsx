"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Home, Pencil, Trash2, Plus, ChevronRight } from "lucide-react"
import AddressSidebar from "@modules/checkout/components/address-sidebar"
import { deleteCustomerAddress } from "@lib/data/customer"

type AddressBookProps = {
  customer: HttpTypes.StoreCustomer
  region: HttpTypes.StoreRegion
}

const AddressBook: React.FC<AddressBookProps> = ({ customer, region }) => {
  const { addresses } = customer
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [addressToEdit, setAddressToEdit] = useState<HttpTypes.StoreCustomerAddress | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleEdit = (address: HttpTypes.StoreCustomerAddress) => {
    setAddressToEdit(address)
    setSidebarOpen(true)
  }

  const handleAdd = () => {
    setAddressToEdit(null)
    setSidebarOpen(true)
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(id)
    try {
      await deleteCustomerAddress(id)
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="w-full flex flex-col gap-16 md:mt-10">
      {/* Add New Address Trigger */}
      <div className="flex flex-col gap-6">
        <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em]">Add New Address</h3>
        <button
          className="w-full flex items-center justify-between p-6 border border-accent/10 text-accent/40 hover:text-accent hover:border-accent/30 hover:bg-black/[0.02] transition-all duration-300 bg-black/[0.04] lg:bg-black/[0.02] shadow-sm group min-h-[80px]"
          onClick={handleAdd}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-accent/10 flex items-center justify-center rounded-full bg-bg shadow-sm group-hover:bg-accent group-hover:text-bg transition-colors">
              <Plus className="w-5 h-5" strokeWidth={1.5} />
            </div>
            <span className="font-manrope text-[13px] font-bold uppercase tracking-[0.2em]">Add New Address</span>
          </div>
          <ChevronRight className="w-4 h-4 text-accent/20 group-hover:text-accent transition-colors" strokeWidth={2} />
        </button>
      </div>

      {/* Saved Addresses List */}
      <div className="flex flex-col gap-8">
        <h3 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em]">Saved Addresses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="bg-secondary border border-accent/10 p-6 min-h-[180px] h-full w-full flex flex-col justify-between transition-all duration-500 shadow-inner group relative overflow-hidden"
            >
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-accent/10 flex items-center justify-center rounded-full bg-bg shadow-sm">
                    <Home className="w-5 h-5 text-accent/30" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-manrope text-[15px] font-bold text-accent">
                        {address.first_name}&apos;s Home
                      </span>
                      {address.is_default_shipping && (
                        <span className="font-manrope text-[9px] bg-accent/5 text-accent/50 px-2 py-0.5 uppercase tracking-widest font-bold">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-0.5 font-manrope text-[13px] text-accent/40 leading-relaxed">
                      <p>{address.address_1} {address.address_2 && `, ${address.address_2}`}</p>
                      <p>{address.postal_code}, {address.city}</p>
                      <p>{address.province && `${address.province}, `}{address.country_code?.toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 text-accent/30 hover:text-accent transition-colors"
                    title="Edit Address"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 text-accent/30 hover:text-red-500 transition-colors"
                    title="Remove Address"
                  >
                    {isDeleting === address.id ? (
                      <div className="w-4 h-4 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {addresses.length === 0 && (
          <div className="text-center py-20 border border-accent/5 bg-black/[0.02]">
             <p className="font-newsreader italic text-3xl text-accent/20">No saved addresses yet</p>
          </div>
        )}
      </div>

      {/* Shared Sidebar */}
      <AddressSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        addresses={addresses}
        addressToEdit={addressToEdit}
      />
    </div>
  )
}

export default AddressBook
