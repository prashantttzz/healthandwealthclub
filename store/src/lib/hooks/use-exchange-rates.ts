// lib/hooks/use-exchange-rates.ts
// -----------------------------------------------------------------------
// Fetches display exchange rates ONLY for international customers.
// Gulf and UAE customers never trigger this — their prices are already
// correct in Medusa. This saves API calls for 90% of your traffic.
// -----------------------------------------------------------------------

import { useRegion } from "@lib/context/region-context"
import { useState, useEffect } from "react"

type RatesResult = {
  rates: Record<string, number> | null
  loading: boolean
}

// Cache rates in memory so we don't re-fetch on every page navigation
let cachedRates: Record<string, number> | null = null
let cacheTimestamp = 0
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

// Currencies that are handled natively by Medusa regions (no fetch needed)
const NATIVE_CURRENCIES = ["aed", "sar", "kwd", "qar", "bhd", "omr"]

export function useExchangeRates(): RatesResult {
  const { region } = useRegion()
  const [rates, setRates] = useState<Record<string, number> | null>(cachedRates)
  const [loading, setLoading] = useState(false)

  const isInternational = !NATIVE_CURRENCIES.includes(
    region?.currency_code?.toLowerCase() ?? ""
  )

  useEffect(() => {
    // Don't fetch for UAE or Gulf — prices already correct from Medusa
    if (!isInternational) {
      setRates(null)
      return
    }

    // Use cache if still fresh
    const now = Date.now()
    if (cachedRates && now - cacheTimestamp < CACHE_TTL) {
      setRates(cachedRates)
      return
    }

    // Fetch fresh rates from your own API route (keeps your API key server-side)
    setLoading(true)
    fetch("/api/exchange-rates")
      .then((r) => r.json())
      .then((data) => {
        console.log("[useExchangeRates] Received rates:", Object.keys(data.rates || {}).length > 0)
        cachedRates = data.rates
        cacheTimestamp = Date.now()
        setRates(data.rates)
      })
      .catch((err) => {
        console.error("[useExchangeRates] fetch error:", err)
        // Silently fail — formatPrice will fall back to USD display
        console.warn("[exchange-rates] failed to fetch, falling back to USD display")
      })
      .finally(() => setLoading(false))
  }, [isInternational])

  return { rates, loading }
}