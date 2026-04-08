import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import ReviewModuleService from "../../../modules/reviews/service"
import { REVIEWS_MODULE } from "../../../modules/reviews"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const reviewsModuleService: ReviewModuleService = req.scope.resolve(
    REVIEWS_MODULE
  )

  const [reviews, count] = await reviewsModuleService.listAndCountReviews()

  res.json({
    reviews,
    count
  })
}
