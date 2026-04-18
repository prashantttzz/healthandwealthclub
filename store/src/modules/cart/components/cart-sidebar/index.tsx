"use client"

import { useUI } from "@lib/context/ui-context"
import { useCart } from "@lib/context/cart-context"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { clx, toast } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import LineItemOptions from "@modules/common/components/line-item-options"
import QuantitySelector from "@modules/cart/components/item/quantity-selector"
import LocalizedPrice from "@modules/common/components/localized-price"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Spinner from "@modules/common/icons/spinner"

const sidebarVariants = {
  closed: {
    x: "100%",
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  open: {
    x: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
} as const

const CartSidebar = () => {
  const { isCartSidebarOpen, closeCartSidebar } = useUI()
  const { optimisticItems: items, subtotal, updateQuantity, removeItem, isAdding, cart } = useCart()
  const [isNavigating, setIsNavigating] = useState(false)
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({})
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()

  // ✅ Reset navigation state when sidebar closes
  useEffect(() => {
    if (!isCartSidebarOpen) setIsNavigating(false)
  }, [isCartSidebarOpen])

  // ✅ Navigate instantly if not adding, otherwise wait for adding to finish
  useEffect(() => {
    if (isNavigating && !isAdding) {
      router.push(`/${countryCode}/checkout`)
    }
  }, [isNavigating, isAdding, router, countryCode])

  const handleQuantityChange = async (item: HttpTypes.StoreCartLineItem, quantity: number) => {
    const inventory = item.variant?.inventory_quantity ?? 10
    const manageInventory = item.variant?.manage_inventory !== false

    if (quantity > item.quantity && manageInventory && quantity > inventory) {
      toast.error(`Only ${inventory} items left in stock.`)
      return
    }

    setLoadingItems(prev => ({ ...prev, [item.id]: true }))
    try {
      if (quantity <= 0) {
        await removeItem(item.id)
      } else {
        await updateQuantity(item.id, quantity)
      }
    } finally {
      setLoadingItems(prev => ({ ...prev, [item.id]: false }))
    }
  }

  const sortedItems = [...items].sort((a, b) => {
    // ✅ Optimistic additions float to top
    const aIsOptimistic = a.id.startsWith("optimistic-")
    const bIsOptimistic = b.id.startsWith("optimistic-")
    if (aIsOptimistic) return -1
    if (bIsOptimistic) return 1
    return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  })

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
            className="fixed inset-y-0 right-0 z-[1002] w-[85%] sm:w-[450px] bg-accent shadow-2xl pointer-events-auto flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 h-20 border-b border-bg/10">
              <h2 className="font-newsreader italic text-3xl tracking-tight text-bg">CART</h2>
              <button
                onClick={closeCartSidebar}
                className="p-2 -mr-2 text-bg/40 hover:text-bg hover:rotate-90 transition-all duration-300"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              {sortedItems.length ? (
                <div className="flex flex-col">
                  {sortedItems.map((item) => (
                    <div
                      key={item.id}
                      className={clx(
                        "p-5 border-b border-bg/5 flex gap-x-6 transition-opacity duration-300",
                        { "opacity-50": loadingItems[item.id] }
                      )}
                    >
                      {/* ✅ Fixed product handle path */}
                      <LocalizedClientLink
                        href={`/products/${item.variant?.product?.handle}`}
                        className="w-20 h-24 shrink-0 group relative bg-bg/5 overflow-hidden rounded-sm"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Thumbnail
                          thumbnail={item.thumbnail}
                          images={item.variant?.product?.images}
                          size="full"
                          className="object-contain group-hover:scale-105 transition-transform duration-700"
                        />
                      </LocalizedClientLink>

                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex flex-col gap-0.5">
                          {/* ✅ Fixed title field */}
                          <h3 className="font-manrope text-[15px] font-regular leading-snug text-bg break-words">
                            <LocalizedClientLink
                              href={`/products/${item.variant?.product?.handle}`}
                              className="hover:opacity-70 transition-opacity"
                              target="_blank"
                              rel="noreferrer"
                            >
                              {item.product_title}
                            </LocalizedClientLink>
                          </h3>
                          <div className="font-manrope text-[10px] uppercase tracking-wider">
                            <LineItemOptions variant={item.variant} />
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="border border-bg/10 relative">
                            {/* ✅ Per-item loading overlay */}
                            {loadingItems[item.id] && (
                              <div className="absolute inset-0 flex items-center justify-center bg-accent/50 z-10">
                                <Spinner />
                              </div>
                            )}
                            <QuantitySelector
                              quantity={item.quantity}
                              onChange={(val) => handleQuantityChange(item, val)}
                              maxQuantity={item.variant?.manage_inventory === false ? 100 : (item.variant?.inventory_quantity ?? 10)}
                              loading={loadingItems[item.id]}
                              className="text-bg"
                            />
                          </div>

                          <span className="font-manrope text-[13px] font-semibold text-bg">
                            <LocalizedPrice amount={(Number(item.unit_price) || 0) * (Number(item.quantity) || 0)} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-12 text-center gap-8">
                  <div className="w-16 h-16 bg-bg/5 rounded-full flex items-center justify-center opacity-50">
                    <HugeiconsIcon icon={ShoppingBag01Icon} size={32} className="text-bg" />
                  </div>
                  <div className="space-y-3">
                    <p className="font-newsreader italic text-3xl text-bg">Empty collection</p>
                    <p className="font-manrope text-[12px] uppercase font-bold tracking-[0.2em] text-bg/30 max-w-[240px] leading-relaxed mx-auto">
                      Your bag is waiting for its first treasure. Explore our curated experiences.
                    </p>
                  </div>
                  <LocalizedClientLink href="/store" className="w-full max-w-[260px]">
                    <button className="w-full py-4 border border-bg/10 text-bg font-manrope text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-bg hover:text-accent transition-all duration-300">
                      START EXPLORING
                    </button>
                  </LocalizedClientLink>
                </div>
              )}
            </div>

            {/* Footer */}
            {sortedItems.length > 0 && (
              <div className="p-8 pt-3 border-t border-bg/10 bg-bg/5">
                <div className="flex items-center justify-between mb-8 pt-2">
                  <span className="font-manrope text-[13px] uppercase tracking-[0.2em] text-bg/40 font-medium">
                    SUBTOTAL
                  </span>
                  <span className="font-manrope text-[15px] font-bold text-bg">
                    <LocalizedPrice amount={subtotal} />
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="font-manrope text-[11px] text-bg/40 text-center leading-relaxed px-4">
                    Shipping, taxes, and discount codes calculated at checkout.
                  </p>

                  <LocalizedClientLink
                    href={`/${countryCode}/checkout`}
                    onClick={(e: any) => {
                      e.preventDefault()
                      if (!isNavigating) setIsNavigating(true)
                    }}
                    className={clx("block w-full text-center", {
                      "pointer-events-none opacity-50": isNavigating,
                    })}
                  >
                    <button
                      disabled={isNavigating}
                      className="w-full py-5 bg-bg text-accent font-manrope text-[13px] font-bold tracking-[0.3em] hover:bg-bg/90 transition-all duration-300 uppercase flex items-center justify-center gap-2"
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
