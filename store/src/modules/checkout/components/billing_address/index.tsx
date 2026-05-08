import { HttpTypes } from "@medusajs/types"
import Input from "@modules/common/components/input"
import React, { useState } from "react"
import CountrySelect from "../country-select"
import { City, Country } from "country-state-city"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import NativeSelect from "@modules/common/components/native-select"
import SearchableSelect from "@modules/common/components/searchable-select"

const BillingAddress = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const [formData, setFormData] = useState<any>({
    "billing_address.first_name": cart?.billing_address?.first_name || "",
    "billing_address.last_name": cart?.billing_address?.last_name || "",
    "billing_address.address_1": cart?.billing_address?.address_1 || "",
    "billing_address.company": cart?.billing_address?.company || "",
    "billing_address.postal_code": cart?.billing_address?.postal_code || "",
    "billing_address.city": cart?.billing_address?.city || "",
    "billing_address.country_code": cart?.billing_address?.country_code || "ae",
    "billing_address.province": cart?.billing_address?.province || "",
    "billing_address.phone": cart?.billing_address?.phone || "",
  })

  const countryOptions = React.useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      value: country.isoCode.toLowerCase(),
      label: country.name,
    }))
  }, [])

  const cityOptions = React.useMemo(() => {
    const cc = formData["billing_address.country_code"]
    if (!cc) return []
    return City.getCitiesOfCountry(cc.toUpperCase())?.map((c) => ({
      value: c.name,
      label: c.name,
    })) || []
  }, [formData["billing_address.country_code"]])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First name"
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData["billing_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
        />
        <Input
          label="Last name"
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData["billing_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
        />
        <Input
          label="Address"
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData["billing_address.address_1"]}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
        />
        <Input
          label="Company"
          name="billing_address.company"
          value={formData["billing_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="billing-company-input"
        />
        <Input
          label="Postal code"
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData["billing_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="billing-postal-input"
        />
        <div className="flex flex-col gap-2">
          <SearchableSelect
            label="City"
            name="billing_address.city"
            value={formData["billing_address.city"]}
            options={cityOptions}
            onChange={(v) => setFormData((p: any) => ({ ...p, "billing_address.city": v }))}
            placeholder={formData["billing_address.country_code"] ? "Select City..." : "Select Country First"}
          />
        </div>
        <SearchableSelect
          label="Country"
          name="billing_address.country_code"
          value={formData["billing_address.country_code"]}
          options={countryOptions}
          onChange={(v) => {
            setFormData((p: any) => ({ 
              ...p, 
              "billing_address.country_code": v,
              "billing_address.city": "" 
            }))
          }}
        />
        <Input
          label="State / Province"
          name="billing_address.province"
          autoComplete="address-level1"
          value={formData["billing_address.province"]}
          onChange={handleChange}
          data-testid="billing-province-input"
        />
        <div className="flex flex-col gap-2">
          <label className="font-manrope text-[10px] uppercase font-bold tracking-[0.2em] text-accent/60">Phone</label>
          <PhoneInput 
            value={formData["billing_address.phone"]}
            onChange={(v) => setFormData((p: any) => ({ ...p, "billing_address.phone": v || "" }))}
            placeholder="Enter phone number"
            defaultCountry={(formData["billing_address.country_code"]?.toUpperCase() as any) || "AE"}
            className="custom-phone-input"
            data-testid="billing-phone-input"
          />
        </div>
      </div>
    </>
  )
}

export default BillingAddress
