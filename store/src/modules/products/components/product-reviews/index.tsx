 import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { clx } from "@medusajs/ui"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import { sdk } from "@lib/config"
import { useRouter } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"

type Review = {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
}

const stripWrappingQuotes = (value: string) =>
  value.replace(/^[\s"'“”‘’]+|[\s"'“”‘’]+$/g, "")

const normalizeReviewComment = (value: string) =>
  value
    .trim()
    .replace(/^(?:["'\u201C\u201D\u2018\u2019]+\s*)+|(?:\s*["'\u201C\u201D\u2018\u2019]+)+$/g, "")

const ProductReviews = ({ productId }: { productId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)
  
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")
  const [isCheckingAuth, setIsCheckingAuth] = useState(false)
  const router = useRouter()

  const handleShareExperience = async () => {
    if (showForm) {
      setShowForm(false)
      return
    }

    setIsCheckingAuth(true)
    try {
      const customer = await retrieveCustomer()
      if (!customer) {
        router.push("/account")
      } else {
        // Pre-fill name if available
        if (customer.first_name && !name) {
          setName(`${customer.first_name} ${customer.last_name || ""}`.trim())
        }
        setShowForm(true)
      }
    } catch (e) {
      router.push("/account")
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const data = await sdk.client.fetch<{ reviews: Review[] }>(
        "/store/reviews",
        {
          method: "GET",
          query: {
            product_id: productId,
          },
        }
      )
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
      await sdk.client.fetch("/store/reviews", {
        method: "POST",
        body: {
          product_id: productId,
          customer_name: name,
          rating,
          comment,
        },
      })

      setShowForm(false)
      setRating(0)
      setName("")
      setComment("")
      fetchReviews()
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
    <div className="py-8 border-t border-black/5">
      <div className="mx-auto">
        <div className="flex flex-col gap-12">
          
          {/* TOP: SUMMARY */}
          <div className="w-full space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 items-center text-center md:items-start md:text-left">
              <div className="space-y-2 flex flex-col items-center md:items-start">
                <span className="font-manrope text-[9px] tracking-[0.3em] uppercase font-bold text-accent/30 block">
                  Social Proof
                </span>
                <h2 className="font-newsreader italic text-2xl lg:text-4xl leading-tight text-accent tracking-tight">
                  Customer Stories
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <div className="font-newsreader italic text-4xl text-accent">{averageRating}</div>
                <div className="space-y-0.5">
                  <StarRating rating={Math.round(Number(averageRating))} size={12} />
                  <p className="font-manrope text-[9px] tracking-widest uppercase text-accent/40 font-bold">
                    {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center md:justify-start">
              <button 
                onClick={handleShareExperience}
                disabled={isCheckingAuth}
                className="group flex items-center justify-center bg-accent text-bg px-8 py-3.5 rounded-md transition-all hover:opacity-90 disabled:opacity-75 disabled:cursor-wait min-w-[200px]"
              >
                <span className="font-manrope text-[10px] font-bold tracking-widest uppercase">
                  {isCheckingAuth ? "Authenticating..." : showForm ? "Close Form" : "Share a Review"}
                </span>
              </button>
            </div>
          </div>

          {/* BOTTOM: REVIEWS & FORM */}
          <div className="w-full">
            <AnimatePresence mode="wait">
              {showForm ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-secondary/50 border border-black/5 p-6 lg:p-8 space-y-10"
                >
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-1">
                      <h3 className="font-newsreader italic text-2xl text-accent leading-none">Submit Review</h3>
                      <p className="font-manrope text-[11px] text-accent/40">Refine the intentional lifestyle.</p>
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

                      <div className="grid grid-cols-1 gap-6">
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
                        className="w-full h-14 bg-accent text-bg font-manrope text-[10px] font-bold tracking-[0.3em] uppercase transition-all hover:opacity-90 disabled:opacity-50 mt-4"
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
                  className="space-y-8"
                >
                  {isLoading ? (
                    <p className="font-manrope text-[11px] uppercase tracking-widest text-accent/30 italic">Loading reviews...</p>
                  ) : reviews.length === 0 ? (
                    <div className="space-y-4">
                      <p className="font-manrope text-[13px] text-accent/40 italic">No reviews yet for this piece. Be the first to share your experience.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {reviews.slice(0, showAll ? undefined : 5).map((review) => (
                        <div key={review.id} className="bg-secondary/30 border border-black/5 rounded-xl p-4 lg:p-5 space-y-3 shadow-sm hover:shadow-md hover:bg-secondary/50 transition-all duration-300">
                          <div className="flex items-start justify-between">
                            <div className="space-y-0.5">
                              <h4 className="font-newsreader text-[15px] xl:text-[16px] font-semibold italic text-accent">{review.customer_name}</h4>
                              <span className="font-manrope text-[8px] tracking-widest uppercase text-accent/50 block font-semibold">{new Date(review.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}</span>
                            </div>
                            <StarRating rating={review.rating} size={11} />
                          </div>
                          <p className="font-manrope text-[12px] xl:text-[13px] leading-relaxed text-accent/70 max-w-xl">
                            {normalizeReviewComment(stripWrappingQuotes(review.comment))}
                          </p>
                          <div className="flex items-center gap-1 pt-0.5 text-accent/40">
                            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={11} className="text-accent/60" />
                            <span className="font-manrope text-[8px] tracking-widest uppercase italic font-bold">Verified Order</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {reviews.length > 5 && (
                    <div className="pt-2 text-center lg:text-left">
                      <button 
                        onClick={() => setShowAll(!showAll)}
                        className="font-manrope text-[9px] font-bold tracking-widest uppercase text-accent border-b border-accent pb-0.5 hover:opacity-50 transition-all"
                      >
                        {showAll ? "Show Less" : `Discover All ${reviews.length} Experiences`}
                      </button>
                    </div>
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
