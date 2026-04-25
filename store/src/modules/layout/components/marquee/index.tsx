import React from "react"

const Marquee = () => {
  return (
    <div className="bg-accent py-4 overflow-hidden border-y border-white/10 w-full">
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex items-center gap-4 text-white font-manrope text-[11px] uppercase tracking-[0.2em] px-4">
          <span>this is a sample website for a clothing brand designed by Cityreach —</span>
          <a href="https://www.instagram.com/thekushalchhabra" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:opacity-70 transition-opacity">
            click here to contact us
          </a>
          <span className="mx-8 opacity-20">|</span>
          <span>this is a sample website for a clothing brand designed by Cityreach —</span>
          <a href="https://www.instagram.com/thekushalchhabra" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:opacity-70 transition-opacity">
            click here to contact us
          </a>
          <span className="mx-8 opacity-20">|</span>
          <span>this is a sample website for a clothing brand designed by Cityreach —</span>
          <a href="https://www.instagram.com/thekushalchhabra" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:opacity-70 transition-opacity">
            click here to contact us
          </a>
        </div>
      </div>
    </div>
  )
}

export default Marquee
