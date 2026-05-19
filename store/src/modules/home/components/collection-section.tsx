"use client";

import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import { HttpTypes } from "@medusajs/types";

import { CONTACT_LINKS } from "@lib/constants";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

interface CategoryStickyScrollProps {
  collections?: HttpTypes.StoreCollection[];
}

const CATEGORIES = [
  {
    title: "OUR\nSTORY",
    sub: "The Mission",
    description:
      "Born from an engineer's obsession with precision and quality, The Health & Wealth Club was created to redefine luxury without the luxury price tag. We believe feeling wealthy isn't about status, it's about substance: premium fabrics, timeless design, and the quiet confidence of knowing you belong to something greater. This isn't just clothing. It's a lifestyle.",
    id: "about-us",
    buttonText: "Join the club",
    link: CONTACT_LINKS.instagram,
    image: "/about-hero-1.png",
  },
  {
    title: "WHO\nAM I?",
    sub: "THE FACE BEHIND IT ALL",
    description:
      "I'm an engineer refined in London, where modeling with big agencies sharpened my eye for detail and fed my obsession with extraordinary clothing. Knowing the industry's secrets, I set out to deliver high end finishes and uncompromising quality without the inflated price tags. Now in Abu Dhabi, The Health & Wealth Club is more than fashion, it's a movement, inviting people to wear a mindset of health, wealth, and elegance.",
    id: "founder",
    buttonText: "follow me",
    link: CONTACT_LINKS.tiktok,
    image: "/me.jpeg",
  },
  {
    title: "THE\nCONCEPT",
    sub: "The Health & Wealth Club",
    description:
      "Our concept is all about delivering an experience that feels bigger than fashion, a lifestyle that pulls people in. Members are greeted by the touch of premium fabrics, the precision of tailored finishes, and the energy of a community that values elegance and authenticity. We combine striking aesthetics, effortless wearability, and uncompromising craftsmanship to create clothing that doesn't just look good, it feels like belonging to something greater.",
    id: "concept",
    buttonText: "Explore store",
    link: "/store",
    image: "/about.png",
  },
  {
    title: "WORKING\nWITH US",
    sub: "The Movement",
    description:
      "It means joining a movement that redefines luxury. At The Health & Wealth Club, we blend engineering precision with fashion artistry to deliver clothing that feels exclusive yet accessible. Working with us means aligning with a brand that values authenticity, cultural nuance, and uncompromising quality, a partnership that elevates both style and mindset. We also offer custom made pieces upon request, whether in large or small quantities.",
    id: "collaborate",
    buttonText: "connect",
    link: "/collaborations",
    image: "/p-2.png",
  },
];

export default function CategoryStickyScroll({
  collections = [],
}: CategoryStickyScrollProps) {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  void collections;

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const closestBreakpointIndex = Math.max(
      0,
      Math.min(Math.floor(latest * CATEGORIES.length), CATEGORIES.length - 1)
    );

    if (closestBreakpointIndex !== activeCard) {
      setActiveCard(closestBreakpointIndex);
    }
  });

  return (
    <section id="about-us" className="relative border-t border-black/5 bg-accent">
      <div className="mx-auto max-w-[1400px] px-4 pt-16 sm:px-6 sm:pt-20 md:px-10 md:pb-12 md:pt-24 lg:px-24 xl:px-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-between gap-3 md:mb-5"
        >
          <h2 className="font-newsreader text-4xl italic leading-[0.85] text-bg sm:text-5xl lg:text-7xl">
            About us
          </h2>
          <p className="max-w-xl text-center font-manrope text-[10px] font-medium uppercase tracking-[0.28em] text-bg/90 sm:text-[11px] md:text-[12px]">
            The foundation of our craft, from the engineer&apos;s desk to the
            streets of Abu Dhabi.
          </p>
        </motion.div>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto  px-4 sm:px-6 md:px-10 lg:px-24 xl:px-40"
      >
        <div className="absolute bottom-0 left-5 top-0 hidden w-px bg-bg/5 md:block lg:left-12">
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="h-full w-full origin-top bg-bg"
          />
        </div>

        <div className="flex flex-col gap-8 md:gap-10 lg:flex-row lg:gap-16 xl:gap-24">
          <div className="w-full lg:w-[52%]">
            {CATEGORIES.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="flex min-h-[auto] flex-col justify-center border-b border-white/20 py-10 last:border-b-0 sm:min-h-[70vh] sm:py-12 md:pl-10 lg:min-h-screen lg:border-none lg:py-16 lg:pl-0"
              >
                <div className="mx-auto mb-8 aspect-[4/5] w-full max-w-[20rem] overflow-hidden rounded-sm sm:max-w-[22rem] lg:hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={352}
                    height={440}
                    sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 22rem"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ margin: "-10%" }}
                  className="mx-auto w-full max-w-2xl text-center md:mx-0 md:text-left lg:-mt-28"
                >
                  <span className="mb-2 block font-manrope text-[9px] font-semibold uppercase tracking-[0.3em] text-bg/40 sm:text-[10px]">
                    {item.sub}
                  </span>
                  <h3 className="mt-3 whitespace-pre-line font-newsreader text-[2.75rem] italic leading-[0.95] text-bg sm:text-5xl md:mt-0 md:text-[3.5rem] lg:mb-6 lg:text-7xl">
                    {item.title}
                  </h3>
                  <p className="mb-8 max-w-xl font-manrope text-sm leading-relaxed text-bg/70 sm:text-base lg:mb-10 lg:text-lg">
                    {item.description}
                  </p>
                  <LocalizedClientLink
                    href={
                      item.link.startsWith("http")
                        ? item.link
                        : `/${item.link.replace(/^\/+/, "")}`
                    }
                    className="group inline-flex items-center justify-center gap-4 md:justify-start"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-bg">
                      {item.buttonText}
                    </span>
                    <div className="relative h-px w-10 overflow-hidden bg-bg/20 text-bg">
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

          <div className="hidden lg:block lg:w-[60%]">
            <div className="sticky top-[12vh] h-[67vh] w-full overflow-hidden rounded-sm bg-bg shadow-sm">
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={activeCard}
                  initial={{
                    opacity: 0,
                    scale: 1.05,
                    clipPath: "inset(10% 0% 10% 0%)",
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    clipPath: "inset(0% 0% 0% 0%)",
                  }}
                  exit={{
                    opacity: 0,
                    scale: 1.05,
                    clipPath: "inset(0% 0% 10% 0%)",
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full w-full"
                >
                  <Image
                    src={CATEGORIES[activeCard]?.image || "/placeholder.png"}
                    alt={CATEGORIES[activeCard]?.title || "Category"}
                    fill
                    sizes="(min-width: 1124px) 40vw"
                    priority={activeCard === 0}
                    className="object-cover transition-transform duration-[2s] hover:scale-110"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-black/[0.02]" />
                </motion.div>
              </AnimatePresence>

              <div className="absolute bottom-8 right-8 font-manrope text-[10px] tracking-[.5em] text-white mix-blend-difference">
                0{activeCard + 1} / 0{CATEGORIES.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-black/5 py-5 text-center md:py-24">
        <div className="group text-[12px] font-semibold uppercase tracking-[0.2em] text-bg/80 transition-colors hover:text-bg">
          the health & wealth club
        </div>
      </div>
    </section>
  );
}
