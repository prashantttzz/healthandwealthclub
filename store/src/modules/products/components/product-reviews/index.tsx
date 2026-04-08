import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { clx } from "@medusajs/ui"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"

type Review = {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
}

const ProductReviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/reviews?product_id=${productId}`, {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        }
      })
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (productId) {
      fetchReviews()
    }
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || !name || !comment) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        body: JSON.stringify({
          product_id: productId,
          customer_name: name,
          rating,
          comment,
        }),
      })

      if (response.ok) {
        setShowForm(false)
        setRating(0)
        setName("")
        setComment("")
        fetchReviews()
      }
    } catch (error) {
      console.error("Failed to submit review:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  return (
    <div className="bg-[#F2EDE5] py-24 lg:py-32 border-t border-black/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-20">
          
          {/* LEFT: SUMMARY */}
          <div className="lg:w-1/3 space-y-8">
            <div className="space-y-4">
              <span className="font-manrope text-[11px] tracking-[0.4em] uppercase font-bold text-accent/30 block">
                Social Proof
              </span>
              <h2 className="font-newsreader italic text-5xl lg:text-7xl leading-none text-accent tracking-tighter">
                Voices of the Club
              </h2>
            </div>

            <div className="flex items-center gap-6">
              <div className="font-newsreader italic text-6xl text-accent">{averageRating}</div>
              <div className="space-y-1">
                <StarRating rating={Math.round(Number(averageRating))} size={16} />
                <p className="font-manrope text-[10px] tracking-widest uppercase text-accent/40 font-bold">
                  Based on {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setShowForm(!showForm)}
              className="group flex items-center gap-4 bg-accent text-bg px-8 py-4 rounded-full transition-all hover:scale-105"
            >
              <span className="font-manrope text-[10px] font-bold tracking-widest uppercase">
                {showForm ? "Close Form" : "Share Your Experience"}
              </span>
            </button>
          </div>

          {/* RIGHT: REVIEWS & FORM */}
          <div className="lg:w-2/3">
            <AnimatePresence mode="wait">
              {showForm ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/50 border border-black/5 p-8 lg:p-12 space-y-10"
                >
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="font-newsreader italic text-3xl text-accent">Submit a Review</h3>
                      <p className="font-manrope text-[12px] text-accent/40">Your feedback helps us refine the intentional lifestyle.</p>
                    </div>

                    <div className="space-y-8">
                      {/* STAR SELECTOR */}
                      <div className="space-y-3">
                        <span className="font-manrope text-[10px] tracking-widest uppercase font-bold text-accent/60">Rating</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onMouseEnter={() => setHoverRating(s)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setRating(s)}
                              className="transition-transform active:scale-90"
                            >
                              <HugeiconsIcon 
                                icon={StarIcon} 
                                size={24} 
                                className={s <= (hoverRating || rating) ? "text-accent fill-accent" : "text-accent/10"} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                          <label className="font-manrope text-[10px] tracking-widest uppercase font-bold text-accent/60">Your Name</label>
                          <input 
                            required
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Alexander R." 
                            className="w-full bg-transparent border-b border-black/10 py-3 text-sm focus:border-accent outline-none transition-all" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="font-manrope text-[10px] tracking-widest uppercase font-bold text-accent/60">Subject</label>
                          <input type="text" placeholder="e.g. Exceptional Quality" className="w-full bg-transparent border-b border-black/10 py-3 text-sm focus:border-accent outline-none transition-all" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="font-manrope text-[10px] tracking-widest uppercase font-bold text-accent/60">Review Details</label>
                        <textarea 
                          required
                          rows={4} 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Describe your experience with the item..." 
                          className="w-full bg-transparent border-b border-black/10 py-3 text-sm focus:border-accent outline-none transition-all resize-none" 
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-14 bg-accent text-bg font-manrope text-[10px] font-bold tracking-[0.3em] uppercase transition-all hover:opacity-90 disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Experience"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-12"
                >
                  {isLoading ? (
                    <p className="font-manrope text-[11px] uppercase tracking-widest text-accent/30 italic">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <div className="space-y-4">
                      <p className="font-manrope text-[13px] text-accent/40 italic">No reviews yet for this piece. Be the first to share your experience.</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="pb-12 border-b border-black/5 last:border-0 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="font-manrope text-[11px] font-bold tracking-[0.2em] uppercase text-accent">{review.customer_name}</h4>
                            <span className="font-manrope text-[9px] tracking-widest uppercase text-accent/30">{new Date(review.created_at).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
                          </div>
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="font-manrope text-[14px] leading-relaxed text-accent/60 max-w-2xl">
                          {review.comment}
                        </p>
                        <div className="flex items-center gap-1.5 text-accent/40">
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} />
                          <span className="font-manrope text-[9px] tracking-widest uppercase italic">Verified Experience</span>
                        </div>
                      </div>
                    ))
                  )}

                  {reviews.length > 0 && (
                    <button className="font-manrope text-[10px] font-bold tracking-widest uppercase text-accent border-b border-accent pb-1 hover:opacity-50 transition-all">
                      View All {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

const StarRating = ({ rating, size = 12, className = "" }: { rating: number, size?: number, className?: string }) => {
  return (
    <div className={clx("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((s) => (
        <HugeiconsIcon 
          key={s} 
          icon={StarIcon} 
          size={size} 
          className={s <= rating ? "text-accent fill-accent" : "text-accent/10"} 
        />
      ))}
    </div>
  )
}

export default ProductReviews
