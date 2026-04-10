"use client"

import React, { useEffect, useState, useActionState } from "react"
import { PencilSquare as Edit, Trash } from "@medusajs/icons"
import { Button, Heading, Text, clx } from "@medusajs/ui"

import useToggleState from "@lib/hooks/use-toggle-state"
import CountrySelect from "@modules/checkout/components/country-select"
import Input from "@modules/common/components/input"
import Modal from "@modules/common/components/modal"
import Spinner from "@modules/common/icons/spinner"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import { HttpTypes } from "@medusajs/types"
import {
  deleteCustomerAddress,
  updateCustomerAddress,
} from "@lib/data/customer"

import { HugeiconsIcon } from "@hugeicons/react"
import { 
  PencilEdit02Icon, 
  Delete02Icon, 
  Location01Icon,
  Home01Icon,
  OfficeIcon
} from "@hugeicons/core-free-icons"

type EditAddressProps = {
  region: HttpTypes.StoreRegion
  address: HttpTypes.StoreCustomerAddress
  isActive?: boolean
}

const EditAddress: React.FC<EditAddressProps> = ({
  region,
  address,
  isActive = false,
}) => {
  const [removing, setRemoving] = useState(false)
  const [successState, setSuccessState] = useState(false)
  const { state, open, close: closeModal } = useToggleState(false)

  const [formState, formAction] = useActionState(updateCustomerAddress, {
    success: false,
    error: null,
    addressId: address.id,
  })

  const close = () => {
    setSuccessState(false)
    closeModal()
  }

  useEffect(() => {
    if (successState) {
      close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successState])

  useEffect(() => {
    if (formState.success) {
      setSuccessState(true)
    }
  }, [formState])

  const removeAddress = async () => {
    setRemoving(true)
    await deleteCustomerAddress(address.id)
    setRemoving(false)
  }

  return (
    <>
      <div
        className={clx(
          "bg-secondary/30 border border-accent/5 p-8 min-h-[220px] h-full w-full flex flex-col justify-between transition-all duration-500 hover:bg-white hover:border-accent/10 hover:shadow-2xl group relative overflow-hidden",
          {
            "border-accent/20 bg-white shadow-lg": isActive,
          }
        )}
        data-testid="address-container"
      >
        <div className="flex flex-col gap-4 relative z-10 text-left">
          <div className="flex justify-between items-start">
             <div className="w-10 h-10 bg-accent text-bg flex items-center justify-center rounded-full mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
               <HugeiconsIcon icon={Location01Icon} size={18} />
             </div>
             <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent/30">Primary</span>
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="font-newsreader italic text-2xl text-accent tracking-tighter" data-testid="address-name">
              {address.first_name} {address.last_name}
            </h3>
            {address.company && (
              <span className="font-manrope text-[11px] font-bold uppercase tracking-widest text-accent/50" data-testid="address-company">
                {address.company}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 font-manrope text-[13px] text-accent/60 leading-relaxed font-medium">
            <span data-testid="address-address">
              {address.address_1}
              {address.address_2 && <span>, {address.address_2}</span>}
            </span>
            <span data-testid="address-postal-city">
              {address.postal_code}, {address.city}
            </span>
            <span data-testid="address-province-country">
              {address.province && `${address.province}, `}
              {address.country_code?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-x-6 pt-6 border-t border-accent/5 relative z-10">
          <button
            className="text-[11px] font-bold uppercase tracking-widest text-accent hover:opacity-100 opacity-40 flex items-center gap-x-2 transition-all duration-300"
            onClick={open}
            data-testid="address-edit-button"
          >
            <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
            Edit
          </button>
          <button
            className="text-[11px] font-bold uppercase tracking-widest text-rose-600 hover:opacity-100 opacity-40 flex items-center gap-x-2 transition-all duration-300"
            onClick={removeAddress}
            data-testid="address-delete-button"
          >
            {removing ? <Spinner /> : <HugeiconsIcon icon={Delete02Icon} size={14} />}
            Remove
          </button>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] select-none pointer-events-none group-hover:opacity-[0.08] transition-opacity">
           <HugeiconsIcon icon={Home01Icon} size={80} />
        </div>
      </div>

      <Modal isOpen={state} close={close} data-testid="edit-address-modal">
        <Modal.Title>
          <Heading className="mb-2">Edit address</Heading>
        </Modal.Title>
        <form action={formAction}>
          <input type="hidden" name="addressId" value={address.id} />
          <Modal.Body>
            <div className="grid grid-cols-1 gap-y-2">
              <div className="grid grid-cols-2 gap-x-2">
                <Input
                  label="First name"
                  name="first_name"
                  required
                  autoComplete="given-name"
                  defaultValue={address.first_name || undefined}
                  data-testid="first-name-input"
                />
                <Input
                  label="Last name"
                  name="last_name"
                  required
                  autoComplete="family-name"
                  defaultValue={address.last_name || undefined}
                  data-testid="last-name-input"
                />
              </div>
              <Input
                label="Company"
                name="company"
                autoComplete="organization"
                defaultValue={address.company || undefined}
                data-testid="company-input"
              />
              <Input
                label="Address"
                name="address_1"
                required
                autoComplete="address-line1"
                defaultValue={address.address_1 || undefined}
                data-testid="address-1-input"
              />
              <Input
                label="Apartment, suite, etc."
                name="address_2"
                autoComplete="address-line2"
                defaultValue={address.address_2 || undefined}
                data-testid="address-2-input"
              />
              <div className="grid grid-cols-[144px_1fr] gap-x-2">
                <Input
                  label="Postal code"
                  name="postal_code"
                  required
                  autoComplete="postal-code"
                  defaultValue={address.postal_code || undefined}
                  data-testid="postal-code-input"
                />
                <Input
                  label="City"
                  name="city"
                  required
                  autoComplete="locality"
                  defaultValue={address.city || undefined}
                  data-testid="city-input"
                />
              </div>
              <Input
                label="Province / State"
                name="province"
                autoComplete="address-level1"
                defaultValue={address.province || undefined}
                data-testid="state-input"
              />
              <CountrySelect
                name="country_code"
                region={region}
                required
                autoComplete="country"
                defaultValue={address.country_code || undefined}
                data-testid="country-select"
              />
              <Input
                label="Phone"
                name="phone"
                autoComplete="phone"
                defaultValue={address.phone || undefined}
                data-testid="phone-input"
              />
            </div>
            {formState.error && (
              <div className="text-rose-500 text-small-regular py-2">
                {formState.error}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <div className="flex gap-3 mt-6">
              <Button
                type="reset"
                variant="secondary"
                onClick={close}
                className="h-10"
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              <SubmitButton data-testid="save-button">Save</SubmitButton>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  )
}

export default EditAddress
