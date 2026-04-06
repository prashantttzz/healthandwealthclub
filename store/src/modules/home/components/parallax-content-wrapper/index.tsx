"use client"

import React from "react"

export default function ParallaxContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className="relative w-full z-10 bg-bg px-0 shadow-[0_-50px_100px_rgba(0,0,0,0.15)]"
    >
      {children}
    </div>
  )
}
