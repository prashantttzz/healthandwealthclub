"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { addToCart as postAddToCart, updateLineItem as postUpdateLineItem, deleteLineItem as postDeleteLineItem } from "@lib/data/cart"
import { toast } from "@medusajs/ui"

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
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider: React.FC<{
  children: React.ReactNode
  initialCart?: HttpTypes.StoreCart | null
}> = ({ children, initialCart }) => {
  const router = useRouter()
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(initialCart || null)
  const [optimisticQuantities, setOptimisticQuantities] = useState<Record<string, number>>({})
  const [optimisticAdditions, setOptimisticAdditions] = useState<HttpTypes.StoreCartLineItem[]>([])
  const [optimisticRemovedIds, setOptimisticRemovedIds] = useState<Record<string, true>>({})
  const [isAdding, setIsAdding] = useState(false)

  const removeLineFromCartState = (currentCart: HttpTypes.StoreCart | null, lineId: string) => {
    if (!currentCart?.items) {
      return currentCart
    }

    return {
      ...currentCart,
      items: currentCart.items.filter((item) => item.id !== lineId),
    }
  }

  const updateLineQuantityInCartState = (
    currentCart: HttpTypes.StoreCart | null,
    lineId: string,
    quantity: number
  ) => {
    if (!currentCart?.items) {
      return currentCart
    }

    if (quantity <= 0) {
      return removeLineFromCartState(currentCart, lineId)
    }

    return {
      ...currentCart,
      items: currentCart.items.map((item) =>
        item.id === lineId
          ? {
              ...item,
              quantity,
            }
          : item
      ),
    }
  }

  // ✅ Sync when cart comes from server (e.g. from Initializer)
  useEffect(() => {
    if (initialCart) {
      setCart(initialCart)
      // Only clear additions that are now officially in the cart
      setOptimisticAdditions(prev => 
        prev.filter(addition => 
          !initialCart.items?.some(item => item.variant_id === addition.variant_id)
        )
      )
    }
  }, [initialCart?.id, initialCart?.items?.length])

  // ✅ Merge real cart items with optimistic state
  const optimisticItems = useMemo(() => {
    const existingItems = cart?.items?.map(item => ({
      ...item,
      quantity: optimisticQuantities[item.id] !== undefined
        ? optimisticQuantities[item.id]
        : item.quantity
    })).filter(item => !optimisticRemovedIds[item.id] && item.quantity > 0) || []

    const filteredAdditions = optimisticAdditions.filter(addition =>
      !existingItems.some(item => item.variant_id === addition.variant_id)
    )

    return [...existingItems, ...filteredAdditions]
  }, [cart?.items, optimisticQuantities, optimisticAdditions, optimisticRemovedIds])

  const totalItems = useMemo(() => {
    return optimisticItems.reduce((acc, item) => acc + item.quantity, 0)
  }, [optimisticItems])

  const subtotal = useMemo(() => {
    return optimisticItems.reduce((acc, item) => {
      const price = Number(item.unit_price) || 0
      const quantity = Number(item.quantity) || 0
      return acc + price * quantity
    }, 0)
  }, [optimisticItems])

  // ✅ Clean up optimistic quantities once server confirms them
  useEffect(() => {
    if (!cart?.items) return
    setOptimisticQuantities(prev => {
      const newState = { ...prev }
      let changed = false
      cart.items?.forEach(item => {
        if (newState[item.id] === item.quantity) {
          delete newState[item.id]
          changed = true
        }
      })
      return changed ? newState : prev
    })
  }, [cart?.items])

  useEffect(() => {
    if (!cart) return

    setOptimisticRemovedIds(prev => {
      const nextState = { ...prev }
      let changed = false

      Object.keys(prev).forEach(lineId => {
        const itemStillExists = cart.items?.some(item => item.id === lineId)
        if (!itemStillExists) {
          delete nextState[lineId]
          changed = true
        }
      })

      return changed ? nextState : prev
    })
  }, [cart])

  const addItem = async (
    variantId: string,
    quantity: number,
    countryCode: string,
    optimisticData?: any
  ) => {
    setIsAdding(true)
    const existingItem = cart?.items?.find(item => item.variant_id === variantId)
    let tempId: string | null = null

    // ✅ Optimistic update before API call
    if (existingItem) {
      const currentQty = optimisticQuantities[existingItem.id] ?? existingItem.quantity
      setOptimisticQuantities(prev => ({
        ...prev,
        [existingItem.id]: currentQty + quantity
      }))
    } else if (optimisticData) {
      tempId = `optimistic-${Date.now()}`
      const newItem: any = {
        id: tempId,
        variant_id: variantId,
        quantity,
        unit_price: optimisticData.unit_price || 0,
        thumbnail: optimisticData.thumbnail,
        product_title: optimisticData.title || optimisticData.product_title,
        variant: {
          title: optimisticData.variant?.title,
          images: optimisticData.variant?.images,
          product: {
            images: optimisticData.variant?.product?.images,
            handle: optimisticData.product_handle
          }
        },
        ...optimisticData
      }
      setOptimisticAdditions(prev => [...prev, newItem])
    }

    try {
      const updatedCart = await postAddToCart({ variantId, quantity, countryCode })

      if (updatedCart) {
        if (existingItem) {
          setOptimisticQuantities(prev => {
            const newState = { ...prev }
            delete newState[existingItem.id]
            return newState
          })
        }
        if (tempId) {
          setOptimisticAdditions(prev => prev.filter(item => item.id !== tempId))
        }
        setCart(updatedCart)
      } else {
        router.refresh()
      }
    } catch (error: any) {
      // ✅ Rollback on failure
      if (existingItem) {
        setOptimisticQuantities(prev => {
          const newState = { ...prev }
          delete newState[existingItem.id]
          return newState
        })
      } else if (tempId) {
        setOptimisticAdditions(prev => prev.filter(item => item.id !== tempId))
      }
      toast.error(error.message || "Couldn't add item to cart")
    } finally {
      setIsAdding(false)
    }
  }

  const updateQuantity = async (lineId: string, quantity: number) => {
    const previousCart = cart
    setOptimisticQuantities(prev => ({ ...prev, [lineId]: quantity }))

    if (quantity <= 0) {
      setOptimisticRemovedIds(prev => ({ ...prev, [lineId]: true }))
      setOptimisticAdditions(prev => prev.filter(item => item.id !== lineId))
      try {
        const updatedCart = await postDeleteLineItem(lineId)
        if (updatedCart) {
          setCart(updatedCart) // ✅
        } else {
          router.refresh()
        }
      } catch (error: any) {
        setCart(previousCart)
        setOptimisticQuantities(prev => {
          const newState = { ...prev }
          delete newState[lineId]
          return newState
        })
        setOptimisticRemovedIds(prev => {
          const newState = { ...prev }
          delete newState[lineId]
          return newState
        })
        toast.error(error.message || "Couldn't remove item from cart")
      }
      return
    }

    try {
      const updatedCart = await postUpdateLineItem({ lineId, quantity })
      if (updatedCart) {
        setOptimisticQuantities(prev => {
          const newState = { ...prev }
          delete newState[lineId]
          return newState
        })
        setCart(updatedCart)
      } else {
        router.refresh()
      }
    } catch (error: any) {
      setCart(previousCart)
      setOptimisticQuantities(prev => {
        const newState = { ...prev }
        delete newState[lineId]
        return newState
      })
      toast.error(error.message || "Couldn't update item quantity")
    }
  }

  const removeItem = async (lineId: string) => {
    const previousCart = cart
    setOptimisticQuantities(prev => ({ ...prev, [lineId]: 0 }))
    setOptimisticRemovedIds(prev => ({ ...prev, [lineId]: true }))
    setOptimisticAdditions(prev => prev.filter(item => item.id !== lineId))
    try {
      const updatedCart = await postDeleteLineItem(lineId)
      if (updatedCart) {
        setOptimisticQuantities(prev => {
          const newState = { ...prev }
          delete newState[lineId]
          return newState
        })
        setOptimisticRemovedIds(prev => {
          const newState = { ...prev }
          delete newState[lineId]
          return newState
        })
        setCart(updatedCart)
      } else {
        router.refresh()
      }
    } catch (error: any) {
      setCart(previousCart)
      setOptimisticQuantities(prev => {
        const newState = { ...prev }
        delete newState[lineId]
        return newState
      })
      setOptimisticRemovedIds(prev => {
        const newState = { ...prev }
        delete newState[lineId]
        return newState
      })
      toast.error(error.message || "Couldn't remove item from cart")
    }
  }

  const clearCart = () => {
    setCart(null)
    setOptimisticQuantities({})
    setOptimisticAdditions([])
    setOptimisticRemovedIds({})
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
        setCart,
        clearCart
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
