"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, motion, AnimatePresence, useSpring } from "framer-motion";
import Image from "next/image";
import { HttpTypes } from "@medusajs/types";
import Link from "next/link";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { CONTACT_LINKS } from "@lib/constants";

interface CategoryStickyScrollProps {
  collections?: HttpTypes.StoreCollection[];
}

export default function CategoryStickyScroll({ collections = [] }: CategoryStickyScrollProps) {
  const CATEGORIES = [
    { 
      title: "OUR\nSTORY", 
      sub: "The Mission",
      description: "Born from an engineer's obsession with precision and quality, The Health & Wealth Club was created to redefine luxury without the luxury price tag. We believe feeling wealthy isn't about status, it's about substance: premium fabrics, timeless design, and the quiet confidence of knowing you belong to something greater. This isn't just clothing. It's a lifestyle.",
      id: "about-us",
      buttonText:"Join the club",
      link: CONTACT_LINKS.instagram,
      image: "/about-hero-1.png" 
    },
    { 
      title: "WHO\nAM I?", 
      sub: "THE FACE BEHIND IT ALL",
      description: "I'm an engineer refined in London, where modeling with big agencies sharpened my eye for detail and fed my obsession with extraordinary clothing. Knowing the industry's secrets, I set out to deliver high-end finishes and uncompromising quality without the inflated price tags. Now in Abu Dhabi, The Health & Wealth Club is more than fashion, it's a movement, inviting people to wear a mindset of health, wealth, and elegance.",
      id: "founder",
      buttonText:"follow me",
      link: CONTACT_LINKS.tiktok,
      image: "/me.jpeg" 
    },
    { 
      title: "THE\nCONCEPT", 
      sub: "The Health & Wealth Club",
      description: "Our concept is all about delivering an experience that feels bigger than fashion, a lifestyle that pulls people in. Members are greeted by the touch of premium fabrics, the precision of tailored finishes, and the energy of a community that values elegance and authenticity. We combine striking aesthetics, effortless wearability, and uncompromising craftsmanship to create clothing that doesn't just look good, it feels like belonging to something greater.",
      buttonText:"Explore store",
      link:"/store",
      id: "concept",
      image: "/about.png" 
    },
    { 
      title: "WORKING\nWITH US", 
      sub: "The Movement",
      description: "It means joining a movement that redefines luxury. At The Health & Wealth Club, we blend engineering precision with fashion artistry to deliver clothing that feels exclusive yet accessible. Working with us means aligning with a brand that values authenticity, cultural nuance, and uncompromising quality, a partnership that elevates both style and mindset. We also offer custom made pieces upon request, whether in large or small quantities.",
      buttonText:"connect",
      link:"/about",
      id: "collaborate",
      image: "/p-2.png" 
    },
  ]

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
              About us
            </h2>
          </div>
          <p className="font-manrope tracking-widest font-medium text-bg/90 uppercase text-[10px] md:text-[12px] max-w-xl text-center">
            The foundation of our craft, from the engineer&apos;s desk to the streets of Abu Dhabi.
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
                key={item.title + index} 
                className="min-h-[60vh] border-b border-white/20 md:border-none md:min-h-screen flex flex-col justify-center py-10"
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
                  <LocalizedClientLink href={item.link.startsWith('http') ? item.link : `/${item.link.replace(/^\/+/, "")}`} className="group inline-flex items-center gap-4">
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
          Start Your Journey 
          <motion.span className="inline-block ml-2 group-hover:translate-x-2 transition-transform">→</motion.span>
        </LocalizedClientLink>
      </div>
    </section>
  );
}
