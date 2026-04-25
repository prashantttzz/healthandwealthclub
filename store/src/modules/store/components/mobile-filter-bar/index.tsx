"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Filter } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

const HeaderDropdown = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 text-[10px] uppercase font-bold tracking-widest border transition-all duration-300 ${
          isOpen ? "bg-accent text-bg border-accent" : "bg-bg text-accent border-black/5"
        }`}
      >
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 mt-2 p-6 bg-bg border border-black/10 shadow-2xl z-[150] min-w-[300px]"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MobileFilterBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams)
    if (cat === "All Products") {
        params.delete("category")
    } else {
        params.set("category", cat)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="lg:hidden flex flex-col gap-4 mb-8">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-black/5">
          <Filter className="w-3 h-3 text-accent/40" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent/40">Filters</span>
        </div>
        
        <HeaderDropdown title="Category">
          <ul className="space-y-4">
            {["All Products", "Outerwear", "Knitwear", "City Reach Set", "Track Assets"].map((cat) => (
               <li 
                 key={cat} 
                 onClick={() => setCategory(cat)}
                 className="text-[11px] uppercase tracking-widest text-accent/60 hover:text-accent cursor-pointer"
               >
                 {cat}
               </li>
            ))}
          </ul>
        </HeaderDropdown>

        <HeaderDropdown title="Size">
          <div className="grid grid-cols-4 gap-2 w-[240px]">
            {["DX", "S", "M", "L", "XL"].map((size) => (
              <button key={size} className="flex items-center justify-center border aspect-square text-[10px] font-bold text-accent/60 border-black/10 hover:border-accent hover:text-accent">
                {size}
              </button>
            ))}
          </div>
        </HeaderDropdown>
      </div>
    </div>
  )
}

export default MobileFilterBar
