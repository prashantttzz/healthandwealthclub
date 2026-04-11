"use client"

import { HttpTypes } from "@medusajs/types"
import React, { useActionState, useEffect, useRef, useState } from "react"
import { updateCustomer } from "@lib/data/customer"

const PersonalInformationComponent = ({ customer }: { customer: HttpTypes.StoreCustomer }) => {
  const [successState, setSuccessState] = useState(false)

  const updateProfile = async (
    _currentState: Record<string, unknown> | null,
    formData: FormData
  ) => {
    const payload = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone: formData.get("phone") as string,
      // Pass gender to metadata if supported by update backend
      metadata: {
        gender: formData.get("metadata.gender") as string,
      }
    }

    try {
      await updateCustomer(payload)
      return { success: true, error: null }
    } catch (error: any) {
      return { success: false, error: error.toString() }
    }
  }

  const [state, formAction, isPending] = useActionState(updateProfile, {
    success: false,
    error: null
  })

  const clearState = () => {
    setSuccessState(false)
  }

  useEffect(() => {
    setSuccessState(state.success)
    if (state.success) {
      setTimeout(() => setSuccessState(false), 3000)
    }
  }, [state])

  // Map metadata gender if available
  const currentGender = (customer.metadata?.gender as string) || "Female" // Defaulting or empty

  return (
    <div className="w-full max-w-3xl font-manrope space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 border-b border-accent/5 pb-8">
        <h1 className="font-newsreader italic text-4xl text-accent">Personal Information</h1>
        <p className="text-[13px] text-accent/50 tracking-wide font-medium">Update your profile details and membership settings.</p>
      </div>
      
      <form action={formAction} className="flex flex-col gap-6" onReset={clearState}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold tracking-wide text-accent">First Name *</label>
            <input 
              name="first_name" 
              required
              defaultValue={customer.first_name || ""}
              className="w-full h-14 px-4 bg-transparent border border-accent/10 text-[14px] text-accent outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold tracking-wide text-accent">Last Name *</label>
            <input 
              name="last_name" 
              required
              defaultValue={customer.last_name || ""}
              className="w-full h-14 px-4 bg-transparent border border-accent/10 text-[14px] text-accent outline-none focus:border-accent/50 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold tracking-wide text-accent">Email *</label>
          <input 
            disabled // Often email cannot be easily changed in generic setups without full verification loop, but letting it render disabled for visual matching, or open. Let's make it visually match.
            name="email" 
            readOnly
            defaultValue={customer.email || ""}
            className="w-full h-14 px-4 bg-accent/5 border border-transparent text-[14px] text-accent/60 outline-none cursor-not-allowed"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold tracking-wide text-accent">Phone *</label>
          <input 
            name="phone" 
            defaultValue={customer.phone || ""}
            className="w-full h-14 px-4 bg-transparent border border-accent/10 text-[14px] text-accent outline-none focus:border-accent/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[12px] font-bold tracking-wide text-accent">Gender *</label>
          <div className="relative">
            <select 
              name="metadata.gender" // Using dot notation for metadata, though Medusa standard action might not parse it automatically. I will pass it as a regular field and ignore it for now, or use a custom action.
              defaultValue={currentGender}
              className="w-full h-14 pl-4 pr-10 bg-transparent border border-accent/10 text-[14px] text-accent outline-none focus:border-accent/50 transition-colors appearance-none"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {state.error && typeof state.error === "string" && (
           <p className="text-red-500 text-sm">{state.error}</p>
        )}
        {successState && (
           <p className="text-green-600 text-[12px] italic tracking-wide">Successfully updated your information.</p>
        )}

        <div className="pt-4">
          <button 
            type="submit"
            disabled={isPending}
            className="px-10 py-4 bg-[#3d2f20] text-[#fbf8f1] font-bold text-[14px] transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Updating..." : "Update Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PersonalInformationComponent
