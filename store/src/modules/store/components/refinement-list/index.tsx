"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

import SortProducts, { SortOptions } from "./sort-products"
import PriceRange from "./price-range"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  'data-testid'?: string
}

const FilterAccordion = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="border-b border-black/5 last:border-0 pb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 text-[11px] uppercase font-bold tracking-[0.2em] text-accent/80 hover:text-accent transition-colors"
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

const RefinementList = ({ sortBy, 'data-testid': dataTestId }: RefinementListProps) => {
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

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="hidden lg:flex flex-col w-full font-manrope ">
            <FilterAccordion  title="Category">
        <ul className="space-y-4">
          {["All Products", "Outerwear", "Knitwear", "The Club Set", "Track Assets"].map((cat) => (
            <li key={cat} className="flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-accent/60 group cursor-pointer hover:text-accent transition-all">
              <div className="w-4 h-4 border border-black/10 rounded-sm flex items-center justify-center group-hover:border-accent transition-colors">
                <div className={`w-2 h-2 rounded-[1px] bg-accent transition-opacity ${cat === "All Products" ? "opacity-100" : "opacity-0"}`} />
              </div>
              <span className="text-accent/70">{cat}</span>
              <span className="ml-auto text-accent/80 text-[9px] font-bold">
                {Math.floor(Math.random() * 20) + 1}
              </span>
            </li>
          ))}
        </ul>
      </FilterAccordion>
      <FilterAccordion title="Price">
        <PriceRange />
      </FilterAccordion>

      {/* Size Accordion */}
      <FilterAccordion title="Size">
        <div className="grid grid-cols-5 gap-2">
          {["DX", "S", "M", "L", "XL"].map((size) => (
            <button key={size} className={`flex items-center justify-center border aspect-square text-[10px] font-bold tracking-tighter transition-all ${size === "S" ? "bg-accent border-accent text-bg" : "border-black/10 text-accent/60 hover:border-accent hover:text-accent"}`}>
              {size}
            </button>
          ))}
        </div>
      </FilterAccordion>
      {/* Tonal Palette Accordion */}
      <FilterAccordion title="Palette">
        <div className="flex flex-wrap gap-4">
          {[
            { name: "Olive", class: "bg-[#424B35]" },
            { name: "Bone", class: "bg-[#F2EDE5]" },
            { name: "Black", class: "bg-black" },
          ].map((color) => (
            <div 
              key={color.name} 
              className={`w-6 h-6 rounded-full border border-black/5 cursor-pointer hover:scale-110 transition-transform ${color.class}`} 
              title={color.name}
            />
          ))}
        </div>
      </FilterAccordion>

    </div>
  )
}

export default RefinementList
