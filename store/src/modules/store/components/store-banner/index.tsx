import Image from "next/image"

export default function StoreBanner() {
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden bg-accent">
      <Image
        src="/about.png"
        alt="Store Banner"
        fill
        className="object-cover opacity-80"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 flex flex-col items-center justify-center text-center p-6">
        <span className="font-manrope text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase text-white/70 mb-4">
          Curated Essentials
        </span>
        <h1 className="font-newsreader italic text-4xl mt-5 md:text-7xl text-white tracking-tighter max-w-4xl">
          Explore the Various Collection of The Club
        </h1>
      </div>
    </div>
  )
}
