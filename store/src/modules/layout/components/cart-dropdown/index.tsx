"use client"

import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { HttpTypes } from "@medusajs/types"
import { useUI } from "@lib/context/ui-context"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import CartSidebar from "@modules/cart/components/cart-sidebar"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const { openCartSidebar } = useUI()
  const pathname = usePathname()
  
  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const itemRef = useRef<number>(totalItems || 0)

  // Automatic open when items are added, but only if not on checkout or already on cart
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/checkout")) {
      openCartSidebar()
    }
    itemRef.current = totalItems
  }, [totalItems, pathname, openCartSidebar])

  return (
    <div className="h-full z-50">
      <button 
        onClick={openCartSidebar}
        className="h-full outline-none flex items-center p-2 relative group text-accent"
      >
        <HugeiconsIcon 
          icon={ShoppingBag01Icon} 
          size={24} 
          className="group-hover:opacity-60 transition-opacity duration-300"
        />
        {totalItems > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center 
                         bg-accent text-bg text-[8px] font-bold
                         h-4 w-4 rounded-full shadow-sm">
            {totalItems}
          </span>
        )}
      </button>
      
      {/* Sidebar is rendered here so it has access to the cart prop */}
      <CartSidebar cart={cartState || null} />
    </div>
  )
}

export default CartDropdown
