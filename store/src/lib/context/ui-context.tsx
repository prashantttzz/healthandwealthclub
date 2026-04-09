"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import { usePathname } from "next/navigation"

interface UIContextType {
  isCartSidebarOpen: boolean
  openCartSidebar: () => void
  closeCartSidebar: () => void
  toggleCartSidebar: () => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartSidebarOpen, setIsCartSidebarOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsCartSidebarOpen(false)
  }, [pathname])

  const openCartSidebar = useCallback(() => setIsCartSidebarOpen(true), [])
  const closeCartSidebar = useCallback(() => setIsCartSidebarOpen(false), [])
  const toggleCartSidebar = useCallback(() => setIsCartSidebarOpen(prev => !prev), [])

  return (
    <UIContext.Provider
      value={{
        isCartSidebarOpen,
        openCartSidebar,
        closeCartSidebar,
        toggleCartSidebar,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}

export const useUI = () => {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider")
  }
  return context
}
