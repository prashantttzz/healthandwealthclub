"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ArrowDownNarrowWide, ArrowUpWideNarrow, Loader2 } from "lucide-react"

const sortOptions = [
  { value: "created_at", label: "Latest Arrivals", icon: Clock },
  { value: "price_asc", label: "Price: Low to High", icon: ArrowUpWideNarrow },
  { value: "price_desc", label: "Price: High to Low", icon: ArrowDownNarrowWide },
]

type SortModalProps = {
  currentSort: string
  onClose: () => void
}

const SortModal = ({ currentSort, onClose }: SortModalProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

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
    startTransition(() => {
      router.push(`${pathname}?${query}`, { scroll: false })
      onClose()
    })
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
      />

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 bg-bg rounded-t-[24px] z-[101] overflow-hidden"
      >
        <div className="px-6 py-6 border-b border-black/5 flex items-center justify-between relative">
          <h3 className="text-[11px] uppercase tracking-[0.3em] font-bold text-accent">Sort By</h3>
          <AnimatePresence>
            {isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-bg/60 backdrop-blur-[2px] flex items-center justify-center z-10"
              >
                <Loader2 className="w-4 h-4 text-accent animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="py-2 pb-10">
          {sortOptions.map((option) => {
            const Icon = option.icon
            const isSelected = currentSort === option.value

            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="flex items-center gap-6 w-full px-8 py-5 hover:bg-black/5 transition-colors group"
              >
                <Icon 
                  className={`w-5 h-5 transition-colors ${isSelected ? "text-accent" : "text-bordergroup-hover:text-accent"}`} 
                  strokeWidth={1.5} 
                />
                <span className={`text-[12px] uppercase tracking-widest font-bold transition-colors ${isSelected ? "text-accent" : "text-accent/40"}`}>
                  {option.label}
                </span>
                {isSelected && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                )}
              </button>
            )
          })}
        </div>
      </motion.div>
    </>
  )
}

export default SortModal
