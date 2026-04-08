"use client"

import { motion } from "framer-motion"
import { Recycle, ShieldCheck, Truck, Leaf } from "lucide-react"

const FEATURES = [
  {
    icon: <Recycle className="w-8 h-8 md:w-10 md:h-10 text-accent/80" strokeWidth={1.2} />,
    title: "Sustainable Materials",
    description: "We believe great style shouldn't come at the planet's expense."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-accent/80" strokeWidth={1.2} />,
    title: "Warranty Included",
    description: "Every pair comes with a hassle-free 6-month warranty."
  },
  {
    icon: <Truck className="w-8 h-8 md:w-10 md:h-10 text-accent/80" strokeWidth={1.2} />,
    title: "Delivery & Shipping",
    description: "Your shoes will be dispatched within 1-2 business days."
  },
  {
    icon: <Leaf className="w-8 h-8 md:w-10 md:h-10 text-accent/80" strokeWidth={1.2} />,
    title: "Eco-Friendly Fabrics",
    description: "Crafted with sustainability in mind, eco-friendly fabrics."
  }
]

export default function FeaturesSection() {
  return (
    <section className="bg-bg py-24 md:py-32 border-t border-black/5">
      <div className="content-container mx-auto px-6 lg:px-20">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16"
        >
          {FEATURES.map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="flex flex-col items-center justify-center gap-5"
            >
              <div className="mb-2">
                {feature.icon}
              </div>
              <div className="space-y-3">
                <h3 className="font-newsreader text-center italic text-[11px] md:text-xs font-bold tracking-[0.3em] text-accent">
                  {feature.title}
                </h3>
                <p className="font-manrope text-sm md:text-base font-light leading-relaxed text-accent/70 text-center max-w-[240px]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
