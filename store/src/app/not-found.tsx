import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404",
  description: "Something went wrong",
}

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg p-6 text-center overflow-hidden">
      <div className="relative mb-8">
        <h1 className="font-gilda text-[100px] md:text-[200px] text-accent leading-none relative z-10">
          404
        </h1>
      </div>

      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        <h2 className="font-newsreader italic text-3xl md:text-5xl text-accent -mt-4">
          Lost in the pursuit of wellness?
        </h2>
        
        <p className="font-manrope text-text/80 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
          The page you are looking for has wandered off. 
          Let&apos;s guide you back to the collection.
        </p>

        <div className="pt-8">
          <Link 
            href="/" 
            className="inline-block px-10 py-4 bg-accent text-bg font-manrope uppercase tracking-[0.2em] text-xs md:text-sm hover:bg-secondaryAccent transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98]"
          >
            Return to Frontpage
          </Link>
        </div>

        <div className="pt-16">
          <p className="font-petit text-accent text-2xl md:text-3xl">
            The Health & Wealth Club
          </p>
        </div>
      </div>

      {/* Subtle decorative background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <div className="absolute top-10 left-10 w-64 h-64 border border-accent rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-accent rounded-full" />
      </div>
    </div>
  )
}
