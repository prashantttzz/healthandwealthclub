"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Hide preloader after 2.2s
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Unlock scroll after loading
      document.body.style.overflow = "auto"
    }, 2200)

    // Lock scroll during loading
    document.body.style.overflow = "hidden"

    return () => {
      clearTimeout(timer)
      document.body.style.overflow = "auto"
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100%",
            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-accent overflow-hidden"
        >
          <div className="relative flex flex-col items-center">
            {/* Visual Brand Zoom */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } 
              }}
              exit={{ 
                opacity: 0,
                scale: 1.2,
                transition: { duration: 0.8, ease: "easeInOut" }
              }}
              className="flex flex-col items-center gap-4"
            >
              <h1 className="font-newsreader italic text-6xl md:text-8xl text-bg tracking-tighter">
                The Club
              </h1>
              
              {/* Animated Progress Bar */}
              <div className="w-24 h-[1px] bg-bg/10 relative overflow-hidden mt-4">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ 
                    duration: 1.8, 
                    ease: "easeInOut",
                    repeat: 0
                  }}
                  className="absolute inset-0 bg-bg"
                />
              </div>
            </motion.div>

            {/* Subtle Texture/Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
