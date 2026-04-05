"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

const Hero = () => {
  const imageWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (imageWrapperRef.current) {
            imageWrapperRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`
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
      className="h-[100vh] w-full border-b border-ui-border-base sticky top-0 z-0 overflow-hidden bg-ui-bg-subtle"
    >
      <div 
        ref={imageWrapperRef}
        style={{ 
          willChange: "transform",
          height: "130%",
          marginTop: "-5%"
        }} 
        className="absolute top-0 left-0 w-full"
      >
        <Image 
          src="/bg-1.jpg" 
          alt="hero" 
          className="w-full h-full object-cover" 
          fill
          priority
        />
      </div>
    </div>
  )
}

export default Hero
