"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const Hero = () => {
  const videoWrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY
          if (videoWrapperRef.current) {
            videoWrapperRef.current.style.transform = `translateY(${scrollY * 0.35}px)`
          }
          if (contentRef.current) {
            contentRef.current.style.transform = `translateY(${scrollY * -1.0}px)`
          }
          if (scrollIndicatorRef.current) {
            scrollIndicatorRef.current.style.transform = `translateY(${scrollY * -1.2}px)`
            scrollIndicatorRef.current.style.opacity = `${Math.max(0, 0.5 - scrollY / 300)}`
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() 

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div 
      className="h-[100vh] w-full border-b border-ui-border-base sticky top-0 z-0 overflow-hidden bg-black"
    >
      {/* --- Video Background Section --- */}
      <div 
        ref={videoWrapperRef}
        style={{ 
          willChange: "transform",
          height: "150%", 
          top: "-40%",
          marginTop: "0"
        }} 
        className="absolute left-0 w-full"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-70"
          poster="/bg-1.jpg" 
        >
          <source src="/home-video.mp4" type="video/mp4" />
        </video>
        
        {/* Subtle vignette for luxury feel */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* --- Centered Content Overlay --- */}
      <div 
        ref={contentRef}
        style={{ willChange: "transform" }}
        className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center px-4"
      >
        
        {/* Subtitle / Category */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-white/80 font-manrope uppercase tracking-[0.4em] text-[10px] sm:text-xs mb-4"
        >
          New Collection 2026
        </motion.p>

        {/* Main Heading - Using a Serif font for luxury */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-white font-newsreader text-5xl sm:text-7xl lg:text-8xl leading-[1.1] mb-8 max-w-4xl tracking-tighter italic"
        >
          Defining Modern <br /> 
          <span className="not-italic">Sophistication</span>
        </motion.h1>

        {/* Short Sub-description */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/70 font-manrope text-sm sm:text-base max-w-lg mb-10 font-light leading-relaxed"
        >
          Experience the intersection of uncompromising craftsmanship and effortless luxury. Tailored for those who live with intention.
        </motion.p>

        {/* CTA Button Group */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative px-8 py-4 bg-white text-black font-gilda text-sm uppercase tracking-widest flex items-center gap-3 transition-all hover:pr-12"
          >
            Shop the Collection
            <ArrowRight className="w-4 h-4 absolute right-4 opacity-0 group-hover:opacity-100 transition-all" />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border border-white/30 text-white font-gilda text-sm uppercase tracking-widest transition-colors"
          >
            Our Story
          </motion.button>
        </motion.div>

      </div>

      {/* --- Scroll Indicator (Luxury Detail) --- */}
      <div 
        ref={scrollIndicatorRef}
        style={{ willChange: "transform" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        <span className="text-[10px] text-white uppercase tracking-[0.2em]">Scroll</span>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default Hero