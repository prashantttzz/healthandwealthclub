"use client"

import React, { useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { ArrowDown, ArrowRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const AboutUsTemplate = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Parallax effects
  const heroImageY = useTransform(scrollYProgress, [0, 0.3], [0, 200])
  const heroTextY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
  const missionImageY = useTransform(scrollYProgress, [0.1, 0.4], [50, -50])
  const founderImageY = useTransform(scrollYProgress, [0.3, 0.6], [50, -50])
  const joinImageY = useTransform(scrollYProgress, [0.6, 0.9], [-50, 50])

  return (
    <div ref={containerRef} className="relative w-full bg-bg font-manrope overflow-hidden pb-32">
      {/* 1. HERO SECTION WITH PARALLAX */}
      <section className="h-screen w-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <motion.div style={{ y: heroImageY }} className="absolute inset-0 z-0">
          <Image 
            src="/about-hero.png" 
            alt="About Background" 
            fill 
            priority
            className="object-cover opacity-60 grayscale scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90" />
        </motion.div>

        <motion.div 
          style={{ y: heroTextY }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center text-center text-bg"
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: "1em" }}
            animate={{ opacity: 0.6, letterSpacing: "0.6em" }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="text-[11px] uppercase font-bold text-bg mb-8 ml-2"
          >
            The Heritage
          </motion.span>
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="font-newsreader italic text-7xl md:text-[140px] lg:text-[180px] text-bg leading-[0.8] tracking-tighter mb-4"
            >
              Our Vision.
            </motion.h1>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 1, delay: 1 }}
            className="font-manrope text-[12px] md:text-[14px] uppercase tracking-[0.3em] font-medium text-bg max-w-sm mt-8"
          >
            A legacy built on the intersection of <br /> Health, Wealth, and intentionality.
          </motion.p>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-4 mt-20"
          >
            <ArrowDown className="text-accent/20" size={16} />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. THE TICKER */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="w-full border-y border-accent/5 py-4 overflow-hidden flex whitespace-nowrap bg-secondary/50"
      >
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 pr-20 items-center grow-0 shrink-0"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className="font-manrope text-[10px] font-bold uppercase tracking-[0.4em] text-accent/30">
              The Health & Wealth Club legacy • Est. 2026 • Curating the Exceptional
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* 3. MISSION SECTION */}
      <section className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 py-32 px-6 md:px-12 lg:px-16 items-center">
        <div className="relative aspect-[4/5] overflow-hidden group">
          <motion.div style={{ y: missionImageY }} className="absolute -inset-y-20 inset-x-0">
            <Image 
              src="/about-studio.png" 
              alt="Studio Space" 
              fill 
              className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
            />
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-4">
            <span className="text-[11px] uppercase tracking-[0.4em] font-bold text-accent/30">Our Ethos</span>
            <h2 className="font-newsreader italic text-5xl md:text-6xl text-accent tracking-tighter leading-[1.1]">
              "We believe great style is a byproduct of a balanced life."
            </h2>
          </div>
          <p className="font-manrope text-[15px] leading-relaxed text-accent/60 max-w-lg font-medium">
            Since our founding, the Club has served as a sanctuary for those who understand that true wealth is health. We curate not just garments, but artifacts of a life well-lived—ensuring every detail reflects the ambition of our members.
          </p>
          <div className="pt-4 border-t border-accent/10 flex flex-col gap-6">
            <div className="flex justify-between items-end group cursor-pointer border-b border-transparent hover:border-accent/10 pb-4 transition-all">
               <span className="font-manrope text-[12px] font-bold uppercase tracking-widest text-accent">Artisanal Mastery</span>
               <ArrowRight className="text-accent/20 group-hover:text-accent transition-all" size={20} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. THE FOUNDER SECTION */}
      <section className="bg-accent text-bg py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="flex flex-col gap-12 relative z-10 order-2 lg:order-1">
               <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col gap-4"
               >
                  <span className="font-manrope text-[10px] uppercase tracking-[0.5em] font-bold opacity-40">The Man Behind The Club</span>
                  <h2 className="font-newsreader italic text-5xl lg:text-7xl leading-tight tracking-tighter">
                    Built for the <br /> Visionary.
                  </h2>
               </motion.div>
               <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="space-y-6 font-manrope text-[15px] lg:text-[17px] opacity-70 leading-relaxed font-light max-w-xl"
               >
                  <p>
                    The Health & Wealth Club is the realization of a decade-long pursuit of excellence. Our founder envisioned a space where the tactile luxury of the world's finest textiles meets the rigorous discipline of high-performance living.
                  </p>
                  <p>
                    "The Club isn't just about what you wear; it's about the standard you hold for yourself. We build for the person who values time, health, and a curated legacy above all else."
                  </p>
               </motion.div>
               <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col gap-2 pt-8"
               >
                   <span className="font-petit text-3xl opacity-90 tracking-widest italic">Marcus Nuel</span>
                   <span className="font-manrope text-[10px] uppercase font-bold tracking-[0.4em] opacity-40">Founder & Creative Lead</span>
               </motion.div>
            </div>

            <div className="relative aspect-[3/4] lg:aspect-auto lg:h-[600px] overflow-hidden order-1 lg:order-2">
               <motion.div style={{ y: founderImageY }} className="absolute -inset-y-20 inset-x-0">
                  <Image 
                    src="/founder.png" 
                    alt="The Founder" 
                    fill 
                    className="object-cover scale-110"
                  />
                  <div className="absolute inset-0 bg-accent/10 mix-blend-overlay" />
               </motion.div>
            </div>
        </div>
        {/* Background shadow typography */}
        <div className="absolute bottom-0 right-0 pointer-events-none opacity-[0.03] select-none translate-y-1/2 translate-x-1/4">
           <h3 className="font-newsreader italic text-[400px] lg:text-[600px] leading-none text-bg uppercase">Heritage</h3>
        </div>
      </section>

      {/* 5. EDITORIAL GRID WITH REVEALS */}
      <section className="py-40 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-12 items-center mb-24"
        >
           <span className="text-[11px] uppercase tracking-[0.6em] font-bold text-accent/30">Behind the scenes</span>
           <h2 className="font-newsreader italic text-5xl md:text-7xl text-accent text-center tracking-tighter">Articulating Quality.</h2>
        </motion.div>
        
        <div className="grid grid-cols-12 gap-6 items-start">
           <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]) }}
            className="col-span-12 md:col-span-6 lg:col-span-4 aspect-square overflow-hidden mb-24 relative"
           >
              <Image src="/about-detail.png" alt="Detail" fill className="object-cover" />
           </motion.div>
           
           <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, 50]) }}
            className="col-span-12 md:col-span-6 lg:col-span-8 aspect-video overflow-hidden mt-12 mb-32 relative shadow-2xl"
           >
              <Image src="/about-hero.png" alt="Hero Lifestyle" fill className="object-cover" />
           </motion.div>
           
           <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }}
            className="col-span-12 md:col-8 lg:col-span-7 aspect-[4/3] overflow-hidden ml-auto w-full lg:w-[120%] relative"
           >
              <Image src="/about-studio.png" alt="Studio Detail" fill className="object-cover" />
           </motion.div>
        </div>
      </section>

      {/* 6. QUOTE SECTION */}
      <section className="py-32 lg:py-40 flex justify-center text-center px-6 bg-secondary/20 font-manrope">
         <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-200px" }}
            className="max-w-4xl flex flex-col gap-12 items-center"
          >
            <span className="text-4xl lg:text-5xl text-accent/20">“</span>
            <p className="font-newsreader italic text-4xl lg:text-6xl text-accent leading-tight tracking-tighter">
              A life well-lived is a life curated intentionally. We are simply the custodians of that curation.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-2"
            >
               <span className="font-manrope text-[11px] font-bold uppercase tracking-widest text-accent font-manrope">Marcus Nuel</span>
               <span className="font-manrope text-[10px] uppercase tracking-widest text-accent/40 italic font-manrope">Founder & Creative Lead</span>
            </motion.div>
         </motion.div>
      </section>

      {/* 7. JOIN THE CLUB SECTION */}
      <section className="relative h-[60vh] flex flex-col items-center justify-center overflow-hidden border-t border-accent/5">
        <motion.div style={{ y: joinImageY }} className="absolute -inset-y-32 inset-x-0 z-0">
          <Image 
            src="/about-hero.png" 
            alt="Instagram Preview" 
            fill 
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 flex flex-col items-center text-center gap-8"
        >
          <span className="text-[11px] uppercase tracking-[0.6em] font-bold text-accent/40 font-manrope">The Collective</span>
          <h2 className="font-newsreader italic text-6xl md:text-8xl text-accent tracking-tighter leading-none">
            Join The Club.
          </h2>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://instagram.com/healthandwealthclub"
            className="group flex flex-col items-center gap-4 mt-4"
          >
            <span className="font-manrope text-[12px] font-bold uppercase tracking-widest text-accent border-b border-accent/20 pb-2 group-hover:border-accent transition-all">
              Follow our lifestyle on Instagram
            </span>
            <ArrowRight className="text-accent/20 group-hover:text-accent transition-all group-hover:translate-x-1" size={20} />
          </motion.a>
        </motion.div>
      </section>

      {/* 8. CONTACT & SOCIALS SECTION */}
      <section className="py-40 px-6 md:px-12 lg:px-16 bg-accent text-bg flex flex-col lg:flex-row justify-between items-start gap-20 overflow-hidden relative">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8 max-w-xl relative z-10"
        >
          <span className="text-[11px] uppercase tracking-[0.6em] font-bold opacity-30 font-manrope">Get in touch</span>
          <h2 className="font-newsreader italic text-5xl md:text-7xl tracking-tighter leading-none">
            Speak with our <br /> Concierge.
          </h2>
          <p className="font-manrope text-[15px] opacity-60 leading-relaxed font-medium mt-4">
            Our team is available to assist with bespoke collection inquiries, membership access, and personal styling requests. Reach out through your preferred medium.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full lg:w-auto flex flex-col gap-12 pt-12 lg:pt-20 relative z-10"
        >
          {/* Email */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] opacity-30 font-manrope">Director of Inquiries</span>
            <a href="mailto:concierge@healthandwealth.club" className="font-newsreader italic text-3xl md:text-5xl border-b border-white/10 pb-4 hover:border-white transition-all">
              Email Us
            </a>
          </div>

          {/* Social Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] opacity-30 font-manrope">Digital Office</span>
              <a href="https://wa.me/something" className="font-newsreader italic text-2xl md:text-3xl hover:opacity-100 opacity-70 transition-opacity">WhatsApp Concierge</a>
              <a href="https://instagram.com/healthandwealthclub" className="font-newsreader italic text-2xl md:text-3xl hover:opacity-100 opacity-70 transition-opacity">Instagram DM</a>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] opacity-30 font-manrope">Support Hub</span>
              <LocalizedClientLink href="/customer-service" className="font-newsreader italic text-2xl md:text-3xl hover:opacity-100 opacity-70 transition-opacity underline decoration-white/10 underline-offset-8 hover:decoration-white transition-all">Common FAQ Hub</LocalizedClientLink>
            </div>
          </div>
        </motion.div>

        {/* Decorative corner text */}
        <div className="absolute top-0 right-0 p-16 opacity-[0.03] select-none pointer-events-none hidden lg:block">
           <span className="font-newsreader italic text-[200px] leading-none">Club</span>
        </div>
      </section>
    </div>
  )
}

export default AboutUsTemplate
