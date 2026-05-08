"use client"

import React, { useState, useMemo, useEffect, useRef } from "react"
import { clx } from "@medusajs/ui"
import { ChevronDown, Search, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface SearchableSelectProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (val: string) => void
  placeholder?: string
  small?: boolean
  name?: string
}

const SearchableSelect = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select...",
  small = false,
  name
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  
  const selected = options.find((o) => o.value.toLowerCase() === value.toLowerCase())

  const filteredOptions = useMemo(() => {
    if (!search) return options
    const s = search.toLowerCase()
    return options.filter(
      (o) => o.label.toLowerCase().includes(s) || o.value.toLowerCase().includes(s)
    )
  }, [options, search])

  useEffect(() => {
    if (!isOpen) setSearch("")
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label className="font-manrope text-[10px] uppercase font-bold tracking-[0.2em] text-accent/60">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={clx(
          "w-full px-4 bg-accent/[0.02] border border-accent/10 flex items-center justify-between group hover:border-accent/30 transition-colors",
          small ? "h-10 px-3" : "h-12"
        )}
      >
        <span
          className={clx(
            "font-manrope",
            small ? "text-[12px]" : "text-[14px]",
            selected ? "text-accent" : "text-accent/20"
          )}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={clx(
            "w-3.5 h-3.5 text-accent/20 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {name && <input type="hidden" name={name} value={value} />}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-[calc(100%+4px)] left-0 w-full bg-bg border border-accent/10 shadow-2xl z-[130] flex flex-col min-w-[200px]"
          >
            <div className="p-3 border-b border-accent/5 sticky top-0 bg-bg z-10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-accent/20" />
                <input
                  autoFocus
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 bg-accent/[0.03] border border-accent/10 font-manrope text-[12px] text-accent outline-none focus:border-accent/30 transition-colors"
                />
              </div>
            </div>
            <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-6 text-center font-newsreader italic text-accent/20">
                  No results found
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value)
                      setIsOpen(false)
                    }}
                    className={clx(
                      "w-full text-left px-4 py-3 font-manrope transition-colors border-b border-accent/5 last:border-none",
                      small ? "text-[12px] py-2" : "text-[13px] py-3",
                      value.toLowerCase() === opt.value.toLowerCase()
                        ? "bg-accent text-bg"
                        : "text-accent hover:bg-accent/[0.03]"
                    )}
                  >
                    {opt.label}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchableSelect
