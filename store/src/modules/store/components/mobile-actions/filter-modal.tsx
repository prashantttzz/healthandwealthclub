"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2 } from "lucide-react"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { HttpTypes } from "@medusajs/types"

type FilterModalProps = {
  categories?: HttpTypes.StoreProductCategory[]
  activeCategory?: string
  activeSize?: string
  activeColor?: string
  onClose: () => void
}

const FilterModal = ({ 
  categories: medusaCategories, 
  activeCategory, 
  activeSize, 
  activeColor, 
  onClose 
}: FilterModalProps) => {
  const [activeTab, setActiveTab] = useState("Category")
  const [isPending, startTransition] = useTransition()
  
  // Local state for "staged" filters
  const [localCategory, setLocalCategory] = useState<string | undefined>(activeCategory)
  const [localSizes, setLocalSizes] = useState<string[]>(activeSize?.split(",").filter(Boolean) || [])
  const [localColors, setLocalColors] = useState<string[]>(activeColor?.split(",").filter(Boolean) || [])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tabs = ["Category", "Size", "Palette"]

  const sizes = ["XS", "S", "M", "L", "XL", "2XL"]
  const palette = [
    { name: "Olive Green", hex: "#3E4437" },
    { name: "Cream White", hex: "#F8F6F1" },
    { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Royal Navy", hex: "#1a1f2c" },
    { name: "Sunshine Yellow", hex: "#F9D71C" },
  ]

  const handleToggle = (name: string, value: string) => {
    if (name === "size") {
      setLocalSizes(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      )
    } else if (name === "color") {
      setLocalColors(prev => 
        prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      )
    }
  }

  const handleCategorySelect = (categoryHandle: string) => {
    setLocalCategory(prev => prev === categoryHandle ? undefined : categoryHandle)
  }

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Apply local category
    if (localCategory) {
      params.set("category", localCategory)
    } else {
      params.delete("category")
    }

    // Apply local sizes
    if (localSizes.length > 0) {
      params.set("size", localSizes.join(","))
    } else {
      params.delete("size")
    }

    // Apply local colors
    if (localColors.length > 0) {
      params.set("color", localColors.join(","))
    } else {
      params.delete("color")
    }

    params.delete("page")
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
      onClose()
    })
  }

  // Close modal when transition finishes
  if (!isPending && isPending !== undefined && activeCategory === localCategory) {
     // This logic is a bit tricky, let's just close inside handleApply or use an effect.
  }

  const handleClearAllLocal = () => {
    setLocalCategory(undefined)
    setLocalSizes([])
    setLocalColors([])
  }

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 bg-bg z-[200] flex flex-col pt-safe"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 shrink-0 relative">
        <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-accent">Filters</h3>
        
        <AnimatePresence>
          {isPending && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg/60 backdrop-blur-[2px] flex items-center justify-center z-50"
            >
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={handleClearAllLocal}
          className="text-[10px] uppercase font-bold tracking-widest text-[#FF3F6C]"
        >
          Clear All
        </button>
      </div>

      {/* Main Content (Two Columns) */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left column (Tabs) */}
        <div className="w-[120px] bg-black/5 flex flex-col shrink-0 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-5 text-left text-[11px] uppercase tracking-widest font-bold transition-all relative ${
                activeTab === tab ? "bg-bg text-accent" : "text-accent/40"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF3F6C]" />
              )}
            </button>
          ))}
        </div>

        {/* Right column (Options) */}
        <div className="flex-1 bg-bg p-8 overflow-y-auto">
          {activeTab === "Category" && (
            <ul className="space-y-6">
              <li 
                onClick={() => setLocalCategory(undefined)}
                className="flex items-center gap-4 text-[12px] uppercase tracking-widest text-accent/80 font-medium cursor-pointer"
              >
                <div className="w-4 h-4 border border-black/10 rounded-sm flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-[1px] bg-accent transition-opacity ${!localCategory ? "opacity-100" : "opacity-0"}`} />
                </div>
                <span>All Products</span>
              </li>
              {medusaCategories?.map((cat) => (
                <li 
                  key={cat.id} 
                  onClick={() => handleCategorySelect(cat.handle)}
                  className="flex items-center gap-4 text-[12px] uppercase tracking-widest text-accent/80 font-medium cursor-pointer"
                >
                  <div className="w-4 h-4 border border-black/10 rounded-sm flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-[1px] bg-accent transition-opacity ${localCategory === cat.handle ? "opacity-100" : "opacity-0"}`} />
                  </div>
                  <span>{cat.name}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "Size" && (
            <div className="grid grid-cols-2 gap-3">
              {sizes.map((size) => (
                <button 
                  key={size} 
                  onClick={() => handleToggle("size", size)}
                  className={`flex items-center justify-center border aspect-square text-[12px] font-bold transition-all rounded-md ${
                    localSizes.includes(size) ? "bg-accent border-accent text-bg" : "border-black/10 text-accent opacity-60"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

          {activeTab === "Palette" && (
            <ul className="space-y-6">
              {palette.map((color) => (
                <li 
                  key={color.name} 
                  onClick={() => handleToggle("color", color.name)}
                  className="flex items-center gap-4 text-[12px] uppercase tracking-widest text-accent/80 font-medium cursor-pointer"
                >
                  <div 
                    className={`w-8 h-8 rounded-full border transition-all ${
                      localColors.includes(color.name) ? "border-accent ring-2 ring-accent ring-offset-2" : "border-black/10"
                    }`} 
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex border-t border-black/10 shrink-0 h-[70px]">
        <button 
          onClick={onClose}
          className="flex-1 flex items-center justify-center text-[12px] uppercase tracking-[0.2em] font-bold text-accent border-r border-black/5 hover:bg-black/5"
        >
          Close
        </button>
        <button 
          onClick={handleApply}
          disabled={isPending}
          className="flex-1 flex items-center justify-center text-[12px] uppercase tracking-[0.2em] font-bold text-[#FF3F6C] hover:bg-black/5 disabled:opacity-50"
        >
          {isPending ? "Applying..." : "Apply"}
        </button>
      </div>
    </motion.div>
  )
}

export default FilterModal
