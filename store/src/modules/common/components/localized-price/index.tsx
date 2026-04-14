"use client"

import { useCurrencyFormatter } from "@lib/currency"
import { clx } from "@medusajs/ui"
import React from "react"

interface LocalizedPriceProps {
  amount: number
  className?: string
  "data-testid"?: string
}

const LocalizedPrice: React.FC<LocalizedPriceProps> = ({ 
  amount, 
  className, 
  "data-testid": testId 
}) => {
  const { formatPrice } = useCurrencyFormatter()
   console.log("amount",amount)
  return (
    <span className={clx(className)} data-testid={testId}>
      {formatPrice(amount)}
    </span>
  )
}

export default LocalizedPrice
