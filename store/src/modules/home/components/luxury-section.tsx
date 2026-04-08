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
      className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] bg-black flex items-center justify-center relative overflow-hidden"
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

        {/* <motion.p
          className="text-white/90 font-manrope text-xs sm:text-sm lg:text-sm font-light  leading-relaxed max-w-xl mx-auto "
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
        </motion.p> */}
      <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 items-center    justify-center"
        >
          <motion.button 
            whileHover={{ scale: 1.02}}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white text-black border border-white/30  font-gilda text-sm uppercase tracking-widest transition-colors"
          >
            Shop the Collection
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border border-white/30 text-white font-gilda text-sm uppercase tracking-widest transition-colors"
          >
            Learn Our Story
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}