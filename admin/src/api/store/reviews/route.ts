import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import ReviewModuleService from "../../../modules/reviews/service"
import { REVIEWS_MODULE } from "../../../modules/reviews"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const reviewsModuleService: ReviewModuleService = req.scope.resolve(
    REVIEWS_MODULE
  )

  try {
    const body = req.body as any
    const reviewData = {
      id: `rev_${Math.random().toString(36).substring(2, 11)}`,
      product_id: body.product_id,
      customer_name: body.customer_name,
      rating: body.rating,
      comment: body.comment,
    }
    const review = await reviewsModuleService.createReviews([reviewData])
    res.json({ review })
  } catch (error: any) {
    console.error("POST /store/reviews - Error:", error)
    res.status(418).json({ 
      message: error.message || "Failed to create review",
      details: error
    })
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const reviewsModuleService: ReviewModuleService = req.scope.resolve(
    REVIEWS_MODULE
  )

  const product_id = req.query.product_id as string | undefined

  const filters: any = {}
  if (product_id) {
    filters.product_id = product_id
  }

  const [reviews, count] = await reviewsModuleService.listAndCountReviews(filters)
  console.log("Store get reviews for product", product_id, ":", reviews.length, count)

  res.json({
    reviews,
    count
  })
}
