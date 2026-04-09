"use client"

import { Minus, Plus } from "lucide-react"
import Spinner from "@modules/common/icons/spinner"

type QuantitySelectorProps = {
  quantity: number
  onChange: (value: number) => void
  maxQuantity?: number
  loading?: boolean
}

const QuantitySelector = ({ quantity, onChange, maxQuantity = 10, loading }: QuantitySelectorProps) => {
  const handleDecrement = () => {
    if (quantity >= 1) {
      onChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-black/10 h-8 px-1 group hover:border-accent transition-colors duration-300 bg-transparent rounded-none">
        <button
          onClick={handleDecrement}
          disabled={loading}
          className="w-6 h-6 flex items-center justify-center text-accent/40 hover:text-accent disabled:opacity-20 transition-colors"
        >
          <Minus className="w-2.5 h-2.5" strokeWidth={3} />
        </button>
        
        <div className="w-6 text-center font-manrope text-[11px] font-bold text-accent">
          {loading ? (
             <div className="flex justify-center"><Spinner className="w-3 h-3" /></div>
          ) : (
            quantity
          )}
        </div>

        <button
          onClick={handleIncrement}
          disabled={quantity >= maxQuantity || loading}
          className="w-6 h-6 flex items-center justify-center text-accent/40 hover:text-accent disabled:opacity-20 transition-colors"
        >
          <Plus className="w-2.5 h-2.5" strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector
