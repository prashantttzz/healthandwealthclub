"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import Image from "next/image"


const SLIDES = [
  {
    id: 0,
    type: "video" as const,
    src: "/home-video.mp4",
    label: "New Collection 2026",
    heading: ["Defining Modern", "Sophistication"],
    headingItalic: [true, false],
    cta: "Shop the Collection",
  },
  /*
  {
    id: 1,
    type: "image" as const,
    src: "/about-hero.png",
    label: "Autumn / Winter 2026",
    heading: ["Crafted for", "The Intentional"],
    headingItalic: [true, false],
    cta: "Explore the Edit",
  },
  {
    id: 2,
    type: "image" as const,
    src: "/about.png",
    label: "The Club Lifestyle",
    heading: ["Luxury Lives", "in the Detail"],
    headingItalic: [false, true],
    cta: "Discover More",
  },
  {
    id: 3,
    type: "image" as const,
    src: "/p-1.png",
    label: "Members Only",
    heading: ["Wear Your", "Ambition"],
    headingItalic: [false, true],
    cta: "Join The Club",
  },
  */
]


const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // --- Optimized Framer Motion Parallax ---
  const { scrollY } = useScroll()
  
  // Parallax multipliers
  const videoY = useTransform(scrollY, [0, 1000], [0, 350])
  const contentY = useTransform(scrollY, [0, 1000], [0, -400])
  const controlsOpacity = useTransform(scrollY, [0, 300], [1, 0])

  // --- Video Observation Strategy ---
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [activeIndex])

  // --- Auto Advance Logic ---
  /*
  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index)
    setProgress(0)
    startTimeRef.current = Date.now()
  }, [])

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % SLIDES.length)
    setProgress(0)
    startTimeRef.current = Date.now()
  }, [])
  */

  const currentInterval = SLIDES[activeIndex].type === "video" ? 8000 : 3000

  /*
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)

    intervalRef.current = setInterval(nextSlide, currentInterval)
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      setProgress(Math.min((elapsed / currentInterval) * 100, 100))
    }, 16)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [nextSlide, activeIndex, currentInterval])
  */

  const slide = SLIDES[activeIndex]

  return (
    <section ref={containerRef} className="h-screen w-full sticky top-0 z-0 overflow-hidden bg-black">
      {/* Background Layer (optimized parallax) */}
      <motion.div
        style={{
          y: videoY,
          height: "140%",
          top: "-20%",
        }}
        className="absolute left-0 w-full will-change-transform"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            {slide.type === "video" ? (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80"
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={slide.src}
                alt={slide.label}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center opacity-75"
              />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none z-10" />
      </motion.div>

      {/* Content Overlay (optimized parallax) */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-20 flex flex-col items-center justify-center h-full w-full text-center px-4 will-change-transform"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-white/70 font-manrope uppercase tracking-[0.45em] text-[10px] sm:text-xs mb-5">
              {slide.label}
            </p>
            <h1 className="text-white font-newsreader text-5xl sm:text-7xl lg:text-[100px] font-medium italic leading-[1.0] mb-10 max-w-5xl tracking-tighter">
              {slide.heading.map((line, i) => (
                <span key={i} className={`block ${slide.headingItalic[i] ? "italic" : "not-italic"}`}>
                  {line}
                </span>
              ))}
            </h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 border border-white/20 text-white font-manrope text-[11px] uppercase tracking-[0.3em] backdrop-blur-sm hover:bg-white hover:text-black transition-all duration-500"
            >
              {slide.cta}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Bottom Controls (optimized scroll link) */}
      <motion.div
        style={{ opacity: controlsOpacity }}
        className="absolute bottom-20 left-0 right-0 z-20 flex flex-col items-center gap-8"
      >
        {/* 
        <div className="flex items-center gap-4">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToSlide(i)}
              className="relative flex items-center justify-center p-2"
            >
              <div className={`h-[2px] transition-all duration-700 rounded-full ${i === activeIndex ? "w-8 bg-white" : "w-2 bg-white/30"}`} />
            </button>
          ))}
        </div>
        */}
        {/* <div className="flex flex-col items-center gap-3">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" 
          />
          <span className="text-[10px] text-white/50 uppercase font-manrope font-medium tracking-[0.4em]">Scroll to Explore</span>
        </div> */}
      </motion.div>
    </section>
  )
}

export default Hero