"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Instagram, Mail, WhatsappFreeIcons, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Image from "next/image";

export default function ClubFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile to speed up animation
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 120 : 80, // Faster response on mobile
    damping: isMobile ? 20 : 25,
    restDelta: 0.001,
  });

  // ANIMATION: Faster "pop" on mobile (completes by 50% scroll vs 80% on desktop)
  const endThreshold = isMobile ? 0.5 : 0.8;
  const scale = useTransform(smoothProgress, [0, endThreshold], [0.8, 1]);
  const borderRadius = useTransform(smoothProgress, [0, endThreshold], ["32px", "0px"]);
  const imageY = useTransform(smoothProgress, [0, 1], ["-10%", "0%"]);
  
  const buttonOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1]);

  return (
    <div ref={containerRef} className="relative w-full z-20 bg-bg">
      {/* --- EXPANDING HERO SECTION --- */}
      {/* Removed bottom padding to close gap with footer */}
      <section className="relative h-[60vh] md:h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          style={{ 
            scale, 
            borderRadius,
            width: "100%",
            height: "100%"
          }}
          className="relative z-0 overflow-hidden origin-bottom md:origin-center"
        >
          <motion.div
            style={{ y: imageY }}
            className="absolute -inset-y-32 inset-x-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/footer.png')" }}
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          {/* Hero Content Over Image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <motion.div className="text-center px-4">
              <span className="font-manrope text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase mb-3 block opacity-70">
                LIFESTYLE COLLECTIVE
              </span>
              <h2 className="font-newsreader italic text-5xl sm:text-8xl md:text-[140px] leading-tight tracking-tighter mb-8 md:mb-12">
                The Club
              </h2>
              
              <motion.div style={{ opacity: buttonOpacity }}>
                <LocalizedClientLink 
                    href="/join"
                    className="group inline-flex items-center gap-3 bg-white text-black md:bg-white/10 md:text-white md:backdrop-blur-md border border-white/20 px-6 py-3 md:px-8 md:py-4 rounded-full transition-all hover:bg-white hover:text-black"
                >
                    <span className="font-manrope text-[10px] md:text-xs font-bold tracking-widest uppercase">
                        Become a Member
                    </span>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} className="group-hover:rotate-45 transition-transform" />
                </LocalizedClientLink>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER CONTENT --- */}
      {/* pt-0 or mt-[-1px] ensures no physical gap between image and footer */}
      <footer className="bg-accent relative text-white pt-16 md:pt-10 pb-10 px-6 sm:px-12 lg:px-16 font-light -mt-1">
        <div className="max-w-[1440px] mx-auto">
          {/* Responsive Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
            
            {/* Column 1: Brand - Centered on mobile */}
            <div className="flex flex-col items-center sm:items-start space-y-6 text-center sm:text-left">
              <LocalizedClientLink href="/">
                <Image 
                  src="/main-logo-h.png" 
                  alt="logo" 
                  height={150} 
                  width={200} 
                  className="brightness-0 invert object-contain"
                />
              </LocalizedClientLink>
              <p className="text-white/50 text-[13px] leading-relaxed max-w-[240px] font-manrope">
                Elevating your lifestyle through a curated blend of health and wealth essentials.
              </p>
            </div>

            {/* Column 2: Navigation */}
            <div className="flex flex-col items-center sm:items-start space-y-6 text-center sm:text-left">
              <h4 className="font-newsreader text-lg italic text-white/90">Shop</h4>
              <ul className="flex flex-col gap-4 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
                <li><LocalizedClientLink href="/shop" className="hover:text-white transition-colors">Collection</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/new-arrivals" className="hover:text-white transition-colors">New Arrivals</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/best-sellers" className="hover:text-white transition-colors">Best Sellers</LocalizedClientLink></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="flex flex-col items-center sm:items-start space-y-6 text-center sm:text-left">
              <h4 className="font-newsreader text-lg italic text-white/90">Club Support</h4>
              <ul className="flex flex-col gap-4 text-[11px] font-bold tracking-[0.2em] uppercase text-white/40">
                <li><LocalizedClientLink href="/about" className="hover:text-white transition-colors">Our Ethos</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/contact" className="hover:text-white transition-colors">Get in Touch</LocalizedClientLink></li>
                <li><LocalizedClientLink href="/shipping" className="hover:text-white transition-colors">Shipping</LocalizedClientLink></li>
              </ul>
            </div>

            {/* Column 4: Community - Full width on mobile */}
            <div className="flex flex-col items-center lg:items-end lg:text-right space-y-6 text-center lg:text-right">
              <h4 className="font-manrope text-[11px] font-bold tracking-[0.3em] uppercase text-white">
                JOIN THE COMMUNITY
              </h4>
              <p className="text-[13px] font-manrope text-white/40 max-w-[280px]">
                Follow our journey exclusively on social.
              </p>
              
              <div className="flex gap-4">
                {[
                  { icon: Instagram, href: "#" },
                  { icon: WhatsappFreeIcons, href: "#" },
                  { icon: Mail, href: "mailto:contact@healthandwealth.club" }
                ].map((social, i) => (
                  <motion.a 
                    key={i}
                    whileTap={{ scale: 0.9 }}
                    href={social.href} 
                    className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full"
                  >
                    <HugeiconsIcon icon={social.icon} size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar: Stacked on mobile */}
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-6 text-[9px] font-bold tracking-[0.2em] text-white/20 uppercase text-center">
              <span>© 2026 THE HEALTH & WEALTH CLUB</span>
              <div className="flex gap-4">
                <LocalizedClientLink href="/privacy" className="hover:text-white">Privacy</LocalizedClientLink>
                <LocalizedClientLink href="/terms" className="hover:text-white">Terms</LocalizedClientLink>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-2 border border-white/10 rounded-full">
              <span className="text-sm">🇦🇪</span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-white/50 uppercase">UAE (AED)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}