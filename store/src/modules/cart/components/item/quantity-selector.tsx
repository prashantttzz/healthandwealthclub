"use client"

import { Minus, Plus } from "lucide-react"
import Spinner from "@modules/common/icons/spinner"

type QuantitySelectorProps = {
  quantity: number
  onChange: (value: number) => void
  maxQuantity?: number
  loading?: boolean
  className?:string
}

const QuantitySelector = ({ quantity, onChange, maxQuantity = 10, loading, className }: QuantitySelectorProps) => {
  const handleDecrement = () => {
    if (quantity >= 1) {
      onChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    onChange(quantity + 1)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-black/10 h-8 px-1 group hover:border-accent transition-colors duration-300 bg-transparent rounded-none">
        <button
          onClick={handleDecrement}
          disabled={loading}
          className={`w-6 h-6 flex items-center justify-center ${className} text-accent  disabled:opacity-20 transition-colors`}
        >
          <Minus className="w-2.5 h-2.5" strokeWidth={3} />
        </button>
        
        <div className={`w-6 text-center font-manrope text-[11px] font-bold ${className}`}>
          {loading ? (
             <div className="flex justify-center"><Spinner className="w-3 h-3 animate-spin" /></div>
          ) : (
            quantity
          )}
        </div>

        <button
          onClick={handleIncrement}
          disabled={loading}
          className={`w-6 h-6 flex items-center justify-center ${className} text-accent  disabled:opacity-20 transition-colors ${quantity >= maxQuantity ? "opacity-50 hover:opacity-100" : ""}`}
        >
          <Plus className="w-2.5 h-2.5" strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector
