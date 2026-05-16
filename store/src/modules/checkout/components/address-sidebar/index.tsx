"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"
import { X, Plus, ChevronRight, ChevronLeft, Home, MoreHorizontal, MapPin } from "lucide-react"
import { toast } from "@medusajs/ui"
import { Country, City, State } from "country-state-city"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"

/* ─── SHARED ICONS ─── */
const Ico = {
  x: (c = "") => <X className={c} strokeWidth={2} />,
  plus: (c = "") => <Plus className={c} strokeWidth={2.5}  />,
  chevRight: (c = "") => <ChevronRight className={c} strokeWidth={2} />,
  chevLeft: (c = "") => <ChevronLeft className={c} strokeWidth={2} />,
  home: (c = "") => <Home className={c} strokeWidth={1.5} />,
  dots: (c = "") => <MoreHorizontal className={c} />,
  pin: (c = "") => <MapPin className={c} strokeWidth={1.5} />,
}

/* ─── Country flag emoji helper ─── */
const getCountryFlag = (code: string) => {
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

interface AddressSidebarProps {
  isOpen: boolean
  onClose: () => void
  addresses: HttpTypes.StoreCustomerAddress[]
  onSelect?: (a: HttpTypes.StoreCustomerAddress) => void
  onDelete?: (id: string) => void
  countryCode: string
}

const AddressSidebar: React.FC<AddressSidebarProps> = ({ 
  isOpen, 
  onClose, 
  addresses, 
  onSelect, 
  onDelete,
  countryCode
}) => {
  const lockedCountryCode = countryCode.toUpperCase()
  const countryInfo = useMemo(() => Country.getCountryByCode(lockedCountryCode), [lockedCountryCode])
  const countryName = countryInfo?.name || lockedCountryCode

  const [view, setView] = useState<"list" | "form">("list")
  const [editingAddress, setEditingAddress] = useState<HttpTypes.StoreCustomerAddress | null>(null)
  const [formData, setFormData] = useState({ 
    first_name: "", 
    last_name: "", 
    phone: "", 
    address_1: "", 
    address_2: "", 
    city: "", 
    province: "", 
    postal_code: "", 
    country_code: lockedCountryCode, 
    address_name: "Home" 
  })
  const [citySearch, setCitySearch] = useState("")
  const [showCitySuggestions, setShowCitySuggestions] = useState(false)
  const cityInputRef = useRef<HTMLInputElement>(null)
  const citySuggestionsRef = useRef<HTMLDivElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Reset view and state when sidebar is opened
  useEffect(() => {
    if (isOpen) {
      setEditingAddress(null)
      setCitySearch("")
      setShowCitySuggestions(false)
      if (addresses.length > 0) {
        setView("list")
      } else {
        setView("form")
      }
      // Reset form with locked country
      setFormData({
        first_name: "", last_name: "", phone: "", 
        address_1: "", address_2: "", city: "", 
        province: "", postal_code: "", 
        country_code: lockedCountryCode, 
        address_name: "Home"
      })
    }
  }, [isOpen, addresses.length, lockedCountryCode])

  // Sync formData when editingAddress changes
  useEffect(() => {
    if (editingAddress) {
      setFormData({
        first_name: editingAddress.first_name || "",
        last_name: editingAddress.last_name || "",
        phone: editingAddress.phone || "",
        address_1: editingAddress.address_1 || "",
        address_2: editingAddress.address_2 || "",
        city: editingAddress.city || "",
        province: editingAddress.province || "",
        postal_code: editingAddress.postal_code || "",
        country_code: lockedCountryCode,
        address_name: "Home" 
      })
      setCitySearch(editingAddress.city || "")
      setView("form")
    }
  }, [editingAddress, lockedCountryCode])

  // State/Province options from country-state-city
  const stateOptions = useMemo(() => {
    return State.getStatesOfCountry(lockedCountryCode)?.map(s => ({
      value: s.name,
      label: s.name,
      isoCode: s.isoCode
    })) || []
  }, [lockedCountryCode])

  // City suggestions - from the library + allow free text
  const allCities = useMemo(() => {
    // Get cities for country
    const countryCities = City.getCitiesOfCountry(lockedCountryCode) || []
    // Also get cities for selected state if any
    const selectedState = stateOptions.find(s => s.value === formData.province)
    let stateCities: any[] = []
    if (selectedState) {
      stateCities = City.getCitiesOfState(lockedCountryCode, selectedState.isoCode) || []
    }
    
    // Combine and deduplicate
    const allNames = new Set<string>()
    const result: { name: string }[] = []
    
    // Prioritize state cities first
    for (const c of stateCities) {
      if (!allNames.has(c.name.toLowerCase())) {
        allNames.add(c.name.toLowerCase())
        result.push(c)
      }
    }
    for (const c of countryCities) {
      if (!allNames.has(c.name.toLowerCase())) {
        allNames.add(c.name.toLowerCase())
        result.push(c)
      }
    }
    
    return result
  }, [lockedCountryCode, formData.province, stateOptions])

  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return allCities.slice(0, 50)
    const q = citySearch.toLowerCase()
    return allCities
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 50)
  }, [allCities, citySearch])

  // Close city suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        citySuggestionsRef.current && 
        !citySuggestionsRef.current.contains(e.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(e.target as Node)
      ) {
        setShowCitySuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData((p: any) => ({ ...p, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      toast.error("Please enter a valid phone number")
      return
    }
    if (!formData.first_name.trim()) {
      toast.error("Please enter your full name")
      return
    }
    if (!formData.address_1.trim()) {
      toast.error("Please enter your street address")
      return
    }
    if (!formData.city.trim()) {
      toast.error("Please enter your city")
      return
    }

    setIsSaving(true)
    const fd = new FormData()
    // Send country_code in lowercase as Medusa expects it
    const dataToSend = { ...formData, country_code: formData.country_code.toLowerCase() }
    Object.entries(dataToSend).forEach(([k, v]) => {
      fd.append(k, v)
    })
    
    try {
      let res
      if (editingAddress) {
        res = await updateCustomerAddress({ addressId: editingAddress.id }, fd)
      } else {
        res = await addCustomerAddress({}, fd)
      }
      
      if (res.success || (res as any).id) {
        toast.success(editingAddress ? "Address updated" : "Address added")
        
        if (!editingAddress && res.address && onSelect) {
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

  const handleEdit = (addr: HttpTypes.StoreCustomerAddress) => {
    setEditingAddress(addr)
    setView("form")
  }

  const handleAddNew = () => {
    setEditingAddress(null)
    setFormData({
      first_name: "", last_name: "", phone: "", 
      address_1: "", address_2: "", city: "", 
      province: "", postal_code: "", 
      country_code: lockedCountryCode, 
      address_name: "Home"
    })
    setCitySearch("")
    setView("form")
  }

  const inputClass = "w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15"
  const labelClass = "font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]"

  return (
    <>
      <div className={`fixed inset-0 bg-black/30 z-[100] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-[460px] bg-bg z-[110] shadow-2xl flex flex-col overflow-hidden transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-accent/5">
          <h2 className="font-newsreader italic text-2xl text-accent">
            {view === "list" ? "Select From Saved Addresses" : editingAddress ? "Edit Address" : "Add New Address"}
          </h2>
          <button onClick={onClose} className="p-2 text-accent/30 hover:text-accent transition-colors">{Ico.x("w-5 h-5")}</button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {view === "list" ? (
            <>
              <button onClick={handleAddNew} className="w-full flex items-center justify-between p-6 bg-accent/[0.03] border border-accent/10 mb-8 hover:bg-accent/[0.06] transition-colors group">
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
                    <div key={addr.id} className="relative group">
                      <button onClick={() => { onSelect?.(addr); onClose() }} className="w-full text-left p-6 border border-accent/5 hover:border-accent/20 transition-all bg-bg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3 mb-2">{Ico.home("w-4 h-4 text-accent/30")}<span className="font-manrope text-[15px] font-bold text-accent">{addr.first_name}&apos;s Home</span>{addr.is_default_shipping && <span className="font-manrope text-[9px] bg-accent/5 text-accent/50 px-2 py-0.5 uppercase tracking-widest font-bold">Default</span>}</div>
                        </div>
                        <p className="font-manrope text-[13px] text-accent/40 leading-relaxed pl-8 pr-16">{addr.address_1}{addr.city ? `, ${addr.city}` : ""}{addr.province ? `, ${addr.province}` : ""} {addr.postal_code}{addr.phone ? ` · ${addr.phone}` : ""}</p>
                      </button>
                      <div className="absolute top-6 right-6 flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(addr) }} className="p-2 text-accent/20 hover:text-accent transition-colors font-manrope text-[10px] uppercase font-bold tracking-widest">Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-5">
              {(addresses.length > 0 && onSelect) && (
                <button onClick={() => setView("list")} className="flex items-center gap-2 text-accent font-manrope text-[12px] font-bold uppercase tracking-widest mb-4">{Ico.chevLeft("w-4 h-4")} Back to list</button>
              )}

              {/* Locked Country Display */}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Country</label>
                <div className="w-full h-12 px-4 bg-accent/[0.04] border border-accent/10 flex items-center gap-3 cursor-not-allowed">
                  <span className="text-2xl leading-none">{getCountryFlag(lockedCountryCode)}</span>
                  <span className="font-manrope text-[14px] text-accent font-medium">{countryName}</span>
                  <span className="ml-auto font-manrope text-[10px] text-accent/25 uppercase tracking-widest">Locked</span>
                </div>
              </div>
              
              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Full Name</label>
                <input name="first_name" placeholder="Enter your full name" value={formData.first_name} onChange={handleChange} className={inputClass} />
              </div>

              {/* Phone Number - pre-filled with country code */}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Phone Number</label>
                <div className="phone-input-container">
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(v) => setFormData((p: any) => ({ ...p, phone: v || "" }))}
                    defaultCountry={lockedCountryCode as any}
                    country={lockedCountryCode as any}
                    className="custom-phone-input"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Street Address / Building / Area</label>
                <input name="address_1" placeholder="e.g. Flat 204, Tower B, Business Bay" value={formData.address_1} onChange={handleChange} className={inputClass} />
              </div>

              {/* Address Line 2 */}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Landmark / Additional Info <span className="text-accent/20">(Optional)</span></label>
                <input name="address_2" placeholder="Near Metro Station, etc." value={formData.address_2} onChange={handleChange} className={inputClass} />
              </div>

              {/* State / Province */}
              {stateOptions.length > 0 ? (
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>{lockedCountryCode === "AE" ? "Emirate" : "State / Province"}</label>
                  <select 
                    value={formData.province} 
                    onChange={(e) => {
                      setFormData((p: any) => ({ ...p, province: e.target.value, city: "" }))
                      setCitySearch("")
                    }}
                    className={`${inputClass} appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23999%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_12px_center] bg-[length:16px] pr-10`}
                  >
                    <option value="">Select {lockedCountryCode === "AE" ? "Emirate" : "State"}...</option>
                    {stateOptions.map(s => (
                      <option key={s.isoCode} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>State / Province</label>
                  <input name="province" placeholder="Enter state or province" value={formData.province} onChange={handleChange} className={inputClass} />
                </div>
              )}

              {/* City - Searchable text input with suggestions */}
              <div className="flex flex-col gap-2 relative">
                <label className={labelClass}>City</label>
                <div className="relative">
                  {Ico.pin("w-4 h-4 text-accent/20 absolute left-4 top-1/2 -translate-y-1/2")}
                  <input 
                    ref={cityInputRef}
                    placeholder="Type your city name..."
                    value={citySearch || formData.city}
                    onChange={(e) => {
                      const val = e.target.value
                      setCitySearch(val)
                      setFormData((p: any) => ({ ...p, city: val }))
                      setShowCitySuggestions(true)
                    }}
                    onFocus={() => setShowCitySuggestions(true)}
                    className={`${inputClass} pl-10`}
                  />
                </div>
                {showCitySuggestions && filteredCities.length > 0 && (
                  <div 
                    ref={citySuggestionsRef}
                    className="absolute top-[calc(100%+4px)] left-0 w-full bg-bg border border-accent/10 shadow-2xl z-[130] max-h-[200px] overflow-y-auto custom-scrollbar"
                  >
                    {filteredCities.map((c, i) => (
                      <button 
                        key={`${c.name}-${i}`} 
                        type="button"
                        onClick={() => {
                          setFormData((p: any) => ({ ...p, city: c.name }))
                          setCitySearch(c.name)
                          setShowCitySuggestions(false)
                        }}
                        className={`w-full text-left px-4 py-3 font-manrope text-[13px] transition-colors border-b border-accent/5 last:border-none ${
                          formData.city.toLowerCase() === c.name.toLowerCase() 
                            ? "bg-accent text-bg" 
                            : "text-accent hover:bg-accent/[0.03]"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Postal / Zip Code */}
              <div className="flex flex-col gap-2">
                <label className={labelClass}>Postal / Zip Code</label>
                <input name="postal_code" placeholder="Enter postal code" value={formData.postal_code} onChange={handleChange} className={inputClass} />
              </div>

              {/* Address Type */}
              <div className="flex gap-2 mt-2">
                {["Home", "Work", "Other"].map((t) => (
                  <button key={t} onClick={() => setFormData((p: any) => ({ ...p, address_name: t }))} className={`px-5 py-3 font-manrope text-[11px] font-bold uppercase tracking-widest border transition-all ${formData.address_name === t ? "bg-accent text-bg border-accent" : "bg-transparent text-accent/40 border-accent/10 hover:border-accent/30"}`}>{t}</button>
                ))}
              </div>

              {/* Save Button */}
              <button 
                onClick={handleSave} 
                disabled={isSaving} 
                className="w-full py-4 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase mt-4 hover:bg-accent/90 transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AddressSidebar
