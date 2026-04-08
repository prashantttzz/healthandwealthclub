"use client"

import { motion } from "framer-motion"
import ProductPreview from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"

export const InauguralDrop = ({ products }: { products: HttpTypes.StoreProduct[] }) => {
  return (
    <div className="px-6 md:px-12 lg:px-16 py-20 md:py-32 w-full mx-auto bg-bg">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full items-center justify-center flex flex-col mb-12"
      >
        {/* Overline */}
        <span className="font-manrope text-[10px] tracking-[0.5em] uppercase font-bold text-accent/40 mb-4">
          Explore the Pillars
        </span>

        {/* Heading */}
        <h2 className="font-newsreader italic text-4xl md:text-7xl tracking-tighter text-accent text-center leading-none">
          The Inaugural Drop
        </h2>

        {/* Sub-overline */}
        <p className="font-manrope text-[10px] tracking-[0.5em] uppercase font-bold text-accent/30 mt-4 text-center">
          Intentional Living &amp; Timeless Style
        </p>
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
            <ProductPreview product={product} />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
