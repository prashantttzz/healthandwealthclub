"use client"

import React, { useState, useEffect, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"
import { Check, X, Plus, ChevronRight, ChevronLeft, Home, MoreHorizontal, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { clx, toast } from "@medusajs/ui"
import { Country, City } from "country-state-city"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import SearchableSelect from "@modules/common/components/searchable-select"

/* ─── SHARED ICONS (subset for sidebar) ─── */
const Ico = {
  check: (c = "") => <Check className={c} strokeWidth={3} />,
  x: (c = "") => <X className={c} strokeWidth={2} />,
  plus: (c = "") => <Plus className={c} strokeWidth={2.5}  />,
  chevRight: (c = "") => <ChevronRight className={c} strokeWidth={2} />,
  chevLeft: (c = "") => <ChevronLeft className={c} strokeWidth={2} />,
  home: (c = "") => <Home className={c} strokeWidth={1.5} />,
  dots: (c = "") => <MoreHorizontal className={c} />,
}



interface AddressSidebarProps {
  isOpen: boolean
  onClose: () => void
  addresses: HttpTypes.StoreCustomerAddress[]
  onSelect?: (a: HttpTypes.StoreCustomerAddress) => void
  onDelete?: (id: string) => void
  addressToEdit?: HttpTypes.StoreCustomerAddress | null
}

const AddressSidebar: React.FC<AddressSidebarProps> = ({ 
  isOpen, 
  onClose, 
  addresses, 
  onSelect, 
  onDelete,
  addressToEdit 
}) => {
  const [view, setView] = useState<"list" | "form">("list")
  const [formData, setFormData] = useState({ 
    first_name: "", 
    last_name: "", 
    phone: "", 
    address_1: "", 
    address_2: "", 
    city: "", 
    province: "", 
    postal_code: "", 
    country_code: "AE", 
    address_name: "Home" 
  })
  const [isSaving, setIsSaving] = useState(false)

  // Sync formData when addressToEdit changes or view changes
  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        first_name: addressToEdit.first_name || "",
        last_name: addressToEdit.last_name || "",
        phone: addressToEdit.phone || "",
        address_1: addressToEdit.address_1 || "",
        address_2: addressToEdit.address_2 || "",
        city: addressToEdit.city || "",
        province: addressToEdit.province || "",
        postal_code: addressToEdit.postal_code || "",
        country_code: addressToEdit.country_code?.toUpperCase() || "AE",
        address_name: "Home" 
      })
      setView("form")
    } else {
      setFormData({
        first_name: "", 
        last_name: "", 
        phone: "", 
        address_1: "", 
        address_2: "", 
        city: "", 
        province: "", 
        postal_code: "", 
        country_code: "AE", 
        address_name: "Home"
      })
      if (addresses.length > 0 && onSelect) {
         setView("list")
      } else {
         setView("form")
      }
    }
  }, [addressToEdit, isOpen, addresses.length, onSelect])

  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map(c => ({
      value: c.isoCode,
      label: c.name
    }))
  }, [])

  const cityOptions = useMemo(() => {
    if (!formData.country_code) return []
    return City.getCitiesOfCountry(formData.country_code)?.map(c => ({
      value: c.name,
      label: c.name
    })) || []
  }, [formData.country_code])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData((p: any) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      toast.error("Please enter a valid phone number")
      return
    }

    setIsSaving(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => {
        fd.append(k, v)
    })
    
    try {
      let res
      if (addressToEdit) {
        res = await updateCustomerAddress({ addressId: addressToEdit.id }, fd)
      } else {
        res = await addCustomerAddress({}, fd)
      }
      
      if (res.success || (res as any).id) {
        toast.success(addressToEdit ? "Address updated" : "Address added")
        
        // If it was a new address and we have an onSelect, pick it immediately
        if (!addressToEdit && res.address && onSelect) {
          onSelect(res.address)
        }
        
        onClose()
      } else {
        toast.error(res.error || "Failed to save address")
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <div className={`fixed inset-0 bg-black/30 z-[100] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-[460px] bg-bg z-[110] shadow-2xl flex flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-accent/5">
          <h2 className="font-newsreader italic text-2xl text-accent">
            {view === "list" ? "Select From Saved Addresses" : addressToEdit ? "Edit Address" : "Add New Address"}
          </h2>
          <button onClick={onClose} className="p-2 text-accent/30 hover:text-accent transition-colors">{Ico.x("w-5 h-5")}</button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {view === "list" ? (
            <>
              <button onClick={() => setView("form")} className="w-full flex items-center justify-between p-6 bg-accent/[0.03] border border-accent/10 mb-8 hover:bg-accent/[0.06] transition-colors group">
                <span className="text-accent font-manrope text-[13px] font-bold flex items-center gap-3 uppercase tracking-widest">{Ico.plus("w-4 h-4 text-accent")} Add New Address</span>
                {Ico.chevRight("w-4 h-4 text-accent/30 group-hover:translate-x-0.5 transition-transform")}
              </button>
              <div className="flex items-center gap-4 mb-8"><div className="flex-1 h-px bg-accent/5" /><span className="font-manrope text-[11px] text-accent/20 uppercase tracking-widest">or</span><div className="flex-1 h-px bg-accent/5" /></div>
              <p className="font-manrope text-[12px] font-bold text-accent/30 uppercase tracking-[0.2em] mb-5">Saved Addresses</p>
              {addresses.length === 0 ? (
                <p className="font-newsreader italic text-lg text-accent/20 text-center py-16">No saved addresses yet</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {addresses.map((addr) => (
                    <button key={addr.id} onClick={() => { onSelect?.(addr); onClose() }} className="w-full text-left p-6 border border-accent/5 hover:border-accent/20 transition-all group bg-bg">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 mb-2">{Ico.home("w-4 h-4 text-accent/30")}<span className="font-manrope text-[15px] font-bold text-accent">{addr.first_name}&apos;s Home</span>{addr.is_default_shipping && <span className="font-manrope text-[9px] bg-accent/5 text-accent/50 px-2 py-0.5 uppercase tracking-widest font-bold">Default</span>}</div>
                        <button onClick={(e) => { e.stopPropagation(); onDelete?.(addr.id) }} className="p-1.5 text-accent/15 hover:text-red-500 transition-colors">{Ico.dots("w-4 h-4")}</button>
                      </div>
                      <p className="font-manrope text-[13px] text-accent/40 leading-relaxed pl-8">{addr.address_1}{addr.city ? `, ${addr.city}` : ""} {addr.postal_code}{addr.phone ? ` , ${addr.phone}` : ""}</p>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-5">
              {(addresses.length > 0 && onSelect) && (
                <button onClick={() => setView("list")} className="flex items-center gap-2 text-accent font-manrope text-[12px] font-bold uppercase tracking-widest mb-4">{Ico.chevLeft("w-4 h-4")} Back to list</button>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Full Name</label>
                <input name="first_name" value={formData.first_name} onChange={handleChange} className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Phone Number</label>
                <div className="phone-input-container">
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(v) => setFormData((p: any) => ({ ...p, phone: v || "" }))}
                    defaultCountry="AE"
                    className="custom-phone-input"
                  />
                </div>
              </div>

              <SearchableSelect 
                label="Country" 
                value={formData.country_code} 
                options={countryOptions} 
                onChange={(v) => {
                  setFormData((p: any) => ({ 
                    ...p, 
                    country_code: v,
                    city: "" // Reset city when country changes
                  }))
                }} 
              />

              <SearchableSelect 
                label="City" 
                value={formData.city} 
                options={cityOptions} 
                onChange={(v) => {
                  setFormData((p: any) => ({ 
                    ...p, 
                    city: v
                  }))
                }}
                placeholder={formData.country_code ? "Select City..." : "Select Country First"}
              />

              {[
                { n: "address_1", l: "Address Line 1" }, { n: "address_2", l: "Address Line 2" },
                { n: "province", l: "State" }, { n: "postal_code", l: "Zipcode" },
              ].map((f) => (
                <div key={f.n} className="flex flex-col gap-2">
                  <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">{f.l}</label>
                  <input name={f.n} value={(formData as any)[f.n]} onChange={handleChange} className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
                </div>
              ))}
              <div className="flex gap-2 mt-2">
                {["Home", "Work", "Other"].map((t) => (
                  <button key={t} onClick={() => setFormData((p: any) => ({ ...p, address_name: t }))} className={`px-5 py-3 font-manrope text-[11px] font-bold uppercase tracking-widest border transition-all ${formData.address_name === t ? "bg-accent text-bg border-accent" : "bg-transparent text-accent/40 border-accent/10 hover:border-accent/30"}`}>{t}</button>
                ))}
              </div>
              <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="w-full py-4 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase mt-4 hover:bg-accent/90 transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : addressToEdit ? "Update Address" : "Save Address"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AddressSidebar
