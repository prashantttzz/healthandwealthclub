"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"

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
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tabs = ["Category", "Size", "Palette"]

  const sizes = ["DX", "S", "M", "L", "XL"]
  const palette = [
    { name: "Olive Green", hex: "#3E4437" },
    { name: "Cream White", hex: "#F8F6F1" },
    { name: "Black", hex: "#1a1a1a" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Royal Navy", hex: "#1a1f2c" },
    { name: "Sunshine Yellow", hex: "#F9D71C" },
  ]

  const selectedSizes = activeSize?.split(",") || []
  const selectedColors = activeColor?.split(",") || []

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
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const handleCategorySelect = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get("category") === categoryId) {
       params.delete("category")
    } else {
       params.set("category", categoryId)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }


  const handleApply = () => {
    // Logic to apply all accumulated filters from a local state if implemented, 
    // or just close since current components (PriceRange) might update URL directly.
    onClose()
  }

  const handleClearAll = () => {
    router.push(pathname)
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-black/5 shrink-0">
        <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-accent">Filters</h3>
        <button 
          onClick={handleClearAll}
          className="text-[10px] uppercase font-bold tracking-widest text-[#FF3F6C]" // Myntra-like accent color for Clear All
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
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString())
                  params.delete("category")
                  params.delete("page")
                  router.push(`${pathname}?${params.toString()}`, { scroll: false })
                }}
                className="flex items-center gap-4 text-[12px] uppercase tracking-widest text-accent/80 font-medium cursor-pointer"
              >
                <div className="w-4 h-4 border border-black/10 rounded-sm flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-[1px] bg-accent transition-opacity ${!activeCategory ? "opacity-100" : "opacity-0"}`} />
                </div>
                <span>All Products</span>
              </li>
              {medusaCategories?.map((cat) => (
                <li 
                  key={cat.id} 
                  onClick={() => handleCategorySelect(cat.id)}
                  className="flex items-center gap-4 text-[12px] uppercase tracking-widest text-accent/80 font-medium cursor-pointer"
                >
                  <div className="w-4 h-4 border border-black/10 rounded-sm flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-[1px] bg-accent transition-opacity ${activeCategory === cat.id ? "opacity-100" : "opacity-0"}`} />
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
                    selectedSizes.includes(size) ? "bg-accent border-accent text-bg" : "border-black/10 text-accent opacity-60"
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
                      selectedColors.includes(color.name) ? "border-accent ring-2 ring-accent ring-offset-2" : "border-black/10"
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
          className="flex-1 flex items-center justify-center text-[12px] uppercase tracking-[0.2em] font-bold text-[#FF3F6C] hover:bg-black/5"
        >
          Apply
        </button>
      </div>
    </motion.div>
  )
}

export default FilterModal
