"use client"

import { motion } from "framer-motion"
import { Recycle, ShieldCheck, Truck, Leaf } from "lucide-react"

const FEATURES = [
  {
    icon: <Recycle className="w-7 h-7 text-accent/60" strokeWidth={1.2} />,
    title: "Sustainable Materials",
    description: "We believe great style should never come at the planet's expense. Every piece is thoughtfully sourced."
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-accent/60" strokeWidth={1.2} />,
    title: "Warranty Included",
    description: "Every piece comes with a hassle-free 6-month warranty. Quality you can trust, guaranteed."
  },
  {
    icon: <Truck className="w-7 h-7 text-accent/60" strokeWidth={1.2} />,
    title: "Delivery & Shipping",
    description: "GCC delivery within 3-5 business days. Worldwide delivery within 5-7 business days."
  },
  {
    icon: <Leaf className="w-7 h-7 text-accent/60" strokeWidth={1.2} />,
    title: "Eco-Friendly Fabrics",
    description: "Crafted from certified eco-friendly materials, built to last and kind to the environment."
  }
]

export default function FeaturesSection() {
  return (
    <section className="bg-bg py-24 md:py-32 border-t border-black/5">
      <div className="mx-auto px-6 md:px-12 lg:px-16 max-w-[1440px]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 lg:gap-16"
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
              {/* Icon */}
              <div className="mb-1">{feature.icon}</div>

              <div className="space-y-3">
                {/* Title — overline tier */}
                <h3 className="font-newsreader italic text-[18px] text-center font-semibold text-accent">
                  {feature.title}
                </h3>

                {/* Body tier */}
                <p className="font-manrope text-xs md:text-[14px] text-center font-light leading-relaxed text-accent/60 max-w-[260px]">
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
