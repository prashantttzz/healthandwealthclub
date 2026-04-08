"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const points = [
  {
    title: "Pioneering Construction",
    description: "Our double-needle stitching utilizes a bespoke high-tensile thread, ensuring seams that maintain their structural integrity for generations.",
  },
  {
    title: "Bespoke Hardware",
    description: "Every drawstring tip is mirror-dipped in aged gold plating, etched with the club monogram for a quiet, textile luxury.",
  },
  {
    title: "Textural Longevity",
    description: "The 600GSM weave undergoes a unique proprietary washing process to achieve a cashmere-like hand-feel without sacrificing weight.",
  },
]

export default function CraftsmanshipSection() {
  return (
    <section className="bg-accent py-20 border-t border-white/5">
      <div className=" mx-auto px-6 md:px-12 lg:px-16">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div className="flex flex-col gap-10">

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="font-newsreader italic text-[clamp(34px,4vw,52px)] leading-[1.1] text-bg tracking-tight"
            >
              The Art of Craftsmanship
            </motion.h2>

            <div className="flex flex-col">
              {points.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="flex flex-col gap-2 py-7 first:pt-0"
                >
                  <p className="font-newsreader italic text-[17px] font-regular text-[#A38E6E]">
                    {point.title}
                  </p>
                  <p className="font-manrope text-[15.5px] leading-[1.7] text-bg/55 max-w-2xl">
                    {point.description}
                  </p>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full overflow-hidden aspect-[5/3]"
          >
            <Image
              src="/about-hero-1.png"
              alt="Craftsmanship Detail"
              fill
              className="object-cover"
            />
          </motion.div>

        </div>

      </div>
    </section>
  )
}