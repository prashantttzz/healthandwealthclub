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
  addItem: (variantId: string, quantity: number, countryCode: string, optimisticData?: any) => Promise<void>
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
  const [optimisticAdditions, setOptimisticAdditions] = useState<HttpTypes.StoreCartLineItem[]>([])
  const [isAdding, setIsAdding] = useState(false)

  // Sync state if initialCart prop changes (e.g. on navigation)
  useEffect(() => {
    if (initialCart) {
      setCart(initialCart)
    }
  }, [initialCart])

  // Merge official items with optimistic quantities and new additions
  const optimisticItems = useMemo(() => {
    const existingItems = cart?.items?.map(item => ({
      ...item,
      quantity: optimisticQuantities[item.id] !== undefined ? optimisticQuantities[item.id] : item.quantity
    })).filter(item => item.quantity > 0) || []

    // Filter out optimistic additions that have already been added to the official cart
    const filteredAdditions = optimisticAdditions.filter(addition => 
      !existingItems.some(item => item.variant_id === addition.variant_id)
    )

    return [...existingItems, ...filteredAdditions]
  }, [cart?.items, optimisticQuantities, optimisticAdditions])

  const totalItems = useMemo(() => {
    return optimisticItems.reduce((acc, item) => acc + item.quantity, 0)
  }, [optimisticItems])

  const subtotal = useMemo(() => {
    return optimisticItems.reduce((acc, item) => {
      const price = Number(item.unit_price) || 0
      const quantity = Number(item.quantity) || 0
      return acc + (price * quantity)
    }, 0)
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

  const addItem = async (variantId: string, quantity: number, countryCode: string, optimisticData?: any) => {
    setIsAdding(true)
    const startTime = Date.now()
    
    // 1. Detect if item already exists in cart for smart deduplication
    const existingItem = cart?.items?.find(item => item.variant_id === variantId)
    let tempId: string | null = null

    if (existingItem) {
      // Update quantity of existing item optimistically
      const currentOptQty = optimisticQuantities[existingItem.id] !== undefined ? optimisticQuantities[existingItem.id] : existingItem.quantity
      setOptimisticQuantities(prev => ({ ...prev, [existingItem.id]: currentOptQty + quantity }))
    } else if (optimisticData) {
      // Add as a new optimistic row
      tempId = `optimistic-${Date.now()}`
      const newItem: any = {
        id: tempId,
        variant_id: variantId,
        quantity,
        unit_price: optimisticData.unit_price || 0,
        thumbnail: optimisticData.thumbnail,
        product_title: optimisticData.product_title,
        variant: {
          title: optimisticData.variant?.title,
          product: {
            images: optimisticData.variant?.product?.images
          }
        },
        ...optimisticData
      }
      setOptimisticAdditions(prev => [...prev, newItem])
    }

    try {
      await postAddToCart({ variantId, quantity, countryCode })
      // Revalidation will happen on server and update 'cart' via props in layout
    } catch (error) {
      // 2. Instant Rollback on Error
      if (existingItem) {
        setOptimisticQuantities(prev => {
          const newState = { ...prev }
          delete newState[existingItem.id]
          return newState
        })
      } else if (tempId) {
        setOptimisticAdditions(prev => prev.filter(item => item.id !== tempId))
      }
    } finally {
      // Force a minimum delay of 1500ms for the loader
      const elapsed = Date.now() - startTime
      const remaining = 1500 - elapsed
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining))
      }
      
      setIsAdding(false)
      if (tempId) {
        // We keep it for a moment to allow revalidation to happen
        setTimeout(() => {
          setOptimisticAdditions(prev => prev.filter(item => item.id !== tempId))
        }, 2000)
      }
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
