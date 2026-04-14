"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence, useSpring } from "framer-motion";
import Image from "next/image";
import { HttpTypes } from "@medusajs/types";
import Link from "next/link";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

interface CategoryStickyScrollProps {
  collections: HttpTypes.StoreCollection[];
}

export default function CategoryStickyScroll({ collections = [] }: CategoryStickyScrollProps) {
  // Fallback images if no metadata ones are provided
  const FALLBACK_IMAGES = [
    "/p-1.png",
    "/p-2.png",
    "/about.png",
    "/footer.png"
  ];

  // Map dynamic collections to our card format
  const dynamicCategories = (collections || []).slice(0, 4).map((collection, index) => ({
    title: collection.title.toUpperCase(),
    sub: (collection.metadata?.sub_title as string) || "Essential Collection",
    description: (collection.metadata?.description as string) || "Curated precision from The Health & Wealth Club. Designed for those who value authenticity and quality.",
    id: collection.id,
    handle: collection.handle,
    buttonText: (collection.metadata?.button_text as string) || "Explore Products",
    link: `collections/${collection.handle}`,
    image: (collection.metadata?.image_url as string) || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]
  }));

  // If no collections, don't render the section or show nothing
  if (!dynamicCategories.length) return null;

  // Final array used for rendering
  const CATEGORIES = dynamicCategories;

  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

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
              The Collection
            </h2>
          </div>
          <p className="font-manrope tracking-widest font-medium text-bg/90 uppercase text-[10px] md:text-[12px] max-w-xl text-center">
            Precision engineering meets high-end fashion. Purely curated.
          </p>
        </motion.div>
      </div>

      <div ref={containerRef} className="relative mx-auto px-6 lg:px-40">
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
                key={item.id + index} 
                className="min-h-[60vh] md:min-h-screen flex flex-col justify-center py-10"
              >
                <div className="md:hidden w-full max-w-[280px] mx-auto aspect-[4/5] mb-8 overflow-hidden rounded-sm">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={280}
                    height={350}
                    sizes="280px"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ margin: "-10%" }}
                  className="md:-mt-32 md:text-start text-center"
                >
                  <span className="font-manrope text-[9px] font-semibold tracking-[0.3em] uppercase text-bg/40 mb-2 block">
                    {item.sub}
                  </span>
                  <h3 className="text-5xl lg:text-7xl font-newsreader font-regular italic text-bg leading-[0.95] mb-6 mt-3 md:mt-0 whitespace-pre-line">
                    {item.title}
                  </h3>
                  <p className="text-sm lg:text-lg font-manrope text-bg/70 mb-10 leading-relaxed">
                    {item.description}
                  </p>
                  <LocalizedClientLink href={`/${item.link}`} className="group inline-flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-bg">{item.buttonText}</span>
                    <div className="relative h-px w-10 bg-bg/20 overflow-hidden text-bg">
                      <motion.div 
                        className="absolute inset-0 bg-bg"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                  </LocalizedClientLink>
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
                    priority={activeCard === 0} 
                    className="object-cover transition-transform duration-[2s] hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/[0.02] pointer-events-none" />
                </motion.div>
              </AnimatePresence>
              
              <div className="absolute bottom-8 right-8 mix-blend-difference text-white font-manrope text-[10px] tracking-[.5em]">
                0{activeCard + 1} / 0{CATEGORIES.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-5 md:py-24 text-center border-b border-black/5">
        <LocalizedClientLink href="/store" className="group text-[12px] font-semibold uppercase tracking-[0.2em] text-bg/80 hover:text-bg transition-colors">
          View All Collections
          <motion.span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">→</motion.span>
        </LocalizedClientLink>
      </div>
    </section>
  );
}