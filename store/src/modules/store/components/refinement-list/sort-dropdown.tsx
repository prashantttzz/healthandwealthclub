"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low to High",
  },
  {
    value: "price_desc",
    label: "Price: High to Low",
  },
]

const SortDropdown = ({ sortBy }: { sortBy?: string }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentOption = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0]

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleSelect = (value: string) => {
    const query = createQueryString("sortBy", value)
    router.push(`${pathname}?${query}`, { scroll: false })
    setIsOpen(false)
  }

  // Close when clicking outside
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
    <div className="hidden lg:flex relative items-center gap-4 self-end md:self-center" ref={dropdownRef}>
      <span className="text-[11px] uppercase tracking-[0.em] font-bold text-accent/60">Sort by</span>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 px-4 py-2.5 bg-accent/5 border border-black/5 rounded-lg text-[11px] font-bold text-accent hover:bg-accent hover:text-bg transition-all duration-300 min-w-[180px] justify-between group"
      >
        <span>{currentOption.label}</span>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <ChevronDown className="w-4 h-4 opacity-40 group-hover:opacity-100" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 p-1.5 bg-bg border border-black/5 rounded-xl shadow-2xl z-[100] min-w-[200px]"
          >
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full text-left px-4 py-3 text-[11px] uppercase font-regular rounded-lg transition-all ${
                  sortBy === option.value 
                    ? "bg-accent text-bg font-bold" 
                    : "text-accent/60 hover:bg-accent/5"
                }`}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SortDropdown
