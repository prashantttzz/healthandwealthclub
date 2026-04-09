"use client"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h4 className="text-[10px] tracking-[0.4em] uppercase font-bold text-accent/60 mb-2">
        Sort By
      </h4>
      <div className="flex flex-col gap-2">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleChange(option.value as SortOptions)}
            className={`flex items-center justify-between px-4 py-3 text-[11px] uppercase tracking-widest transition-all ${
              sortBy === option.value 
                ? "bg-accent text-bg font-bold" 
                : "bg-transparent text-accent/60 border border-black/5 hover:border-black/20"
            }`}
          >
            {option.label}
            {sortBy === option.value && <span className="text-[14px]">→</span>}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SortProducts
