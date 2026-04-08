"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

const PRODUCTS = [
  { 
    title: "Heritage Heavyweight Hoodie", 
    details: "DEEP OLIVE • COTTON LOOPBACK",
    id: "heritage-hoodie-1",
    image: "/about-hero.png", 
    price: "$240",
    isNew: true,
    colors: ["#2D3628", "#2E2E2E", "#E5E2D9"]
  },
  { 
    title: "Heritage Heavyweight Hoodie", 
    details: "DEEP OLIVE • COTTON LOOPBACK",
    id: "heritage-hoodie-2",
    image: "/about.png",
    price: "$240",
    isNew: true,
    colors: ["#2D3628", "#2E2E2E", "#E5E2D9"]
  },
  { 
    title: "Heritage Heavyweight Hoodie", 
    details: "DEEP OLIVE • COTTON LOOPBACK",
    id: "heritage-hoodie-3",
    image: "/p-1.png",
    price: "$240",
    isNew: true,
    colors: ["#2D3628", "#2E2E2E", "#E5E2D9"]
  },
  { 
    title: "Heritage Heavyweight Hoodie", 
    details: "DEEP OLIVE • COTTON LOOPBACK",
    id: "heritage-hoodie-4",
    image: "/p-2.png",
    price: "$240",
    isNew: true,
    colors: ["#2D3628", "#2E2E2E", "#E5E2D9"]
  },
];

const ProductCard = ({ product }: { product: typeof PRODUCTS[0] }) => {
  const [selectedColor, setSelectedColor] = useState(0);

  return (
    <motion.div 
      className="flex-shrink-0 w-[75vw] md:w-[380px] group cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8 }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-bg">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex gap-2.5 items-center">
          {product.colors.map((color, idx) => (
            <motion.div 
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(idx);
              }}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              className={`w-5 h-5 rounded-[5px] flex items-center justify-center transition-all duration-300 ${selectedColor === idx ? 'ring-1 ring-black/20 ring-offset-2' : ''}`}
            >
              <div 
                className="w-full h-full rounded-[10px] border border-black/5 shadow-sm"
                style={{ backgroundColor: color }}
              />
            </motion.div>
          ))}
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-baseline">
            <h3 className="font-newsreader italic text-lg md:text-xl text-accent tracking-tight group-hover:underline decoration-black/20 underline-offset-4 decoration-1 transition-all">
              {product.title}
            </h3>
            <span className="font-manrope text-sm text-accent">
              {product.price}
            </span>
          </div>
          <p className="font-manrope text-[10px] md:text-[9px] font-bold tracking-[0.1em] uppercase text-accent ">
            {product.details}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProductSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-bg py-20 border-t border-black/5 overflow-hidden">
      <div className="max-w-[1500px]  mx-auto px-6 lg:px-20">
        
        <div className="flex flex-col items-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-4"
          >
            <h2 className="font-newsreader italic text-5xl md:text-7xl lg:text-8xl text-accent  leading-none tracking-tight">
              Our Products
            </h2>
            <p className="font-manrope tracking-[0.3em] font-semibold text-accent uppercase text-[10px] md:text-[12px] max-w-xl mx-auto">
              A curated selection of seasonal staples designed with an emphasis on silhouette and longevity.
            </p>
          </motion.div>

          <div className="flex  justify-end  w-full gap-6 my-10">
            <button 
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border border-black/10 flex items-center justify-center transition-all duration-300 ${!canScrollLeft ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#1A2E22] hover:text-white hover:border-[#1A2E22] active:scale-95'}`}
            >
              <ArrowLeft size={18} strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border border-black/10 flex items-center justify-center transition-all duration-300 ${!canScrollRight ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#1A2E22] hover:text-white hover:border-[#1A2E22] active:scale-95'}`}
            >
              <ArrowRight size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {PRODUCTS.map((product) => (
            <div key={product.id} className="snap-start">
              <ProductCard product={product} />
            </div>
          ))}
          
          {/* Edge Padding */}
          <div className="flex-shrink-0 w-6 md:hidden" />
        </div>

      </div>
    </section>
  );
}