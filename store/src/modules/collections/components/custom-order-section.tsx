import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import Image from "next/image"

export default function CustomOrderSection() {
  return (
    <section className="relative w-full flex h-[70vh] items-center bg-accent py-24 px-6 md:px-16 lg:px-24 overflow-hidden mt-10 border-t border-black/[0.03]">
      {/* Background watermark — toned down and properly clipped */}
      <div className="absolute inset-0 flex items-center overflow-hidden select-none pointer-events-none">
        <span className="font-newsreader italic text-[18vw] leading-none whitespace-nowrap opacity-[0.025] text-accent">
          Bespoke Craftsmanship
        </span>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Left Content Column */}
          <div className="flex-1 space-y-8 max-w-xl">
            {/* Eyebrow */}
            <span className="font-manrope text-[10px] font-bold tracking-[0.35em] uppercase text-accent/40 block">
              The Club Exclusives
            </span>

            {/* Heading — tightened scale for better hierarchy */}
            <h2 className="font-newsreader italic text-4xl md:text-5xl lg:text-6xl text-accent leading-[1.0] tracking-tight">
              Elegance in <br className="hidden md:block" /> the unique
            </h2>

            {/* Body copy */}
            <p className="font-manrope text-sm text-accent/70 leading-relaxed max-w-md">
              True luxury lies in the personal touch. Our bespoke program transforms your imagination into meticulously crafted reality. Every detail — from fabric selection to the final stitch — is a reflection of your individual journey.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-2">
              <LocalizedClientLink
                href="/customer-service#contact"
                className="group inline-flex items-center gap-4 border-2 border-accent px-8 py-4 rounded-full transition-all duration-300 hover:bg-accent hover:text-bg w-fit shadow-sm"
              >
                <span className="font-manrope text-[11px] font-black tracking-[0.2em] uppercase">
                  Inquire Now
                </span>
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={16}
                  className="group-hover:rotate-45 transition-transform duration-300 stroke-2"
                />
              </LocalizedClientLink>

              <p className="font-newsreader italic text-base text-accent/60 underline underline-offset-4 decoration-accent/30">
                Customization starts at $2,400
              </p>
            </div>
          </div>

          {/* Right Image Column */}
          <div className="flex-1 mt-10 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[320px] group">
              {/* Shadow offset layer */}
              <div className="absolute inset-0 bg-accent/8 translate-x-3 translate-y-3 rounded-sm transition-transform duration-700 group-hover:translate-x-1 group-hover:translate-y-1" />

              {/* Image container — fixed aspect ratio */}
              <div className="relative w-full aspect-[3/4] overflow-hidden border border-black/[0.06] bg-secondary rounded-sm">
                <Image
                  src="/about.png"
                  alt="Bespoke Craftsmanship Detail"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              {/* Floating label */}
              <div className="absolute bottom-10 -left-4 bg-accent text-bg px-5 py-3 shadow-xl">
                <span className="font-manrope text-[10px] font-bold tracking-[0.3em] uppercase whitespace-nowrap">
                  Atelier Edition
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}