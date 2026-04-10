"use client"

import { useState } from "react"
import { ArrowUpDown, ListFilter } from "lucide-react"
import { AnimatePresence } from "framer-motion"

import SortModal from "./sort-modal"
import FilterModal from "./filter-modal"

type MobileActionsProps = {
  sortBy: string
}

const MobileActions = ({ sortBy }: MobileActionsProps) => {
  const [showSort, setShowSort] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  return (
    <div className="lg:hidden">
      <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-bg border-t border-black/10 grid grid-cols-2 z-50">
        <button 
          onClick={() => setShowSort(true)}
          className="flex items-center justify-center gap-3 border-r border-black/5 hover:bg-accent/5 transition-colors"
        >
          <ArrowUpDown className="w-4 h-4 text-accent/60" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent">Sort</span>
        </button>

        <button 
          onClick={() => setShowFilters(true)}
          className="flex items-center justify-center gap-3 hover:bg-accent/5 transition-colors"
        >
          <ListFilter className="w-4 h-4 text-accent/60" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-accent">Filter</span>
        </button>
      </div>

      <AnimatePresence>
        {showSort && (
          <SortModal
            currentSort={sortBy}
            onClose={() => setShowSort(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFilters && (
          <FilterModal
            onClose={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MobileActions
