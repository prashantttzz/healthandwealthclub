"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Instagram, Mail, WhatsappFreeIcons, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import LocalizedClientLink from "@modules/common/components/localized-client-link";
import Image from "next/image";
import { useRegion } from "@lib/context/region-context";
import ReactCountryFlag from "react-country-flag";
import { CONTACT_LINKS, SUPPORT_LINKS } from "@lib/constants";
import TikTokIcon from "@modules/common/icons/tiktok";

export default function ClubFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { region, countryCode } = useRegion();

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
    stiffness: isMobile ? 120 : 80,
    damping: isMobile ? 20 : 25,
    restDelta: 0.001,
  });

  const endThreshold = isMobile ? 0.5 : 0.8;
  const scale = useTransform(smoothProgress, [0, endThreshold], [0.8, 1]);
  const borderRadius = useTransform(smoothProgress, [0, endThreshold], ["32px", "0px"]);
  const imageY = useTransform(smoothProgress, [0, 1], ["-10%", "0%"]);
  const buttonOpacity = useTransform(smoothProgress, [0.2, 0.5], [0, 1]);

  return (
    <div ref={containerRef} className="relative w-full z-20 bg-bg">
      {/* --- EXPANDING HERO SECTION --- */}
      <section className="relative h-[60vh] md:h-[90vh] w-full flex flex-col items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale, borderRadius, width: "100%", height: "100%" }}
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

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <motion.div className="text-center px-4">
              <span className="font-manrope text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase mb-3 block opacity-70">
                LIFESTYLE COLLECTIVE
              </span>
              <h2 className="font-newsreader italic text-6xl sm:text-9xl md:text-[180px] leading-tight tracking-tighter mb-8 md:mb-12">
                The Club
              </h2>
              <motion.div style={{ opacity: buttonOpacity }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <LocalizedClientLink
                    href="/account"
                    className="group inline-flex items-center gap-3 bg-white text-black md:bg-white/10 md:text-white md:backdrop-blur-md border border-white/20 px-6 py-3 md:px-8 md:py-4 rounded-full transition-all hover:bg-white hover:text-black"
                  >
                    <span className="font-manrope text-[10px] md:text-xs font-bold tracking-widest uppercase">
                      Become a Member
                    </span>
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} className="group-hover:rotate-45 transition-transform" />
                  </LocalizedClientLink>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- FOOTER CONTENT --- */}
      <footer className="bg-accent relative text-white pt-16 md:pt-10 pb-10 px-6 sm:px-12 lg:px-16 font-light -mt-1">
        <div className="max-w-[1440px] mx-auto">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8"
          >
            {/* Column 1: Brand */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="col-span-2 lg:col-span-1 flex flex-col items-start space-y-6 text-left"
            >
              <div className="flex flex-row lg:flex-col items-start lg:items-start gap-5 lg:gap-0 lg:space-y-6 w-full">
                <LocalizedClientLink href="/" className="flex-shrink-0">
                  <Image
                    src="/main-logo-h.png"
                    alt="logo"
                    height={150}
                    width={200}
                    className="brightness-0 invert object-contain transition-transform duration-500 hover:scale-105 w-[140px] sm:w-[160px] lg:w-[200px]"
                  />
                </LocalizedClientLink>

                {/* Description + icons stacked vertically, won't overflow */}
                <div className="flex flex-col items-start gap-4 min-w-0">
                  <p className="text-white/50 text-[12px] lg:text-[13px] leading-relaxed max-w-[200px] lg:max-w-[240px] font-manrope pt-8 lg:pt-0">
                    Elevating your lifestyle through a curated blend of health and wealth essentials.
                  </p>

                </div>
              </div>
            </motion.div>

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="flex flex-col items-start space-y-5 text-left"
            >
              <h4 className="font-newsreader italic text-lg text-white/90">Shop</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "Collection", href: "/store" },
                  { label: "New Arrivals", href: "/store" },
                  { label: "Best Sellers", href: "/store" },
                ].map((link) => (
                  <li key={link.label}>
                    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                      <LocalizedClientLink
                        href={link.href}
                        className="font-manrope text-[10px] tracking-[0.3em] uppercase font-bold text-white/40 hover:text-white transition-colors"
                      >
                        {link.label}
                      </LocalizedClientLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="flex flex-col items-start space-y-5 text-left"
            >
              <h4 className="font-newsreader italic text-lg text-white/90">Club Support</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "About Us", href: "/#about-us" },
                  { label: "Collabrations", href: "/collabrations" },
                  { label: "Shipping", href: SUPPORT_LINKS.shipping },
                  { label: "Privacy", href: SUPPORT_LINKS.privacy },
                  { label: "Terms", href: SUPPORT_LINKS.terms },
                ].map((link) => (
                  <li key={link.label}>
                    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 300 }}>
                      <LocalizedClientLink
                        href={link.href}
                        className="font-manrope text-[10px] tracking-[0.3em] uppercase font-bold text-white/40 hover:text-white transition-colors"
                      >
                        {link.label}
                      </LocalizedClientLink>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              className="flex flex-col items-start space-y-5 text-left"
            >
              <h4 className="font-newsreader italic text-lg text-white/90">Socials</h4>
              <ul className="flex flex-col gap-5">
                {[
                  { label: "TikTok", href: CONTACT_LINKS.tiktok, icon: Instagram, isTikTok: true },
                  { label: "Instagram", href: CONTACT_LINKS.instagram, icon: Instagram },
                  { label: "WhatsApp", href: CONTACT_LINKS.whatsapp, icon: WhatsappFreeIcons },
                  { label: "Email", href: CONTACT_LINKS.email, icon: Mail },
                ].map((social) => (
                  <li key={social.label}>
                    <motion.a
                      whileHover={{ x: 4, color: "rgba(255, 255, 255, 1)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 font-manrope text-[10px] tracking-[0.3em] uppercase font-bold text-white/40 hover:text-white transition-colors"
                    >
                      {social.isTikTok ? (
                        <TikTokIcon className="w-[18px] h-[18px] opacity-60" />
                      ) : (
                        <HugeiconsIcon icon={social.icon} size={18} className="opacity-60" />
                      )}
                      {social.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Bottom Bar */}
          <div className="mt-24 pt-8 border-t border-white/5 flex flex-col items-center gap-8 text-center">
            <div className="flex flex-col items-center gap-4 text-[9px] font-bold tracking-[0.2em] text-white/30 uppercase">
              <span>© 2026 THE HEALTH & WEALTH CLUB</span>
            </div>
            <div
              className="flex items-center gap-4 px-6 py-3 border border-white/10 rounded-full transition-all"
            >
              <ReactCountryFlag
                svg
                style={{
                  width: "20px",
                  height: "20px",
                }}
                countryCode={region?.countries?.find(c => c.iso_2 === countryCode)?.iso_2 || countryCode}
              />
              <div className="flex flex-col items-start leading-none gap-1">
                <span className="text-[10px] font-bold tracking-[0.2em] text-white uppercase italic">
                  {region?.countries?.find(c => c.iso_2 === countryCode)?.display_name || "Region"} — {region?.currency_code?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
