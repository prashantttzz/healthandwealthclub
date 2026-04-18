// lib/currency.ts
// -----------------------------------------------------------------------
// Single source of truth for all currency display across the app.
// - UAE + Gulf regions: price comes from Medusa already in correct currency,
//   just format and display it.
// - International: price comes from Medusa in USD, convert to local display
//   currency using exchange rate API. Checkout still processes in USD.
// -----------------------------------------------------------------------

import { useRegion } from "./context/region-context"
import { useExchangeRates } from "./hooks/use-exchange-rates"

// Countries that get display-only conversion (checkout stays in USD)
const INTERNATIONAL_DISPLAY_CURRENCIES: Record<string, string> = {
  IN: "INR",
  GB: "GBP",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PL: "PLN",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  CH: "CHF",
  AU: "AUD",
  CA: "CAD",
  JP: "JPY",
  CN: "CNY",
  SG: "SGD",
  MY: "MYR",
  PK: "PKR",
  BD: "BDT",
  LK: "LKR",
  NG: "NGN",
  KE: "KES",
  ZA: "ZAR",
  EG: "EGP",
  TR: "TRY",
  BR: "BRL",
  MX: "MXN",
  // Add more as needed — if country not listed, falls back to USD display
}

// Medusa region currency codes (already correct, just format these)
const NATIVE_REGION_CURRENCIES = ["aed", "sar", "kwd", "qar", "bhd", "omr"]

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

export type RegionContext = {
  currency_code: string  // from Medusa region e.g. "aed", "sar", "usd"
  country_code: string   // detected country e.g. "AE", "SA", "IN"
}

// -----------------------------------------------------------------------
// Format a price for display
//
// Usage:
//   formatPrice(amount, { currency_code: 'aed', country_code: 'AE' })
//   → "AED 100.00"
//
//   formatPrice(amount, { currency_code: 'usd', country_code: 'IN' }, rates)
//   → "₹ 8,350.00"
// -----------------------------------------------------------------------

export function formatPrice(
  amount: number, // Medusa amount in lowest denomination (e.g. 10000 = 100.00)
  region: RegionContext,
  exchangeRates?: Record<string, number> // only needed for international
): string {
  const value = amount // convert from fils/cents to main unit
  const currencyCode = region.currency_code.toLowerCase()

  // UAE and all Gulf regions — price is already in correct currency from Medusa
  // if (NATIVE_REGION_CURRENCIES.includes(currencyCode)) {
  //   return formatCurrency(value, currencyCode.toUpperCase())
  // }

  // International — Medusa gives USD, convert to local display currency
  // if (currencyCode === "usd") {
  //   const country = region.country_code.toUpperCase()
  //   const displayCurrency = INTERNATIONAL_DISPLAY_CURRENCIES[country]

  //   if (displayCurrency) {
  //     const rate = exchangeRates?.[displayCurrency]
  //     if (rate) {
  //       const localValue = value * rate
  //       return formatCurrency(localValue, displayCurrency)
  //     } else {
  //       // Only log if we expect a conversion but rates are missing
  //       console.warn(`[formatPrice] No rate found for ${displayCurrency} (Country: ${country})`)
  //     }
  //   } else {
  //      // Log if country is not in our display list
  //      console.log(`[formatPrice] No display currency mapped for country: ${country}`)
  //   }

  //   // Fallback to USD display
  //   return formatCurrency(value, "USD")
  // }

  // Catch-all fallback
  return formatCurrency(value, currencyCode.toUpperCase())
}

// -----------------------------------------------------------------------
// Format a number as currency using browser's Intl API
// Handles symbols, decimal rules, and RTL automatically
// -----------------------------------------------------------------------

function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      minimumFractionDigits: getDecimalPlaces(currency),
      maximumFractionDigits: getDecimalPlaces(currency),
    }).format(value)
  } catch {
    // If Intl doesn't know the currency, show raw value
    return `${currency} ${value.toFixed(2)}`
  }
}

function getDecimalPlaces(currency: string): number {
  const ZERO_DECIMAL = ["JPY", "KRW", "VND", "IDR"]
  const THREE_DECIMAL = ["KWD", "BHD", "OMR"]
  if (ZERO_DECIMAL.includes(currency)) return 0
  if (THREE_DECIMAL.includes(currency)) return 3
  return 2
}
export function useCurrencyFormatter() {
  const { region, countryCode } = useRegion()
  const { rates } = useExchangeRates() 

  return {
    formatPrice: (amount: number) =>
      formatPrice(
        amount,
        {
          currency_code: region?.currency_code ?? "usd",
          country_code: countryCode,
        },
        rates ?? undefined
      ),
  }
}