"use client"

import { useEffect, useRef } from "react"

export default function ParallaxContentWrapper({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.style.transform = `translateY(${window.scrollY * -0.15}px)`
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial position

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div 
      ref={contentRef}
      className="relative w-full m z-10 bg-bg px-0 shadow-[0_-50px_100px_rgba(0,0,0,0.15)]"
      style={{ 
        willChange: "transform"
      }}
    >
      {children}
    </div>
  )
}
