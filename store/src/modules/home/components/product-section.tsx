"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { HttpTypes } from "@medusajs/types";

const ProductCard = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const image = product.thumbnail || product.images?.[0]?.url || "";
  const handle = product.handle;

  // Get cheapest price from variants
  const price = product.variants
    ?.flatMap((v) => {
      const calc = (v as any).calculated_price
      return calc ? [calc.calculated_amount as number] : []
    })
    .sort((a, b) => a - b)[0]

  const currency =
    (product.variants?.[0] as any)?.calculated_price?.currency_code?.toUpperCase() ?? "AED"

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
      }}
      className="group cursor-pointer"
    >
      <LocalizedClientLink href={`/products/${handle}`} className="block">
        {/* Image */}
        <div className="relative aspect-square bg-neutral-100 overflow-hidden mb-5">
          {image ? (
            <Image
              src={image}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 72vw, (max-width: 1024px) 44vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-accent/5 flex items-center justify-center">
              <span className="font-manrope text-[10px] tracking-[0.3em] text-accent/30 uppercase">No Image</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-2">
          {/* Category */}
          {product.collection?.title && (
            <span className="font-manrope text-[10px] tracking-[0.4em] uppercase font-bold text-accent/40 block">
              {product.collection.title}
            </span>
          )}

          {/* Title and Price row */}
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-newsreader italic text-xl md:text-2xl text-accent leading-tight tracking-tighter group-hover:opacity-60 transition-opacity">
              {product.title}
            </h3>
          </div>

          <div className="flex items-center justify-between pt-1">
            {/* Price */}
            {price !== undefined && (
              <span className="font-manrope text-[14px] font-light text-accent/50">
                {currency} {price.toFixed(2)}
              </span>
            )}

            {/* Color swatches */}
            <div className="flex items-center gap-1.5">
              {product.options
                ?.find(opt => opt.title?.toLowerCase() === "color")
                ?.values?.map((v: any, idx: number) => {
                  const colorMap: Record<string, string> = {
                    olive: "#2C3A2C",
                    cream: "#F8F6F1",
                    white: "#FFFFFF",
                    black: "#1a1a1a",
                    tan: "#D2B48C",
                    navy: "#1a1f2c",
                  }
                  const colorHex = colorMap[v.value.toLowerCase()] || "#cccccc"
                  
                  return (
                    <div
                      key={idx}
                      className="w-3 h-3 rounded-full border border-black/5 shadow-sm"
                      style={{ backgroundColor: colorHex }}
                      title={v.value}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </motion.div>
  );
};

export default function ProductSection({ products }: { products: HttpTypes.StoreProduct[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  if (!products || products.length === 0) return null;

  return (
    <section className="bg-bg py-16 lg:py-24 border-t border-black/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 lg:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="font-manrope text-[10px] tracking-[0.5em] uppercase font-bold text-accent/40 block mb-4">
              Autumn 2024
            </span>
            <h2 className="font-newsreader italic text-4xl md:text-7xl text-accent leading-none tracking-tighter">
              The Collection
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <LocalizedClientLink
              href="/store"
              className="group flex items-center gap-3 text-accent hover:opacity-60 transition-all"
            >
              <span className="font-manrope text-[11px] font-bold tracking-[0.3em] uppercase">View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </LocalizedClientLink>
          </motion.div>
        </div>

        {/* Mobile: carousel */}
        <div className="block md:hidden">
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.slice(0, 8).map((product, index) => (
              <div key={product.id} className="snap-start flex-shrink-0 w-[72vw]">
                <ProductCard product={product} />
              </div>
            ))}
            <div className="flex-shrink-0 w-6" />
          </div>
        </div>

        {/* Desktop: 4-col grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
        >
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}