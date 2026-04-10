"use client"

import { useUI } from "@lib/context/ui-context"
import { HttpTypes } from "@medusajs/types"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { clx } from "@medusajs/ui"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import DeleteButton from "@modules/common/components/delete-button"
import QuantitySelector from "@modules/cart/components/item/quantity-selector"
import { convertToLocale } from "@lib/util/money"
import { updateLineItem } from "@lib/data/cart"
import { useState, useEffect } from "react"
import Spinner from "@modules/common/icons/spinner"

const sidebarVariants = {
  closed: {
    x: "100%",
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  open: {
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
} as const

const CartSidebar = ({
  cart,
}: {
  cart: HttpTypes.StoreCart | null
}) => {
  const { isCartSidebarOpen, closeCartSidebar } = useUI()
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null)
  const [optimisticQuantities, setOptimisticQuantities] = useState<Record<string, number>>({})
  const [isNavigating, setIsNavigating] = useState(false)

  const items = (cart?.items || []).map(item => ({
    ...item,
    quantity: optimisticQuantities[item.id] !== undefined ? optimisticQuantities[item.id] : item.quantity
  })).filter(item => item.quantity > 0)

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = cart?.subtotal ?? 0

  const handleQuantityChange = async (lineId: string, quantity: number) => {
    // Set optimistic state immediately
    setOptimisticQuantities(prev => ({ ...prev, [lineId]: quantity }))
    
    if (quantity <= 0) {
      setUpdatingItemId(lineId)
      try {
        const { deleteLineItem } = await import("@lib/data/cart")
        await deleteLineItem(lineId)
        // Cleanup optimistic state after successful deletion
        setOptimisticQuantities(prev => {
          const newState = { ...prev }
          delete newState[lineId]
          return newState
        })
      } catch (err) {
        // Rollback on error
        setOptimisticQuantities(prev => {
          const newState = { ...prev }
          delete newState[lineId]
          return newState
        })
      } finally {
        setUpdatingItemId(null)
      }
      return
    }

    setUpdatingItemId(lineId)
    try {
      await updateLineItem({
        lineId,
        quantity,
      })
      // Once the cart prop updates, the merge logic will eventually sync back to reality.
      // We can also clear the optimistic state for this item here if we know the prop is about to update.
    } catch (err) {
      // Rollback on error
      setOptimisticQuantities(prev => {
        const newState = { ...prev }
        delete newState[lineId]
        return newState
      })
    } finally {
      setUpdatingItemId(null)
    }
  }

  // Sync optimistic state: if the cart prop matches our optimistic value, we can remove it from optimistic set
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


  return (
    <AnimatePresence>
      {isCartSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartSidebar}
            className="fixed inset-0 z-[1001] bg-black/40 backdrop-blur-sm pointer-events-auto"
          />

          {/* Sidebar */}
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-y-0 right-0 z-[1002] w-[85%] sm:w-[450px] bg-bg shadow-2xl pointer-events-auto flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 h-24 border-b border-black/5">
              <h2 className="font-newsreader italic text-4xl tracking-tight uppercase">CART</h2>
              <button
                onClick={closeCartSidebar}
                className="p-2 -mr-2 text-accent hover:rotate-90 transition-transform duration-300"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={24} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
              {items.length ? (
                <div className="flex flex-col">
                  {items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                    })
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-8 border-b border-black/5 flex gap-x-6"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-20 h-24 shrink-0 group relative bg-black/5 overflow-hidden rounded-sm"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="full"
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </LocalizedClientLink>

                        <div className="flex flex-col flex-1">
                          <div className="flex flex-col gap-0.5">
                            <h3 className="font-manrope text-[13px] font-medium leading-snug max-w-[180px]">
                              <LocalizedClientLink
                                href={`/products/${item.product_handle}`}
                                className="hover:opacity-70 transition-opacity"
                              >
                                {item.title}
                              </LocalizedClientLink>
                            </h3>
                            <div className="font-manrope text-[10px] text-accent/40 uppercase tracking-wider">
                              <LineItemOptions variant={item.variant} />
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <QuantitySelector
                              quantity={item.quantity}
                              onChange={(val) => handleQuantityChange(item.id, val)}
                              loading={updatingItemId === item.id}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-8">
                  <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center opacity-50">
                    <HugeiconsIcon icon={ShoppingBag01Icon} size={32} />
                  </div>
                  <div className="space-y-3">
                    <p className="font-newsreader italic text-3xl">Empty collection</p>
                    <p className="font-manrope text-[12px] uppercase font-bold tracking-[0.2em] text-accent/30 max-w-[240px] leading-relaxed mx-auto">
                      Your bag is waiting for its first treasure. Explore our curated experiences.
                    </p>
                  </div>
                  <LocalizedClientLink
                    href="/store"
                    className="w-full max-w-[260px]"
                  >
                    <button className="w-full py-4 border border-black/10 text-black font-manrope text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-300 rounded-none">
                      START EXPLORING
                    </button>
                  </LocalizedClientLink>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart && items.length > 0 && (
              <div className="p-8 border-t border-black/5">
                <div className="flex items-center justify-between mb-8 pt-2">
                  <span className="font-manrope text-[13px] uppercase tracking-[0.2em] text-accent font-medium">
                    SUBTOTAL
                  </span>
                  <span className="font-manrope text-[15px] font-bold">
                    {convertToLocale({
                      amount: subtotal,
                      currency_code: cart.currency_code,
                    })}
                  </span>
                </div>
                
                <div className="space-y-6">
                  <p className="font-manrope text-[12px] text-accent/60 text-center leading-relaxed px-4">
                    Shipping, taxes, and discount codes calculated at checkout.
                  </p>
                  
                  <LocalizedClientLink
                    href="/checkout"
                    className="block w-full"
                  >
                    <button 
                      onClick={() => setIsNavigating(true)}
                      className="w-full py-5 bg-accent text-white font-manrope text-[13px] tracking-[0.3em] hover:bg-accent transition-all duration-300 uppercase flex items-center justify-center gap-2"
                    >
                      {isNavigating ? <Spinner /> : "CHECK OUT"}
                    </button>
                  </LocalizedClientLink>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartSidebar
