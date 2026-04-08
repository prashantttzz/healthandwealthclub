"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function CraftsmanshipSection() {
  const points = [
    {
      title: "Pioneering Construction",
      description: "Our double-needle stitching utilizes a bespoke high-tensile thread, ensuring seams that maintain their structural integrity for generations."
    },
    {
      title: "Bespoke Hardware",
      description: "Every drawstring tip is mirror-dipped in aged gold plating, etched with the club monogram for a quiet, textile luxury."
    },
    {
      title: "Textural Longevity",
      description: "The 600GSM weave undergoes a unique proprietary washing process to achieve a cashmere-like hand-feel without sacrificing weight."
    }
  ]

  return (
    <section className="bg-accent py-24 lg:py-40 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Vertically Stacked Narrative */}
        <div className="space-y-16 lg:space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-newsreader italic text-6xl lg:text-[80px] leading-tight text-bg tracking-tighter">
              The Art of Craftsmanship
            </h2>
          </motion.div>

          <div className="space-y-12">
            {points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="space-y-3"
              >
                <h3 className="font-manrope text-[11px] tracking-[0.2em] uppercase font-bold text-[#A38E6E]">
                  {point.title}
                </h3>
                <p className="font-manrope text-[15px] leading-relaxed font-regular text-bg/70 max-w-md">
                  {point.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Large Cinematic Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] lg:aspect-[4/5] w-full overflow-hidden"
        >
          <Image
            src="/about-hero-1.png"
            alt="Craftsmanship Detail"
            fill
            className="object-cover grayscale-[40%]"
          />
          <div className="absolute inset-0 bg-accent/10" />
        </motion.div>
      </div>
    </section>
  )
}
