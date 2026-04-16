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
  const safeAmount = Number.isFinite(amount) ? amount : 0

  return (
    <span className={clx(className)} data-testid={testId}>
      {formatPrice(safeAmount)}
    </span>
  )
}

export default LocalizedPrice
