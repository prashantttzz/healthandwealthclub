"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

const SortSelector = ({ sortBy }: { sortBy?: string }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const query = createQueryString("sortBy", e.target.value)
    router.push(`${pathname}?${query}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-4 self-end md:self-center">
      <span className="text-xs font-manrope font-semibold text-accent/60">Sort by</span>
      <select 
        value={sortBy}
        onChange={handleChange}
        className="bg-transparent border border-black/10 rounded-lg px-4 py-2 text-xs font-manrope font-bold outline-none focus:border-accent/40 cursor-pointer hover:border-accent/20 transition-colors"
      >
        <option value="created_at">Latest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  )
}

export default SortSelector
