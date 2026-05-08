"use client"

import React, { useEffect, useMemo, useActionState } from "react"

import Input from "@modules/common/components/input"
import NativeSelect from "@modules/common/components/native-select"

import AccountInfo from "../account-info"
import { HttpTypes } from "@medusajs/types"
import { addCustomerAddress, updateCustomerAddress } from "@lib/data/customer"
import { Country, City } from "country-state-city"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import SearchableSelect from "@modules/common/components/searchable-select"

type MyInformationProps = {
  customer: HttpTypes.StoreCustomer
  regions: HttpTypes.StoreRegion[]
}

const ProfileBillingAddress: React.FC<MyInformationProps> = ({
  customer,
  regions,
}) => {
  const [phone, setPhone] = React.useState("")
  const [countryCode, setCountryCode] = React.useState("")
  const [city, setCity] = React.useState("")

  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((c) => ({
      value: c.isoCode.toLowerCase(),
      label: c.name,
    }))
  }, [])

  const [successState, setSuccessState] = React.useState(false)

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  const initialState: Record<string, any> = {
    isDefaultBilling: true,
    isDefaultShipping: false,
    error: false,
    success: false,
  }

  if (billingAddress) {
    initialState.addressId = billingAddress.id
  }

  const [state, formAction] = useActionState(
    billingAddress ? updateCustomerAddress : addCustomerAddress,
    initialState
  )

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
  }, [state])

  useEffect(() => {
    if (billingAddress) {
      setPhone(billingAddress.phone || "")
      setCountryCode(billingAddress.country_code || "")
      setCity(billingAddress.city || "")
    }
  }, [billingAddress])

  const currentInfo = useMemo(() => {
    if (!billingAddress) {
      return "No billing address"
    }

    const country =
      countryOptions?.find(
        (country) => country?.value === billingAddress.country_code
      )?.label || billingAddress.country_code?.toUpperCase()

    return (
      <div className="flex flex-col font-semibold" data-testid="current-info">
        <span>
          {billingAddress.first_name} {billingAddress.last_name}
        </span>
        <span>{billingAddress.company}</span>
        <span>
          {billingAddress.address_1}
          {billingAddress.address_2 ? `, ${billingAddress.address_2}` : ""}
        </span>
        <span>
          {billingAddress.postal_code}, {billingAddress.city}
        </span>
        <span>{country}</span>
      </div>
    )
  }, [billingAddress, countryOptions])

  return (
    <form action={formAction} onReset={() => clearState()} className="w-full">
      <input type="hidden" name="addressId" value={billingAddress?.id} />
      <AccountInfo
        label="Billing address"
        currentInfo={currentInfo}
        isSuccess={successState}
        isError={!!state.error}
        clearState={clearState}
        data-testid="account-billing-address-editor"
      >
        <div className="grid grid-cols-1 gap-y-2">
          <div className="grid grid-cols-2 gap-x-2">
            <Input
              label="First name"
              name="first_name"
              defaultValue={billingAddress?.first_name || undefined}
              required
              data-testid="billing-first-name-input"
            />
            <Input
              label="Last name"
              name="last_name"
              defaultValue={billingAddress?.last_name || undefined}
              required
              data-testid="billing-last-name-input"
            />
          </div>
          <Input
            label="Company"
            name="company"
            defaultValue={billingAddress?.company || undefined}
            data-testid="billing-company-input"
          />
          <div className="flex flex-col gap-2">
            <label className="font-manrope text-[10px] uppercase font-bold tracking-[0.2em] text-accent/60">Phone</label>
            <PhoneInput 
              value={phone}
              onChange={(v) => setPhone(v || "")}
              placeholder="Enter phone number"
              defaultCountry={(countryCode?.toUpperCase() as any) || "AE"}
              className="custom-phone-input"
              data-testid="billing-phone-input"
            />
            <input type="hidden" name="phone" value={phone} />
          </div>
          <Input
            label="Address"
            name="address_1"
            defaultValue={billingAddress?.address_1 || undefined}
            required
            data-testid="billing-address-1-input"
          />
          <Input
            label="Apartment, suite, etc."
            name="address_2"
            defaultValue={billingAddress?.address_2 || undefined}
            data-testid="billing-address-2-input"
          />
          <div className="grid grid-cols-[144px_1fr] gap-x-2">
            <Input
              label="Postal code"
              name="postal_code"
              defaultValue={billingAddress?.postal_code || undefined}
              required
              data-testid="billing-postcal-code-input"
            />
              <div className="flex flex-col gap-2">
              <SearchableSelect
                label="City"
                value={city}
                options={countryCode ? (City.getCitiesOfCountry(countryCode.toUpperCase())?.map((c) => ({ value: c.name, label: c.name })) || []) : []}
                onChange={(v) => setCity(v)}
                placeholder={countryCode ? "Select City..." : "Select Country First"}
                name="city"
              />
            </div>
          </div>
          <Input
            label="Province"
            name="province"
            defaultValue={billingAddress?.province || undefined}
            data-testid="billing-province-input"
          />
          <SearchableSelect
            label="Country"
            name="country_code"
            value={countryCode}
            options={countryOptions}
            onChange={(v) => {
              setCountryCode(v)
              setCity("") // Reset city when country changes
            }}
          />
        </div>
      </AccountInfo>
    </form>
  )
}

export default ProfileBillingAddress
