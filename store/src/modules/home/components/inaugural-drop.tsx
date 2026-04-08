"use client"

import { motion } from "framer-motion"
import ProductPreview from "@modules/products/components/product-preview"
import { HttpTypes } from "@medusajs/types"

export const InauguralDrop = ({ products }: { products: HttpTypes.StoreProduct[] }) => {
  return (
    <div className="px-4 md:px-20 py-20 md:py-32 w-full mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full items-center justify-center flex flex-col"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl whitespace-nowrap font-newsreader text-center px-4">
          The <span className="italic">Inaugural Drop</span>
        </h2>
        {/* <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-manrope tracking-widest font-semibold text-black/90 uppercase text-[10px] md:text-[12px] mt-2 text-center max-w-sm md:max-w-none"
        >
          EXPLORE THE PILLARS OF INTENTIONAL LIVING AND TIMELESS STYLE
        </motion.p> */}
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
              delayChildren: 0.3
            }
          }
        }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-12 mt-10"
      >
        {products.map((product) => (
          <motion.li 
            key={product.id} 
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="flex justify-center"
          >
            <ProductPreview product={product} />
          </motion.li>
        ))}
      </motion.ul>
    </div>
  )
}
