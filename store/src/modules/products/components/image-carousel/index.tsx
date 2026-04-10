"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

type ImageCarouselProps = {
  images: HttpTypes.StoreProductImage[]
  title?: string
}

const ImageCarousel = ({ images, title }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0
    })
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = (newDirection: number) => {
    const nextIndex = currentIndex + newDirection
    if (nextIndex >= 0 && nextIndex < images.length) {
      setDirection(newDirection)
      setCurrentIndex(nextIndex)
    }
  }

  if (!images || images.length === 0) return null

  return (
    <div className="relative w-full aspect-[4/5] overflow-hidden bg-bg md:rounded-3xl border border-black/5">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x)

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1)
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1)
            }
          }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[currentIndex].url}
            alt={title || `Product image ${currentIndex + 1}`}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-10 pointer-events-none">
            <button
              onClick={() => paginate(-1)}
              disabled={currentIndex === 0}
              className={`w-10 h-10 rounded-full bg-bg/80 backdrop-blur-md flex items-center justify-center border border-black/5 shadow-sm transition-all pointer-events-auto ${
                currentIndex === 0 ? "opacity-0 scale-90" : "opacity-100 scale-100 active:scale-90"
              }`}
            >
              <ChevronLeft className="w-5 h-5 text-accent" />
            </button>
            <button
              onClick={() => paginate(1)}
              disabled={currentIndex === images.length - 1}
              className={`w-10 h-10 rounded-full bg-bg/80 backdrop-blur-md flex items-center justify-center border border-black/5 shadow-sm transition-all pointer-events-auto ${
                currentIndex === images.length - 1 ? "opacity-0 scale-90" : "opacity-100 scale-100 active:scale-90"
              }`}
            >
              <ChevronRight className="w-5 h-5 text-accent" />
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, i) => (
              <div
                key={i}
                className={`h-1 transition-all duration-300 rounded-full ${
                  i === currentIndex ? "w-6 bg-accent" : "w-1.5 bg-accent/20"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Index Counter */}
      <div className="absolute top-6 right-6 px-3 py-1 bg-black/10 backdrop-blur-md rounded-full text-[10px] font-bold text-white z-10 tracking-widest">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  )
}

export default ImageCarousel
