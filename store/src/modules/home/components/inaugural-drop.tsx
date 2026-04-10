"use client"

import { motion } from "framer-motion"
import ProductPreview from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

export const InauguralDrop = ({ products }: { products: HttpTypes.StoreProduct[] }) => {
  if (!products || products.length === 0) return null

  return (
    <div className="px-6 md:px-12 lg:px-16 py-20 md:py-32 w-full mx-auto bg-bg border-t border-black/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full items-center justify-center flex flex-col mb-12"
      >
        {/* Overline */}
        <span className="font-manrope text-[10px] tracking-[0.2em] uppercase font-bold text-accent/70 mb-4">
          Explore the Pillars
        </span>

        {/* Heading */}
        <h2 className="font-newsreader italic text-4xl md:text-7xl tracking-tighter text-accent text-center leading-none">
          The Inaugural Drop
        </h2>

      </motion.div>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-5%" }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8"
      >
        {products.map((product) => (
          <motion.li
            key={product.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
          >
            <LocalizedClientLink
              href={`/products/${product.handle}`}
              className="group block w-full"
            >
              <div data-testid="product-wrapper" className="relative flex flex-col ">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F9F6F2]">
                  <Image
                    src={product.thumbnail || ""}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <button className="w-full bg-accent text-bg text-xs md:text-sm uppercase font-newsreader h-10 justify-center items-center flex gap-5 ">Shop Now <ArrowRight className="h-3 w-3"/></button>
                </div>
            </LocalizedClientLink>          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}