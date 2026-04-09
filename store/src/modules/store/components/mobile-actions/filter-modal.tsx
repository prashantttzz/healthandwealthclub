"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import PriceRange from "../refinement-list/price-range"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type FilterModalProps = {
  onClose: () => void
}

const FilterModal = ({ onClose }: FilterModalProps) => {
  const [activeTab, setActiveTab] = useState("Category")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const tabs = ["Category", "Price", "Size", "Palette"]

  const categories = ["All Products", "Outerwear", "Knitwear", "The Club Set", "Track Assets"]
  const sizes = ["DX", "S", "M", "L", "XL"]
  const colors = [
    { name: "Olive", class: "bg-[#424B35]" },
    { name: "Bone", class: "bg-[#F2EDE5]" },
    { name: "Black", class: "bg-black" },
  ]

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
      <div className="flex flex-1 overflow-hidden">
        {/* Left column (Tabs) */}
        <div className="w-[120px] bg-black/5 flex flex-col shrink-0 h-full overflow-y-auto">
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
        <div className="flex-1 bg-bg p-8 overflow-y-auto h-full">
          {activeTab === "Category" && (
            <ul className="space-y-6">
              {categories.map((cat) => (
                <li key={cat} className="flex items-center gap-4 text-[12px] uppercase tracking-widest text-accent/80 font-medium cursor-pointer">
                  <div className="w-4 h-4 border border-black/10 rounded-sm flex items-center justify-center">
                    {/* Placeholder for selection logic */}
                    <div className="w-2 h-2 rounded-[1px] bg-accent opacity-0" />
                  </div>
                  <span>{cat}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === "Price" && (
            <div className="pt-4">
              <PriceRange />
            </div>
          )}

          {activeTab === "Size" && (
            <div className="grid grid-cols-2 gap-3">
              {sizes.map((size) => (
                <button key={size} className="flex items-center justify-center border border-black/10 aspect-square text-[12px] font-bold text-accent opacity-60 rounded-md">
                  {size}
                </button>
              ))}
            </div>
          )}

          {activeTab === "Palette" && (
            <ul className="space-y-6">
              {colors.map((color) => (
                <li key={color.name} className="flex items-center gap-4 text-[12px] uppercase tracking-widest text-accent/80 font-medium">
                  <div className={`w-8 h-8 rounded-full border border-black/10 ${color.class}`} />
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
