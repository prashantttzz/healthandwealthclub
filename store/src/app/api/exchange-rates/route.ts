// app/api/exchange-rates/route.ts
// -----------------------------------------------------------------------
// Server-side route that fetches exchange rates and returns them to
// the frontend. Keeps OPEN_EXCHANGE_RATES_APP_ID off the client bundle.
// Only called for international customers.
// -----------------------------------------------------------------------

import { NextResponse } from "next/server"

// Cache on server side too so multiple users share one API call
let serverCache: { rates: Record<string, number>; timestamp: number } | null = null
const CACHE_TTL = 1000 * 60 * 60 // 1 hour

export async function GET() {
  try {
    const now = Date.now()

    // Return cached rates if fresh
    if (serverCache && now - serverCache.timestamp < CACHE_TTL) {
      return NextResponse.json({ rates: serverCache.rates })
    }

    const APP_ID = process.env.OPEN_EXCHANGE_RATES_APP_ID
    console.log("[exchange-rates route] APP_ID present:", !!APP_ID)

    if (!APP_ID) {
      console.error("[exchange-rates route] OPEN_EXCHANGE_RATES_APP_ID is missing")
      return NextResponse.json({ rates: {} }, { status: 500 })
    }

    const res = await fetch(
      `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}&base=USD`
    )

    if (!res.ok) throw new Error(`API error ${res.status}`)

    const data = await res.json()
    console.log("[exchange-rates route] Fetched rates count:", Object.keys(data.rates || {}).length)
    if (data.rates?.INR) {
      console.log("[exchange-rates route] INR Rate:", data.rates.INR)
    } else {
      console.warn("[exchange-rates route] INR Rate NOT FOUND in API response")
    }

    serverCache = {
      rates: data.rates,
      timestamp: now,
    }

    return NextResponse.json(
      { rates: data.rates },
      {
        headers: {
          // Tell browser to cache for 1 hour too
          "Cache-Control": "public, max-age=3600",
        },
      }
    )
  } catch (err) {
    console.error("[exchange-rates route]", err)
    return NextResponse.json({ rates: {} }, { status: 500 })
  }
}