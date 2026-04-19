"use client"

import { HttpTypes } from "@medusajs/types"
import { useCart } from "@lib/context/cart-context"
import { useLayoutEffect, useRef } from "react"

export default function CartInitializer({ cart }: { cart: HttpTypes.StoreCart | null }) {
  const { setCart } = useCart()
  const lastSyncRef = useRef<string | null>(null)

  useLayoutEffect(() => {
    const syncKey = cart
      ? [
          cart.id,
          cart.updated_at ?? "",
          cart.items?.length ?? 0,
          cart.total ?? 0,
          cart.shipping_total ?? 0,
          cart.payment_collection?.updated_at ?? "",
        ].join(":")
      : "empty"

    if (lastSyncRef.current === syncKey) {
      return
    }

    lastSyncRef.current = syncKey
    setCart(cart)
  }, [cart, setCart])

  return null
}
