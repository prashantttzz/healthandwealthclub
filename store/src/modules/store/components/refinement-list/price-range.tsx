"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const PriceRange = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [min, setMin] = useState<string>(searchParams.get("minPrice") || "0")
  const [max, setMax] = useState<string>(searchParams.get("maxPrice") || "5000")

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(paramsToUpdate).forEach(([name, value]) => {
        if (value) {
          params.set(name, value)
        } else {
          params.delete(name)
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  const handleApply = () => {
    const query = createQueryString({ minPrice: min, maxPrice: max })
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="space-y-6">
      <h4 className="text-[10px] tracking-[0.4em] uppercase font-bold text-accent/60 mb-6">
        Price Bracket
      </h4>
      
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-accent/40 block">From</span>
          <input 
            type="number" 
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="w-full bg-transparent border border-black/10 px-3 py-2 text-[11px] font-manrope outline-none focus:border-accent/40 transition-colors"
          />
        </div>
        <div className="flex-1 space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-accent/40 block">To</span>
          <input 
            type="number" 
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="w-full bg-transparent border border-black/10 px-3 py-2 text-[11px] font-manrope outline-none focus:border-accent/40 transition-colors"
          />
        </div>
      </div>

      <button 
        onClick={handleApply}
        className="w-full py-3 bg-accent text-bg text-[10px] uppercase font-bold tracking-[.3em] hover:bg-accent/90 transition-all"
      >
        Apply Filter
      </button>
    </div>
  )
}

export default PriceRange
