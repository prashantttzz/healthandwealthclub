import { HttpTypes } from "@medusajs/types"
import { Container } from "@medusajs/ui"
import Checkbox from "@modules/common/components/checkbox"
import Input from "@modules/common/components/input"
import { mapKeys } from "lodash"
import React, { useEffect, useMemo, useState } from "react"
import AddressSelect from "../address-select"
import CountrySelect from "../country-select"
import { City } from "country-state-city"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import NativeSelect from "@modules/common/components/native-select"
import SearchableSelect from "@modules/common/components/searchable-select"
import { Country } from "country-state-city"

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
}: {
  customer: HttpTypes.StoreCustomer | null
  cart: HttpTypes.StoreCart | null
  checked: boolean
  onChange: () => void
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({
    "shipping_address.first_name": cart?.shipping_address?.first_name || "",
    "shipping_address.last_name": cart?.shipping_address?.last_name || "",
    "shipping_address.address_1": cart?.shipping_address?.address_1 || "",
    "shipping_address.company": cart?.shipping_address?.company || "",
    "shipping_address.postal_code": cart?.shipping_address?.postal_code || "",
    "shipping_address.city": cart?.shipping_address?.city || "",
    "shipping_address.country_code": cart?.shipping_address?.country_code || "ae",
    "shipping_address.province": cart?.shipping_address?.province || "",
    "shipping_address.phone": cart?.shipping_address?.phone || "",
    email: cart?.email || "",
  })

  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      value: country.isoCode.toLowerCase(),
      label: country.name,
    }))
  }, [])

  const cityOptions = useMemo(() => {
    const cc = formData["shipping_address.country_code"]
    if (!cc) return []
    return City.getCitiesOfCountry(cc.toUpperCase())?.map((c) => ({
      value: c.name,
      label: c.name,
    })) || []
  }, [formData["shipping_address.country_code"]])

  const addressesInRegion = useMemo(
    () => customer?.addresses || [],
    [customer?.addresses]
  )

  const setFormAddress = (
    address?: HttpTypes.StoreCartAddress,
    email?: string
  ) => {
    address &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        "shipping_address.first_name": address?.first_name || "",
        "shipping_address.last_name": address?.last_name || "",
        "shipping_address.address_1": address?.address_1 || "",
        "shipping_address.company": address?.company || "",
        "shipping_address.postal_code": address?.postal_code || "",
        "shipping_address.city": address?.city || "",
        "shipping_address.country_code": address?.country_code || "",
        "shipping_address.province": address?.province || "",
        "shipping_address.phone": address?.phone || "",
      }))

    email &&
      setFormData((prevState: Record<string, any>) => ({
        ...prevState,
        email: email,
      }))
  }

  useEffect(() => {
    // Ensure cart is not null and has a shipping_address before setting form data
    if (cart && cart.shipping_address) {
      setFormAddress(cart?.shipping_address, cart?.email)
    }

    if (cart && !cart.email && customer?.email) {
      setFormAddress(undefined, customer.email)
    }
  }, [cart]) // Add cart as a dependency

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
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {`Hi ${customer.first_name}, do you want to use one of your saved addresses?`}
          </p>
          <AddressSelect
            addresses={customer.addresses}
            addressInput={
              mapKeys(formData, (_, key) =>
                key.replace("shipping_address.", "")
              ) as HttpTypes.StoreCartAddress
            }
            onSelect={setFormAddress}
          />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-x-8 gap-y-10">
        <Input
          label="First name"
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData["shipping_address.first_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label="Last name"
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData["shipping_address.last_name"]}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
        <div className="col-span-2">
          <Input
            label="Street Address"
            name="shipping_address.address_1"
            autoComplete="address-line1"
            value={formData["shipping_address.address_1"]}
            onChange={handleChange}
            required
            data-testid="shipping-address-input"
          />
        </div>
        <Input
          label="Company"
          name="shipping_address.company"
          value={formData["shipping_address.company"]}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="shipping-company-input"
        />
        <Input
          label="Postal code"
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData["shipping_address.postal_code"]}
          onChange={handleChange}
          required
          data-testid="shipping-postal-code-input"
        />
        <div className="flex flex-col gap-2">
          <SearchableSelect
            label="City"
            name="shipping_address.city"
            value={formData["shipping_address.city"]}
            options={cityOptions}
            onChange={(v) => setFormData(p => ({ ...p, "shipping_address.city": v }))}
            placeholder={formData["shipping_address.country_code"] ? "Select City..." : "Select Country First"}
          />
        </div>
        <SearchableSelect
          label="Country"
          name="shipping_address.country_code"
          value={formData["shipping_address.country_code"]}
          options={countryOptions}
          onChange={(v) => {
            setFormData(p => ({ 
              ...p, 
              "shipping_address.country_code": v,
              "shipping_address.city": "" 
            }))
          }}
        />
        <div className="col-span-2 grid grid-cols-2 gap-x-8 gap-y-10 mt-4 border-t border-black/5 pt-10">
          <Input
            label="Email Address"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            data-testid="shipping-email-input"
          />
          <div className="flex flex-col gap-2">
            <label className="font-manrope text-[10px] uppercase font-bold tracking-[0.2em] text-accent/60">Phone Number</label>
            <PhoneInput 
              value={formData["shipping_address.phone"]}
              onChange={(v) => setFormData((p: any) => ({ ...p, "shipping_address.phone": v || "" }))}
              placeholder="Enter phone number"
              defaultCountry={(formData["shipping_address.country_code"]?.toUpperCase() as any) || "AE"}
              className="custom-phone-input"
              data-testid="shipping-phone-input"
            />
          </div>
        </div>
      </div>
      <div className="my-10">
        <Checkbox
          label="Billing address same as shipping address"
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
          className="font-manrope text-[11px] uppercase tracking-widest text-accent/60"
        />
        {customer && (
          <Checkbox
            label="Save address to my profile"
            name="save_address"
            data-testid="save-address-checkbox"
            className="font-manrope text-[11px] uppercase tracking-widest text-accent/60 mt-4"
          />
        )}
      </div>
    </>
  )
}

export default ShippingAddress
