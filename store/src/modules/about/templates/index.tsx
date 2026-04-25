"use client"
import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, Instagram, WhatsappFreeIcons, Mail } from "@hugeicons/core-free-icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { CONTACT_LINKS } from "@lib/constants"

const AboutUsTemplate = () => {
  return (
    <div className="bg-bg min-h-screen text-accent overflow-hidden font-manrope selection:bg-[#1A2F23] selection:text-[#FDFBF7]">
      {/* 1. HERO / MOVEMENT SECTION */}
      <section className="min-h-screen flex flex-col justify-center px-6 lg:px-40 py-24 md:py-40 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="max-w-6xl mb-24"
        >
          <span className="font-manrope text-[11px] uppercase tracking-[0.5em] font-bold opacity-30 mb-8 block">THE MOVEMENT</span>
          <h1 className="font-newsreader italic text-6xl lg:text-[140px] text-[#111111] leading-[0.8] tracking-tighter">
            WHAT DOES <br className="hidden lg:block" /> WORKING WITH <br className="hidden lg:block" /> US MEANS?
          </h1>
        </motion.div>
        
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-40 items-start">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="space-y-12"
            >
              <p className="font-newsreader italic text-2xl lg:text-4xl text-[#111111]/90 leading-tight lg:-ml-1">
                It means joining a movement that redefines luxury. At City Reach, we blend engineering precision with fashion artistry to deliver clothing that feels exclusive yet accessible.
              </p>
              <div className="h-px w-20 bg-[#111111]/10" />
              <div className="space-y-8">
                <p className="text-sm lg:text-lg text-[#111111]/70 leading-relaxed font-regular max-w-xl">
                  Working with us means aligning with a brand that values authenticity, cultural nuance, and uncompromising quality, a partnership that elevates both style and mindset.
                </p>
                <p className="text-sm lg:text-lg text-[#111111]/70 leading-relaxed font-regular max-w-xl">
                  We also offer custom made pieces upon request, whether in large or small quantities, ensuring every detail reflects the ambition of our members.
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 flex flex-col gap-12 w-full">
            <div className="grid grid-cols-2 gap-6 aspect-square lg:aspect-auto lg:h-[70vh]">
              <motion.div 
                initial={{ opacity: 0, scale: 1.05 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className="relative overflow-hidden group shadow-2xl shadow-black/5"
              >
                <Image 
                  src="/p-1.png" 
                  alt="Editorial 1" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </motion.div>
              <motion.div 
                 initial={{ opacity: 0, scale: 1.05 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                 viewport={{ once: true }}
                 className="relative overflow-hidden group shadow-2xl shadow-black/5"
              >
                <Image 
                  src="/p-2.png" 
                  alt="Editorial 2" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Floating Decorative Label */}
        <div className="absolute bottom-20 left-6 lg:left-40 hidden md:block">
           <span className="font-newsreader italic text-[180px] lg:text-[240px] text-[#111111] opacity-[0.03] select-none pointer-events-none">Heritage</span>
        </div>
      </section>

      {/* 2. THE CONCIERGE SECTION (CRISP & MINIMAL) */}
      <section className="py-32 lg:py-60 px-6 lg:px-40 border-t border-black/5 bg-bg relative">
        <div className="max-w-[1440px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row justify-between items-start gap-24 lg:gap-40"
          >
            <div className="max-w-xl">
              <span className="font-manrope text-[11px] uppercase tracking-[0.5em] font-bold opacity-30 mb-8 block">DIRECT ACCESS</span>
              <h2 className="font-newsreader italic text-5xl lg:text-[100px] text-[#111111] leading-[0.85] tracking-tighter mb-12">
                Speak with our Concierge.
              </h2>
              <p className="text-sm lg:text-lg text-[#111111]/50 leading-relaxed font-regular">
                Our team is available to assist with bespoke collection inquiries, membership access, and personal styling requests.
              </p>
            </div>

            <div className="w-full lg:w-auto mt-12 lg:mt-32 space-y-20">
              {/* Contact Grid */}
              <div className="flex flex-col gap-16">
                 {/* Email Link */}
                 <motion.a 
                    whileHover={{ x: 12 }} 
                    href={CONTACT_LINKS.email}
                    target="_blank"
                    rel="noreferrer"
                    className="group border-b border-black/5 pb-10 flex items-center justify-between gap-12"
                 >
                    <div className="space-y-2">
                       <span className="font-manrope text-[9px] uppercase font-bold tracking-[0.3em] opacity-30">Director of Inquiries</span>
                       <span className="font-newsreader italic text-3xl lg:text-5xl block">Email Us</span>
                    </div>
                    <HugeiconsIcon icon={Mail} size={32} className="opacity-10 group-hover:opacity-100 transition-opacity" />
                 </motion.a>

                 {/* Socials Row */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                    <motion.a 
                       whileHover={{ x: 12 }} 
                       href={CONTACT_LINKS.whatsapp}
                       target="_blank"
                       rel="noreferrer"
                       className="group flex flex-col gap-4 border-l border-black/5 pl-8"
                    >
                       <span className="font-manrope text-[9px] uppercase font-bold tracking-[0.3em] opacity-30 italic">Digital Hub</span>
                       <span className="font-newsreader italic text-2xl lg:text-3xl">WhatsApp Concierge</span>
                    </motion.a>
                    <motion.a 
                       whileHover={{ x: 12 }} 
                       href={CONTACT_LINKS.instagram}
                       target="_blank"
                       rel="noreferrer"
                       className="group flex flex-col gap-4 border-l border-black/5 pl-8"
                    >
                       <span className="font-manrope text-[9px] uppercase font-bold tracking-[0.3em] opacity-30 italic">Follow us</span>
                       <span className="font-newsreader italic text-2xl lg:text-3xl">Instagram DM</span>
                    </motion.a>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Support Link */}
          <div className="mt-40 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
             <span className="font-manrope text-[10px] uppercase font-bold tracking-[0.4em]">Est. 2026</span>
             <LocalizedClientLink href="/customer-service" className="group flex items-center gap-3 font-manrope text-[10px] uppercase font-bold tracking-[0.4em] hover:opacity-100 transition-all">
                Customer Support Hub <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
             </LocalizedClientLink>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUsTemplate
