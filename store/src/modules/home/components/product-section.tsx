"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const PRODUCTS = [
  {
    id: 1,
    title: 'Heritage Heavyweight Hoodie',
    price: 425,
    category: 'OUTERWEAR',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=987&auto=format&fit=crop',
    colors: ['#2C3A2C', '#F8F6F1', '#1a1a1a'],
  },
  {
    id: 2,
    title: 'Classic Weekend Duffle',
    price: 595,
    category: 'ACCESSORIES',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=987&auto=format&fit=crop',
    colors: ['#D2B48C', '#2C3A2C'],
  },
  {
    id: 3,
    title: 'The Club Monogram Cap',
    price: 145,
    category: 'ACCESSORIES',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1036&auto=format&fit=crop',
    colors: ['#F8F6F1', '#2C3A2C'],
  },
  {
    id: 4,
    title: 'Signature Peak Scarf',
    price: 285,
    category: 'ACCESSORIES',
    image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=987&auto=format&fit=crop',
    colors: ['#2C3A2C', '#F8F6F1', '#C4A962'],
  },
]

const ProductCard = ({ product, index }: { product: typeof PRODUCTS[0], index: number }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
      }}
      className="group cursor-pointer"
    >
      <LocalizedClientLink href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square bg-neutral-100 overflow-hidden mb-6">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/20 transition-all duration-500 flex items-center justify-center">
            <motion.span 
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="font-manrope text-[10px] tracking-[0.2em] font-bold text-bg bg-accent/90 px-6 py-3 uppercase hidden md:block"
            >
              Quick View
            </motion.span>
          </div>
        </div>
        <div className="space-y-2">          
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-newsreader italic text-lg md:text-xl text-accent leading-tight group-hover:opacity-60 transition-opacity">
              {product.title}
            </h3>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-manrope text-sm text-accent/60">
              ${product.price.toFixed(2)} USD
            </span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((color, idx) => (
                <div
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-black/5 shadow-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      </LocalizedClientLink>
    </motion.div>
  );
};

export default function ProductSection() {
  return (
    <section className="bg-bg py-10 lg:py-20 border-t border-black/5 overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-5 lg:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="font-manrope text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-accent/40 block mb-5">
              Autumn 2024
            </span>
            <h2 className="font-newsreader italic text-5xl md:text-7xl text-accent leading-none tracking-tight">
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
              href="/shop"
              className="group flex items-center gap-3 text-accent hover:opacity-60 transition-all"
            >
              <span className="font-manrope text-[11px] font-bold tracking-[0.3em] uppercase">View All</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </LocalizedClientLink>
          </motion.div>
        </div>

        {/* Products Grid */}
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-10%" }}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
        >
          {PRODUCTS.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}