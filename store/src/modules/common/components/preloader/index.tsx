"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Sync with your original 1s timeout
    const timer = setTimeout(() => {
      setIsLoading(false)
      document.body.style.overflow = "visible"
    }, 1500) // 1s wait + 0.5s exit animation buffer

    document.body.style.overflow = "hidden"

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "visible"
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <>
          {/* Luxury Frame - Replicated from your CSS */}
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-[20px] md:inset-[20px] border border-white/15 pointer-events-none z-[10001]"
          />

          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#1b2929] overflow-hidden"
          >
            {/* Shimmer & Logo Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { duration: 0.8, ease: "easeOut" } 
              }}
              className="relative overflow-hidden flex justify-center items-center"
            >
              <Image
                src="/board_page-0002.jpg"
                alt="The Health & Wealth Club"
                width={500}
                height={500}
                priority
                className="w-full h-auto object-contain transform scale-[1.3] md:scale-100"
              />
              
              {/* SPECULAR SHINE EFFECT - Isolated to text via luminance mask */}
              <motion.div
                initial={{ x: "-100%", skewX: -20 }}
                animate={{ 
                  x: "200%",
                  transition: { 
                    duration: 2.5, 
                    repeat: Infinity, 
                    repeatDelay: 1,
                    ease: "easeInOut" 
                  }
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-full h-full pointer-events-none mix-blend-overlay"
                style={{
                  WebkitMaskImage: "url(/board_page-0002.jpg)",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center"
                }}
              />
              
              <motion.div
                initial={{ x: "-100%", skewX: -20 }}
                animate={{ 
                  x: "200%",
                  transition: { 
                    duration: 2.5, 
                    repeat: Infinity, 
                    repeatDelay: 1,
                    ease: "easeInOut",
                    delay: 0.1
                  }
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[50%] h-full pointer-events-none mix-blend-screen"
                style={{
                  WebkitMaskImage: "url(/board_page-0002.jpg)",
                  WebkitMaskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskPosition: "center"
                }}
              />
            </motion.div>

            {/* Subtle Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}