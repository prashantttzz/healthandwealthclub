"use client"

import React, { createContext, useContext, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"

interface RegionContextType {
  regions: HttpTypes.StoreRegion[]
  region: HttpTypes.StoreRegion | null
  countryCode: string
}

const RegionContext = createContext<RegionContextType | undefined>(undefined)

export const RegionProvider: React.FC<{
  children: React.ReactNode
  regions: HttpTypes.StoreRegion[]
  countryCode: string
}> = ({ children, regions, countryCode }) => {
  // Map country codes to regions, mirroring middleware logic
  const region = useMemo(() => {
    const map = new Map<string, HttpTypes.StoreRegion>()
    
    regions.forEach((r) => {
      r.countries?.forEach((c) => {
        map.set(c.iso_2 ?? "", r)
      })
    })

    return map.get(countryCode) ?? regions[0] ?? null
  }, [regions, countryCode])

  return (
    <RegionContext.Provider
      value={{
        regions,
        region,
        countryCode,
      }}
    >
      {children}
    </RegionContext.Provider>
  )
}

export const useRegion = () => {
  const context = useContext(RegionContext)
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider")
  }
  return context
}
