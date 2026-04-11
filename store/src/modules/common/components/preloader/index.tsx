"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("hasSeenPreloader")
    
    if (hasSeen) {
      setHasChecked(true)
      return
    }

    // First time in session
    setIsVisible(true)
    setHasChecked(true)
    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem("hasSeenPreloader", "true")
      document.body.style.overflow = "visible"
    }, 2000)

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "visible"
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
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
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#162917] overflow-hidden"
          >
            {/* Shimmer & Logo Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                webkitMaskPosition: ["150%", "-50%"],
              }}
              transition={{
                webkitMaskPosition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                },
                default: { duration: 1.5, ease: "easeOut" }
              }}
              style={{
                WebkitMaskImage: "linear-gradient(-75deg, rgba(0,0,0,1) 40%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,1) 60%)",
                WebkitMaskSize: "300%",
              }}
              className="relative w-[80%] max-w-[500px] md:w-[70%] md:max-center flex justify-center items-center"
            >
              <Image
                src="/loader.webp"
                alt="The Health & Wealth Club"
                width={500}
                height={500}
                priority
                className="w-full h-auto object-contain transform scale-[0.8] md:scale-100"
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