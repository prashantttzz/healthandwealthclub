"use client"

import { useRef } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion"

export default function LuxurySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" })

  /* ── Parallax ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const rawY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"])
  const imageY = useSpring(rawY, { stiffness: 55, damping: 20, mass: 0.8 })

  return (
    <section
      ref={sectionRef}
      className="w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] bg-black flex items-center justify-center relative overflow-hidden"
    >
      {/* Parallax image */}
      <motion.div
        style={{
          y: imageY,
          position: "absolute",
          top: "-15%",
          bottom: "-15%",
          left: 0,
          right: 0,
          willChange: "transform",
        }}
      >
        <Image
          src="/bg-2.jpg"
          alt="Luxury background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50 pointer-events-none z-[1]" />

      <div className="text-center z-10 space-y-4 px-6 max-w-4xl relative">

        <motion.p
          className="text-white/60 font-manrope text-[10px] uppercase tracking-[0.4em] mb-2 sm:mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Uncompromising Craftsmanship
        </motion.p>

        {/* Headline */}
        <div style={{ overflow: "hidden" }}>
          <motion.h2
            className="text-white font-newsreader text-4xl sm:text-6xl lg:text-8xl italic font-light tracking-tighter leading-none"
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            Luxury in <span className="not-italic">Motion</span>
          </motion.h2>
        </div>

        {/* Gold divider */}
        <motion.div
          className="flex items-center justify-center gap-3 py-1"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <motion.div
            className="h-px origin-right"
            style={{ width: 48, background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.7))" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          />
          <motion.div
            className="h-1.5 w-1.5 flex-shrink-0"
            style={{ background: "#c9a84c" }}
            initial={{ opacity: 0, rotate: 0, scale: 0 }}
            whileInView={{ opacity: 1, rotate: 45, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.7 }}
          />
          <motion.div
            className="h-px origin-left"
            style={{ width: 48, background: "linear-gradient(90deg, rgba(201,168,76,0.7), transparent)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          />
        </motion.div>

        {/* Body copy */}
        <motion.p
          className="text-white/90 font-manrope text-xs sm:text-sm lg:text-base font-light tracking-[0.12em] leading-relaxed max-w-xl mx-auto uppercase"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.55 }}
        >
          premium fabric, timeless design and the quiet confidence{" "}
          <br className="hidden sm:block" />
          of knowing you belong to something greater.{" "}
          <br className="hidden sm:block" />
          this isn&apos;t just clothing, it&apos;s a lifestyle.
        </motion.p>

        {/* Subtitle / CTA row */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden px-8 py-3 font-manrope text-[10px] uppercase tracking-[0.32em] text-white"
            style={{ background: "linear-gradient(135deg, #e8d5a3, #c9a84c)" }}
          >
            <motion.span
              className="absolute inset-0 bg-accent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.38 }}
            />
            <span className="relative z-10">Shop the Collection</span>
          </motion.button>

          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380 }}
            className="flex items-center gap-2 font-manrope text-[10px] uppercase tracking-[0.35em] text-white/55 hover:text-white/90 transition-colors duration-300"
          >
            Learn our story
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M1 5.5h9M6 1.5l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}