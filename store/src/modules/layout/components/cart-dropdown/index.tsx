"use client"

import { useCart } from "@lib/context/cart-context"
import { ShoppingBag01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useUI } from "@lib/context/ui-context"

const CartDropdown = () => {
  const { totalItems } = useCart()
  const { openCartSidebar } = useUI()

  return (
    <div className="relative h-full flex items-center">
      <button 
        className="group relative flex items-center"
        onClick={openCartSidebar}
      >
        <div className="p-2.5 rounded-full opacity-80 bg-current/5   group-hover:opacity-100 transition-all duration-500">
          <HugeiconsIcon 
            icon={ShoppingBag01Icon} 
            size={20} 
            className=" transition-colors duration-500"
          />
        </div>
        
        {totalItems > 0 && (
          <div className="absolute -top-0 -right-0 w-4 h-4 bg-accent rounded-full  flex items-center justify-center animate-in zoom-in duration-300">
            <span className="text-[8px] font-bold text-bg font-manrope">
              {totalItems}
            </span>
          </div>
        )}
      </button>
    </div>
  )
}

export default CartDropdown
