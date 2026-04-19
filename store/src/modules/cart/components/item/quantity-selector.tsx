"use client"

import { Minus, Plus } from "lucide-react"
import Spinner from "@modules/common/icons/spinner"
import { clx } from "@medusajs/ui"

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
    if (quantity < maxQuantity) {
      onChange(quantity + 1)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center border border-bg/10 h-10 px-1 group hover:border-bg/30 transition-colors duration-300 bg-transparent rounded-none relative">
        <button
          onClick={handleDecrement}
          disabled={loading || quantity <= 0}
          className={`w-8 h-8 flex items-center justify-center ${className} text-bg disabled:opacity-20 transition-all hover:bg-bg/5 active:scale-95`}
        >
          <Minus className="w-3 h-3" strokeWidth={2} />
        </button>
        
        <div className={`w-8 text-center font-manrope text-[12px] font-bold ${className} relative`}>
          <span className={clx("transition-opacity duration-200", { "opacity-0": false })}>
            {quantity}
          </span>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Subtle loading indicator if needed, but keeping quantity visible is better */}
            </div>
          )}
        </div>

        <button
          onClick={handleIncrement}
          disabled={loading || quantity >= maxQuantity}
          className={`w-8 h-8 flex items-center justify-center ${className} text-bg disabled:opacity-20 transition-all hover:bg-bg/5 active:scale-95`}
        >
          <Plus className="w-3 h-3" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}

export default QuantitySelector
