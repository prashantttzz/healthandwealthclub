import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function AboutSection() {
  return (
    <section className="relative w-full h-screen lg:h-[90vh] flex flex-col lg:flex-row overflow-hidden bg-bg">
      <div className="relative w-full lg:w-[40%] h-[50vh] lg:h-full overflow-hidden">
        <Image 
          src="/interior_background_about.png" 
          alt="Interior Background" 
          fill 
          className="object-cover" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-4 left-4 lg:bottom-10 lg:left-10 z-10 p-0">
          <h2 className="text-[60px] md:text-[80px] lg:text-[100px] font-newsreader text-white/90 leading-none tracking-tighter opacity-80 uppercase">
            ABOUT
          </h2>
        </div>
      </div>

      <div className="w-full lg:w-[60%] h-[50vh] lg:h-full bg-accent flex items-center justify-center p-8 lg:p-20 text-white text-center sm:text-left">
        <div className="max-w-[500px] flex flex-col gap-6 lg:gap-8 z-10 lg:pl-12">
          <p className="font-manrope uppercase tracking-[0.3em] text-[10px] lg:text-xs text-white/60">
THE HEALTH & WEALTH CLUB          </p>
          
          <h3 className="font-newsreader text-3xl md:text-4xl lg:text-5xl leading-tight">
            The Concept
          </h3>
          
          <div className="flex flex-col gap-4 lg:gap-8 text-start font-manrope text-sm lg:text-base font-light text-white/80 leading-relaxed">
            <p>
           We deliver an experience that feels bigger than fashion. Our concept is a lifestyle built for a community that values elegance and authenticity. Here, you are greeted by the touch of premium fabrics and the precision of tailored finishes.
            </p>
            <p>
            We combine striking aesthetics with effortless wearability and uncompromising craftsmanship. We don’t just create clothing that looks good; we create the uniform for a life of intention.
            </p>
            <button className="bg-accent border border-white text-white px-4 py-2 flex items-center justify-center gap-5 font-gilda">Read More <ArrowRight/></button>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 lg:left-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:block">
        <div className="relative border p-3">
          <div className="relative w-[320px] h-[400px] border-[0.5px] border-black/20 p-3 bg-white shadow-2xl">
            <div className="relative w-full h-full overflow-hidden ">
              <Image 
                src="/kenna_portrait.png" 
                alt="Kenna Portrait" 
                fill 
                className="object-cover"
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Mobile Overlapping Image Adjustments */}
      <div className="absolute top-[50vh] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 lg:hidden scale-75">
        <div className="relative w-[280px] h-[350px] border-[0.5px] border-black/20 p-3 bg-white shadow-xl">
          <div className="relative w-full h-full overflow-hidden">
            <Image 
              src="/kenna_portrait.png" 
              alt="Kenna Portrait" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}