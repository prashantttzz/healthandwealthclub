"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const points = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8h12M8 2v12" />
        <circle cx="8" cy="8" r="6" />
      </svg>
    ),
    title: "Pioneering Construction",
    description: "Our double-needle stitching utilizes a bespoke high-tensile thread, ensuring seams that maintain their structural integrity for generations.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="8,1 10,6 15,6 11,9.5 12.5,14.5 8,11.5 3.5,14.5 5,9.5 1,6 6,6" />
      </svg>
    ),
    title: "Bespoke Hardware",
    description: "Every drawstring tip is mirror-dipped in aged gold plating, etched with the club monogram for a quiet, textile luxury.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 13c0-3 2-5 5-5s5 2 5 5" />
        <path d="M8 8V3" />
        <path d="M5 5l3-3 3 3" />
      </svg>
    ),
    title: "Textural Longevity",
    description: "The 600GSM weave undergoes a unique proprietary washing process to achieve a cashmere-like hand-feel without sacrificing weight.",
  },
]

export default function CraftsmanshipSection() {
  return (
    <section className="bg-accent py-20 lg:py-28 border-t border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

        {/* Left */}
        <div className="flex flex-col gap-14">

          {/* Eyebrow + Heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="flex flex-col gap-4"
          >
            <span className="font-manrope text-[10px] tracking-[0.22em] uppercase text-[#A38E6E] font-semibold">
              Our Standards
            </span>
            <h2 className="font-newsreader italic text-[clamp(38px,4.5vw,58px)] leading-[1.1] text-bg tracking-tight">
              The Art of<br />Craftsmanship
            </h2>
            <p className="font-manrope text-[14px] leading-relaxed text-bg/50 max-w-sm mt-1">
              Every detail is considered. Every material is chosen with intent. Built to last, designed to feel.
            </p>
          </motion.div>

          {/* Divider */}
          <div className="w-full h-px bg-white/8" />

          {/* Points */}
          <div className="flex flex-col gap-8">
            {points.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="flex items-start gap-4"
              >
                {/* Icon bubble */}
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#A38E6E]">
                  {point.icon}
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="font-manrope text-[10px] tracking-[0.18em] uppercase font-semibold text-[#A38E6E]">
                    {point.title}
                  </p>
                  <p className="font-manrope text-[14px] leading-relaxed text-bg/55 max-w-[360px]">
                    {point.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>

        {/* Right — Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full overflow-hidden"
          style={{ aspectRatio: "4/5" }}
        >
          <Image
            src="/about-hero-1.png"
            alt="Craftsmanship Detail"
            fill
            className="object-cover grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-accent/10" />

          {/* Caption tag */}
          <div className="absolute bottom-5 left-5 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#A38E6E]" />
            <span className="font-manrope text-[10px] tracking-[0.15em] uppercase text-bg/40">
              600GSM · Hand Finished
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  )
}