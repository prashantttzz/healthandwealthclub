"use client"

import { HttpTypes } from "@medusajs/types"
import { useCart } from "@lib/context/cart-context"
import { useEffect } from "react"

export default function CartInitializer({ cart }: { cart: HttpTypes.StoreCart | null }) {
  const { setCart } = useCart()

  useEffect(() => {
    setCart(cart)
  }, [cart, setCart])

  return null
}
