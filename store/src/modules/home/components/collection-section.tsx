"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  { 
    title: "Backless\nTops", 
    sub: "The Evening Series",
    description: "Minimalist silhouettes designed for the modern evening. Crafted from premium silk blends that drape effortlessly against the skin.",
    id: "backless-tops",
    image: "/about.png" 
  },
  { 
    title: "DeepSplits\nSkirts", 
    sub: "Architectural Form",
    description: "Movement defined by precision. A bold statement piece for the contemporary wardrobe, featuring hand-finished detailing.",
    id: "deep-split-skirts",
    image: "/about-hero.png" 
  },
  { 
    title: "Bucket\nHats", 
    sub: "Summer Essentials",
    description: "The essential sun-drenched accessory. Reimagined in structured canvas and seasonal tones for the coastal minimalist.",
    id: "bucket-hats",
    image: "/p-1.png" 
  },
  { 
    title: "Wrap\nDresses", 
    sub: "Dusk to Dawn",
    description: "Effortless versatility. Featuring an adjustable fit that celebrates the feminine form with timeless elegance.",
    id: "wrap-dresses",
    image: "/p-2.png" 
  },
];

export default function CategoryStickyScroll() {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth scroll progress for the side indicator
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardLength = CATEGORIES.length;
    const closestBreakpointIndex = Math.min(
      Math.floor(latest * cardLength),
      cardLength - 1
    );
    setActiveCard(closestBreakpointIndex);
  });

  return (
    <section className="bg-accent relative border-t border-black/5">
      <div className="pt-20 md:pt-24 md:pb-12 px-6 lg:px-40 md:max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-3 md:mb-5"
        >
          <div className="space-y-4">
            <h2 className="font-newsreader italic text-5xl lg:text-7xl text-bg leading-[0.85]">
              The Club Shop
            </h2>
          </div>
          <p className="font-manrope tracking-widest font-semibold text-bg/90 uppercase text-[10px] md:text-[12px] max-w-xl text-center">
            A curated selection of seasonal staples designed with an emphasis on silhouette and longevity.
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} className="relative max-w-[1400px] mx-auto px-6 lg:px-40">
                <div className="absolute left-10 lg:left-20 top-0 bottom-0 w-px bg-bg/5 hidden md:block">
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="w-full h-full bg-bg origin-top"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-10 lg:gap-24">
          
          <div className="w-full md:w-1/2">
            {CATEGORIES.map((item, index) => (
              <div 
                key={item.title + index} 
                className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-10 md:py-20"
              >
                <div className="md:hidden w-full max-w-[280px] mx-auto aspect-[4/5] mb-8 overflow-hidden rounded-sm">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ margin: "-20%" }}
                >
                  <span className="font-manrope text-[9px] font-bold tracking-[0.3em] uppercase text-bg/40 mb-2 block">
                    {item.sub}
                  </span>
                  <h3 className="text-5xl lg:text-7xl font-newsreader font-regular italic text-bg leading-[0.95] mb-6">
                    {item.title}
                  </h3>
                  <p className="text-base lg:text-lg font-manrope text-bg/70 max-w-sm mb-10 leading-relaxed">
                    {item.description}
                  </p>
                  <Link href={`/collections/${item.id}`} className="group inline-flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-bg">View Collection</span>
                    <div className="relative h-px w-10 bg-bg/20 overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-accent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </Link>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="hidden md:block md:w-1/2">
            <div className="sticky top-[15vh] h-[70vh] w-full overflow-hidden rounded-sm bg-bg shadow-sm">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeCard}
                  initial={{ opacity: 0, scale: 1.05, clipPath: "inset(10% 0% 10% 0%)" }}
                  animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0, scale: 1.05, clipPath: "inset(0% 0% 10% 0%)" }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={CATEGORIES[activeCard].image}
                    alt={CATEGORIES[activeCard].title}
                    fill
                    sizes="50vw"
                    priority={true} // Crucial for "instant" load
                    className="object-cover transition-transform duration-[2s] hover:scale-110"
                  />
                  {/* Subtle Grain or Gradient Overlay for Texture */}
                  <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
                </motion.div>
              </AnimatePresence>
              
              {/* Counter Indicator */}
              <div className="absolute bottom-8 right-8 mix-blend-difference text-white font-manrope text-[10px] tracking-[.5em]">
                0{activeCard + 1} / 0{CATEGORIES.length}
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="py-5 md:py-24 text-center border-b border-black/5">
        <Link href="/shop-all" className="group text-[11px] font-bold uppercase tracking-[0.2em] text-bg/40 hover:text-bg transition-colors">
          Browse All Departments 
          <motion.span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">→</motion.span>
        </Link>
      </div>
    </section>
  );
}