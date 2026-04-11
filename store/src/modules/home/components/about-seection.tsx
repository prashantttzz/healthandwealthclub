"use client"

import React from "react"
import { motion } from "framer-motion"

const AboutSection = () => {
  return (
    <section className="py-24 md:py-32 bg-bg overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Text Content - 40% */}
          <div className="flex-1 lg:max-w-[40%]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-newsreader italic text-4xl md:text-5xl text-accent mb-8 leading-tight">
                Crafting a legacy of <br />
                <span className="not-italic">Health & Wealth.</span>
              </h2>
              <p className="font-manrope text-[14px] leading-relaxed text-accent/60 mb-8 max-w-md">
                We believe that true luxury is the intersection of vitality and prosperity. Our mission is to curate an exclusive environment where our members can perform at their peak.
              </p>
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="font-manrope text-3xl font-bold text-accent">500+</span>
                  <span className="font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold">Members</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-manrope text-3xl font-bold text-accent">12</span>
                  <span className="font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold">Drops</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Content - 60% */}
          <div className="flex-1 w-full lg:max-w-[60%] relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="aspect-square md:aspect-[16/9] w-full bg-accent/5 overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent" />
              {/* Optional: Add an image here if available */}
              <div className="absolute inset-0 flex items-center justify-center p-24">
                <div className="w-full h-full border border-accent/10 relative">
                  <div className="absolute top-0 right-0 w-12 h-[1px] bg-accent/20" />
                  <div className="absolute top-0 right-0 h-12 w-[1px] bg-accent/20" />
                  <div className="absolute bottom-0 left-0 w-12 h-[1px] bg-accent/20" />
                  <div className="absolute bottom-0 left-0 h-12 w-[1px] bg-accent/20" />
                </div>
              </div>
            </motion.div>
            
            {/* Floating Editorial Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -bottom-12 -right-6 md:-right-12 w-48 h-64 bg-accent hidden md:block shadow-2xl overflow-hidden"
            >
               {/* Editorial Portrait Placeholder */}
               <div className="w-full h-full bg-black/10 flex items-center justify-center">
                  <span className="font-newsreader italic text-bg/30">Editorial</span>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
