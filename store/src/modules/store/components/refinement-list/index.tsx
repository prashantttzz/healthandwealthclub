"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"


import { SortOptions } from "./sort-dropdown"

import { HttpTypes } from "@medusajs/types"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  categories?: HttpTypes.StoreProductCategory[]
  activeCategory?: string
  activeSize?: string
  activeColor?: string
  'data-testid'?: string
}

const FilterAccordion = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-black/5 last:border-0 pb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-[11px] uppercase font-bold tracking-[0.2em] text-accent hover:text-accent transition-colors"
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown className="w-4 h-4 text-accent/30" strokeWidth={3} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2 pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const RefinementList = ({ 
  sortBy, 
  categories, 
  activeCategory, 
  activeSize, 
  activeColor, 
  'data-testid': dataTestId 
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleToggle = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.get(name)?.split(",") || []

    if (currentValues.includes(value)) {
      const newValues = currentValues.filter((v) => v !== value)
      if (newValues.length > 0) {
        params.set(name, newValues.join(","))
      } else {
        params.delete(name)
      }
    } else {
      currentValues.push(value)
      params.set(name, currentValues.join(","))
    }

    // Reset pagination when filtering
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCategorySelect = (categoryHandle: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get("category") === categoryHandle) {
       params.delete("category") // allow deselect
    } else {
       params.set("category", categoryHandle)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const selectedSizes = activeSize?.split(",") || []
  const selectedColors = activeColor?.split(",") || []

  return (
    <div className="hidden lg:flex flex-col w-full font-manrope  bg-secondary p-5 py-3">
        <FilterAccordion title="Category">
        <ul className="space-y-4">
          <li 
            onClick={() => {
               const params = new URLSearchParams(searchParams.toString())
               params.delete("category")
               params.delete("page")
               router.push(`${pathname}?${params.toString()}`)
            }} 
            className="flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-accent/60 group cursor-pointer hover:text-accent transition-all"
          >
            <div className="w-4 h-4 border border-black/10 rounded-sm flex items-center justify-center group-hover:border-accent transition-colors">
              <div className={`w-2 h-2 rounded-[1px] bg-accent transition-opacity ${!activeCategory ? "opacity-100" : "opacity-0"}`} />
            </div>
            <span className="text-accent/70 lowercase">All Products</span>
          </li>
          {categories?.map((cat) => (
            <li 
              key={cat.id} 
              onClick={() => handleCategorySelect(cat.handle)}
              className="flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-accent/60 group cursor-pointer hover:text-accent transition-all"
            >
              <div className="w-4 h-4 border border-black/10 rounded-sm flex items-center justify-center group-hover:border-accent transition-colors">
                <div className={`w-2 h-2 rounded-[1px] bg-accent transition-opacity ${activeCategory === cat.handle ? "opacity-100" : "opacity-0"}`} />
              </div>
              <span className="text-accent/70 lowercase">{cat.name}</span>
            </li>
          ))}
        </ul>
      </FilterAccordion>


      {/* Size Accordion */}
      <FilterAccordion title="Size">
        <div className="grid grid-cols-5 gap-2">
          {["DX", "S", "M", "L", "XL"].map((size) => (
            <button 
              key={size} 
              onClick={() => handleToggle("size", size)}
              className={`flex items-center justify-center border aspect-square text-[10px] font-bold tracking-tighter transition-all ${selectedSizes.includes(size) ? "bg-accent border-accent text-bg" : "border-black/10 text-accent/60 hover:border-accent hover:text-accent"}`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterAccordion>
      {/* Tonal Palette Accordion */}
      <FilterAccordion title="Palette">
        <div className="flex flex-wrap gap-4">
          {[
            { name: "Olive Green", hex: "#3E4437" },
            { name: "Cream White", hex: "#F8F6F1" },
            { name: "Black", hex: "#1a1a1a" },
            { name: "White", hex: "#FFFFFF" },
            { name: "Royal Navy", hex: "#1a1f2c" },
            { name: "Sunshine Yellow", hex: "#F9D71C" },
          ].map((color) => (
            <div 
              key={color.name} 
              onClick={() => handleToggle("color", color.name)}
              className={`w-8 h-8 rounded-md border cursor-pointer hover:scale-110 transition-transform ${selectedColors.includes(color.name) ? "border-2 border-accent/80 scale-110 shadow-sm" : "border-black/10"}`} 
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </FilterAccordion>

    </div>
  )
}

export default RefinementList
