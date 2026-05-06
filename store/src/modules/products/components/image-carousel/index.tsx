"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { clx } from "@medusajs/ui"

type ImageCarouselProps = {
  images: HttpTypes.StoreProductImage[]
  title?: string
}

const ImageCarousel = ({ images, title }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Sync index on scroll
  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollPosition = scrollRef.current.scrollLeft
      const itemWidth = scrollRef.current.offsetWidth
      const newIndex = Math.round(scrollPosition / itemWidth)
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex)
      }
    }
  }

  // Handle manual dot navigation
  const scrollTo = (index: number) => {
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth
      scrollRef.current.scrollTo({
        left: index * itemWidth,
        behavior: "smooth"
      })
    }
  }

  if (!images || images.length === 0) return null

  return (
    <div className="relative w-full aspect-[4/5] bg-bg md:rounded-3xl border border-black/5 overflow-hidden group">
      {/* Native-feeling Smooth Carousel */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.map((image, i) => (
          <div 
            key={image.id} 
            className="w-full h-full shrink-0 snap-center relative bg-secondary/30"
          >
            <Image
              src={image.url || "/placeholder.png"}
              alt={title || `Product image ${i + 1}`}
              fill
              priority={i <= 2} // Pre-load first 3 images for instant feel
              className="object-cover"
              sizes="100vw"
              loading={i <= 2 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Floating Index Counter */}
      <div className="absolute top-6 right-6 px-3 py-1 bg-black/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white z-10 tracking-widest shadow-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Pagination Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={clx("h-1 transition-all duration-300 rounded-full", {
                "w-6 bg-accent": i === currentIndex,
                "w-1.5 bg-accent/20 hover:bg-accent/40": i !== currentIndex
              })}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hint for more images (subtle gradient on right if not at end) */}
      {currentIndex < images.length - 1 && (
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/5 to-transparent pointer-events-none opacity-50" />
      )}
    </div>
  )
}

export default ImageCarousel
