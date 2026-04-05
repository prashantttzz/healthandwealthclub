import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function AboutSection() {
  return (
    <div className="bg-accent w-full min-h-screen lg:h-[95vh] flex items-center py-4 px-4 lg:px-0">
      <div className="w-full h-full bg-bg md:py-3 ">
        <div className="bg-accent flex flex-col lg:flex-row items-center justify-center h-full overflow-hidden relative">
          
          <div className="w-full lg:w-1/2 h-[45vh] lg:h-full relative">
            <Image 
              src="/about.png" 
              alt="about-me" 
              fill 
              className="object-cover" 
              priority
            />
          </div>

          <div className="flex flex-col font-gilda items-center h-full relative text-white justify-center py-12 lg:py-0 gap-8 lg:gap-10 w-full lg:w-1/2 px-6 lg:px-12">
            <Image 
              fill 
              alt="dotted-bg" 
              src="/dotted-bg.png" 
              className="object-cover opacity-30 z-0 pointer-events-none"
            />

            <div className="flex gap-2 z-10 text-2xl md:text-4xl items-center pb-2 border-b border-white/30">
              <span className="font-petit lowercase">The</span>CONCEPT
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl text-center z-10 leading-tight">
              Beyond the Garment
            </h1>

            <div className="text-center z-10 text-base md:text-xl lg:text-2xl font-extralight tracking-wide text-white/80 font-manrope w-full lg:w-[90%] flex flex-col gap-6 lg:gap-10">
              <p>
                The Health & Wealth Club is an invitation to a life of intention.
              </p>
              <p>
                We merge the tactile luxury of premium textiles with the precision of modern tailoring to create more than an aesthetic
              </p>
              <p>
                —we create a sense of <span className="font-petit ml-2 text-2xl lg:text-4xl text-white">belonging</span>.
              </p>
            </div>

            <button className="z-10 bg-transparent border border-white px-8 lg:px-20 py-3 lg:py-4 flex items-center justify-center gap-4 lg:gap-8 font-gilda text-lg lg:text-xl font-light hover:bg-white hover:text-accent transition-all duration-500">
              KNOW MORE 
              <ArrowRight/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}