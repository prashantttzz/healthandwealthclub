"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

// --- Slide Definitions ---
// Add or remove slides here. 'type: video' uses home-video.mp4
const SLIDES = [
  {
    id: 0,
    type: "video" as const,
    src: "/home-video.mp4",
    poster: "/bg-1.jpg",
    label: "New Collection 2026",
    heading: ["Defining Modern", "Sophistication"],
    headingItalic: [true, false],
    cta: "Shop the Collection",
  },
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
]

const INTERVAL_MS = 8000

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const videoWrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number>(Date.now())

  // --- Parallax Scroll ---
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
            contentRef.current.style.transform = `translateY(${scrollY * -0.8}px)`
          }
          if (scrollIndicatorRef.current) {
            scrollIndicatorRef.current.style.opacity = `${Math.max(0, 0.5 - scrollY / 300)}`
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // --- Auto Advance ---
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

  useEffect(() => {
    // Clear old timers
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (progressRef.current) clearInterval(progressRef.current)

    intervalRef.current = setInterval(nextSlide, INTERVAL_MS)

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      setProgress(Math.min((elapsed / INTERVAL_MS) * 100, 100))
    }, 16)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [nextSlide, activeIndex])

  const slide = SLIDES[activeIndex]

  return (
    <div className="h-[100vh] w-full sticky top-0 z-0 overflow-hidden bg-black">
      {/* --- Background Layer (parallax wrapper) --- */}
      <div
        ref={videoWrapperRef}
        style={{
          willChange: "transform",
          height: "150%",
          top: "-25%",
        }}
        className="absolute left-0 w-full"
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
                key="hero-video"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80"
                poster={slide.poster}
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center opacity-75"
                style={{ backgroundImage: `url('${slide.src}')` }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/60 pointer-events-none z-10" />
      </div>

      {/* --- Content Overlay --- */}
      <div
        ref={contentRef}
        style={{ willChange: "transform" }}
        className="relative z-20 flex flex-col items-center justify-center h-full w-full text-center px-4"
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
            {/* Label */}
            <p className="text-white/70 font-manrope uppercase tracking-[0.45em] text-[10px] sm:text-xs mb-5">
              {slide.label}
            </p>

            {/* Heading */}
            <h1 className="text-white font-newsreader text-5xl sm:text-7xl lg:text-[90px] leading-[1.05] mb-10 max-w-4xl tracking-tighter">
              {slide.heading.map((line, i) => (
                <span key={i} className={`block ${slide.headingItalic[i] ? "italic" : "not-italic"}`}>
                  {line}
                </span>
              ))}
            </h1>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.12)" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 border border-white/40 text-white font-manrope text-[11px] uppercase tracking-[0.25em] transition-colors backdrop-blur-sm"
            >
              {slide.cta}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Bottom Controls --- */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-6 opacity-50"
        style={{ willChange: "opacity" }}
      >
        {/* Dot Navigation */}
        <div className="flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToSlide(i)}
              className="relative flex items-center justify-center w-6 h-6 group"
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-400 ${
                  i === activeIndex
                    ? "w-5 h-[2px] bg-white"
                    : "w-1.5 h-1.5 bg-white/40 group-hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Scroll hint */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent" />
          <span className="text-[9px] text-white uppercase tracking-[0.25em]">Scroll</span>
        </div>
      </div>


    </div>
  )
}

export default Hero