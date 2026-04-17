import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import ParallaxContentWrapper from "@modules/home/components/parallax-content-wrapper"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { listCollections } from "@lib/data/collections"
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

  const [region, { response }, { collections }] = await Promise.all([
    getRegion(countryCode),
    listProducts({
      countryCode,
      queryParams: { limit: 9 },
    }),
    listCollections({ limit: "4" }),
  ])

  const products = response.products

  if (!region) {
    return null
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
