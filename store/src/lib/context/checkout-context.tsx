"use client"

import React, { createContext, useContext, useState, useMemo } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

type CheckoutStep = "bag" | "address" | "delivery" | "payment" | "review"

interface CheckoutContextType {
  currentStep: CheckoutStep
  isSubmitting: boolean
  setIsSubmitting: (loading: boolean) => void
  goToStep: (step: CheckoutStep) => void
  goBack: () => void
  canContinue: boolean
  setCanContinue: (can: boolean) => void
  onSubmit: (() => void) | null
  setOnSubmit: (fn: (() => void) | null) => void
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

export const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [canContinue, setCanContinue] = useState(true)
  const [onSubmit, setOnSubmit] = useState<(() => void) | null>(null)

  const currentStep = (searchParams.get("step") as CheckoutStep) || "bag"

  const goToStep = (step: CheckoutStep) => {
    router.push(`${pathname}?step=${step}`, { scroll: true })
  }

  const goBack = () => {
    const steps: CheckoutStep[] = ["bag", "address", "delivery", "payment", "review"]
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      goToStep(steps[currentIndex - 1])
    } else {
      router.push("/cart")
    }
  }

  const value = useMemo(() => ({
    currentStep,
    isSubmitting,
    setIsSubmitting,
    goToStep,
    goBack,
    canContinue,
    setCanContinue,
    onSubmit,
    setOnSubmit
  }), [currentStep, isSubmitting, canContinue, onSubmit])

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  )
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext)
  if (!context) {
    throw new Error("useCheckout must be used within a CheckoutProvider")
  }
  return context
}
