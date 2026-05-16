import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import ParallaxContentWrapper from "@modules/home/components/parallax-content-wrapper"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { listCollections, getCollectionByHandle } from "@lib/data/collections"
import Preloader from "@modules/common/components/preloader"
import dynamic from "next/dynamic"
import CategoryStickyScroll from "@modules/home/components/collection-section"

const InauguralDrop = dynamic(() => import("@modules/home/components/inaugural-drop").then(mod => mod.InauguralDrop))
const LuxurySection = dynamic(() => import("@modules/home/components/luxury-section"))
const FeaturesSection = dynamic(() => import("@modules/home/components/features-section"))

export const metadata: Metadata = {
  title: "Health and Wealth Club",
  description: "Your health and wealth store",
}

export const revalidate = 3600

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const [region, { collections }] = await Promise.all([
    getRegion(countryCode),
    listCollections({ limit: "4" }),
  ])

  if (!region) {
    return null
  }

  // Get products for the home-page-collection
  let products: any[] = []
  try {
    const collection = await getCollectionByHandle("home-page-collection")
    if (collection) {
      const { response } = await listProducts({
        countryCode,
        queryParams: { collection_id: [collection.id], limit: 9 },
      })
      products = response.products
    }
  } catch (error) {
    console.error("Error fetching home-page-collection:", error)
  }

  // Fallback to general products if collection is empty or not found
  if (products.length === 0) {
    const { response } = await listProducts({
      countryCode,
      queryParams: { limit: 9 },
    })
    products = response.products
  }

  return (
     <>
      <Preloader />
      <Hero />
      <ParallaxContentWrapper>
        <InauguralDrop products={products.slice(0, 4)} />
        <LuxurySection />
        <CategoryStickyScroll collections={collections} />
        <FeaturesSection />
      </ParallaxContentWrapper>
      </>
  )
}
