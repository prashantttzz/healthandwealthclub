"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import Image from "next/image"
import { motion } from "framer-motion"
import LocalizedPrice from "@modules/common/components/localized-price"

export default function CustomOrderSection() {
  
  return (
    <section className="relative w-full bg-accent overflow-hidden mt-24 py-10 flex flex-col items-center">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[60%] h-full opacity-[0.03] pointer-events-none select-none">
        <span className="font-newsreader italic text-[40vw] leading-none absolute -top-20 -right-20 text-bg">
          Bespoke
        </span>
      </div>

      <div className="relative z-10 w-full  px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Image with Parallax & Frame */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: "-100px" }}
            className="lg:col-span-5 relative group"
          >
            <div className="relative aspect-[4/5] md:aspect-[1.2/1] lg:aspect-[4/5] w-full overflow-hidden shadow-2xl rounded-sm">
              <motion.div
                initial={{ scale: 1.2 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="w-full h-full"
              >
                <Image
                  src="/bespoke.png"
                  alt="Bespoke Craftsmanship"
                  fill
                  className="object-cover brightness-90 contrast-110"
                />
              </motion.div>
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#162917]/40 to-transparent" />
            </div>

            {/* Floating Atelier Label */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -right-4 md:right-10 bg-bg text-[#162917] px-6 py-4 shadow-2xl flex flex-col gap-1 rounded-sm"
            >
              <span className="font-manrope text-[10px] font-accent tracking-[0.4em] uppercase">Atelier Edition</span>
              <span className="font-newsreader italic text-xs opacity-60">Handcrafted in our UAE workshop</span>
            </motion.div>
          </motion.div>

          {/* Right Column: Content */}
          <div className="lg:col-span-7 flex flex-col items-start gap-8 lg:pl-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="font-manrope text-[10px] font-bold tracking-[0.5em] uppercase text-white/40 block">
                The Heritage Program
              </span>

              <h2 className="font-newsreader italic text-5xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tight">
                Crafting <br /> Your Legacy
              </h2>

              <p className="font-manrope text-sm md:text-base text-white/60 leading-relaxed max-w-lg mt-6">
                Redefine luxury with our bespoke tailoring service. Every piece is a unique dialogue between our artisans and your vision, ensuring a silhouette that is as individual as your fingerprint.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6 w-full"
            >
              <LocalizedClientLink
                href="/customer-service#contact"
                className="group relative inline-flex items-center gap-4 bg-bg text-[#162917] px-10 py-5  overflow-hidden transition-all duration-500 hover:pr-14 active:scale-95"
              >
                <span className="relative z-10 font-manrope text-[11px] font-black tracking-[0.2em] uppercase">
                  Customize
                </span>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={16}
                  className="relative z-10 group-hover:rotate-45 transition-transform duration-500"
                />
              </LocalizedClientLink>

              <div className="flex flex-col gap-1">
                <span className="font-newsreader italic text-lg text-white/80">
                  Customization starts from <LocalizedPrice amount={100}/>
                </span>
                <span className="font-manrope text-[9px] font-bold tracking-[0.2em] uppercase text-white/30">
                  *Delivery within 21 business days
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
