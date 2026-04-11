"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import { HttpTypes } from "@medusajs/types"
import { addToCart as postAddToCart, updateLineItem as postUpdateLineItem, deleteLineItem as postDeleteLineItem } from "@lib/data/cart"

interface CartContextType {
  cart: HttpTypes.StoreCart | null
  optimisticItems: HttpTypes.StoreCartLineItem[]
  totalItems: number
  subtotal: number
  isAdding: boolean
  addItem: (variantId: string, quantity: number, countryCode: string) => Promise<void>
  updateQuantity: (lineId: string, quantity: number) => Promise<void>
  removeItem: (lineId: string) => Promise<void>
  setCart: (cart: HttpTypes.StoreCart | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{ 
  children: React.ReactNode,
  initialCart?: HttpTypes.StoreCart | null 
}> = ({ children, initialCart }) => {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(initialCart || null)
  const [optimisticQuantities, setOptimisticQuantities] = useState<Record<string, number>>({})
  const [isAdding, setIsAdding] = useState(false)

  // Sync state if initialCart prop changes (e.g. on navigation)
  useEffect(() => {
    if (initialCart) {
      setCart(initialCart)
    }
  }, [initialCart])

  // Merge official items with optimistic quantities
  const optimisticItems = useMemo(() => {
    if (!cart?.items) return []
    return cart.items.map(item => ({
      ...item,
      quantity: optimisticQuantities[item.id] !== undefined ? optimisticQuantities[item.id] : item.quantity
    })).filter(item => item.quantity > 0)
  }, [cart?.items, optimisticQuantities])

  const totalItems = useMemo(() => {
    return optimisticItems.reduce((acc, item) => acc + item.quantity, 0)
  }, [optimisticItems])

  const subtotal = useMemo(() => {
    return optimisticItems.reduce((acc, item) => acc + (item.unit_price || 0) * item.quantity, 0)
  }, [optimisticItems])

  // Sync optimistic state: cleanup when server data matches
  useEffect(() => {
    if (!cart?.items) return
    setOptimisticQuantities(prev => {
      const newState = { ...prev }
      let changed = false
      cart?.items?.forEach(item => {
        if (newState[item.id] === item.quantity) {
          delete newState[item.id]
          changed = true
        }
      })
      return changed ? newState : prev
    })
  }, [cart?.items])

  const addItem = async (variantId: string, quantity: number, countryCode: string) => {
    setIsAdding(true)
    try {
      await postAddToCart({ variantId, quantity, countryCode })
      // Revalidation will happen on server and update 'cart' via props in layout
    } finally {
      setIsAdding(false)
    }
  }

  const updateQuantity = async (lineId: string, quantity: number) => {
    setOptimisticQuantities(prev => ({ ...prev, [lineId]: quantity }))
    
    if (quantity <= 0) {
      try {
        await postDeleteLineItem(lineId)
      } catch (err) {
        setOptimisticQuantities(prev => {
          const newState = { ...prev }
          delete newState[lineId]
          return newState
        })
      }
      return
    }

    try {
      await postUpdateLineItem({ lineId, quantity })
    } catch (err) {
      setOptimisticQuantities(prev => {
        const newState = { ...prev }
        delete newState[lineId]
        return newState
      })
    }
  }

  const removeItem = async (lineId: string) => {
    setOptimisticQuantities(prev => ({ ...prev, [lineId]: 0 }))
    try {
      await postDeleteLineItem(lineId)
    } catch (err) {
      setOptimisticQuantities(prev => {
        const newState = { ...prev }
        delete newState[lineId]
        return newState
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        optimisticItems,
        totalItems,
        subtotal,
        isAdding,
        addItem,
        updateQuantity,
        removeItem,
        setCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
