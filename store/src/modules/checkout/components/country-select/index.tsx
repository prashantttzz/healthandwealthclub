import { forwardRef, useImperativeHandle, useMemo, useRef } from "react"

import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"
import { HttpTypes } from "@medusajs/types"

const CountrySelect = forwardRef<
  HTMLSelectElement,
  NativeSelectProps & {
    region?: HttpTypes.StoreRegion
  }
>(({ placeholder = "Country", region, defaultValue, ...props }, ref) => {
  const innerRef = useRef<HTMLSelectElement>(null)

  useImperativeHandle<HTMLSelectElement | null, HTMLSelectElement | null>(
    ref,
    () => innerRef.current
  )

  const countryOptions = useMemo(() => {
    if (!region) {
      return []
    }

    const gccCodes = ["ae", "sa", "qa", "kw", "bh", "om"]
    
    const options = region.countries?.map((country) => ({
      value: country.iso_2,
      label: country.display_name,
    })) || []

    // Sort options to put GCC first
    return [...options].sort((a, b) => {
      const aGcc = gccCodes.includes(a.value || "")
      const bGcc = gccCodes.includes(b.value || "")
      if (aGcc && !bGcc) return -1
      if (!aGcc && bGcc) return 1
      return 0
    })
  }, [region])

  return (
    <NativeSelect
      ref={innerRef}
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...props}
    >
      {countryOptions?.map(({ value, label }, index) => (
        <option key={index} value={value}>
          {label}
        </option>
      ))}
    </NativeSelect>
  )
})

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
