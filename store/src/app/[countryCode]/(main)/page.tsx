import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import ParallaxContentWrapper from "@modules/home/components/parallax-content-wrapper"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { listCollections } from "@lib/data/collections"
import SmoothScroll from "@modules/common/components/smooth-scroll"
import Preloader from "@modules/common/components/preloader"
import dynamic from "next/dynamic"

const InauguralDrop = dynamic(() => import("@modules/home/components/inaugural-drop").then(mod => mod.InauguralDrop))
const LuxurySection = dynamic(() => import("@modules/home/components/luxury-section"))
const ProductSection = dynamic(() => import("@modules/home/components/product-section"))
const CollectionSection = dynamic(() => import("@modules/home/components/collection-section"))
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
    <SmoothScroll>
      <Preloader />
      <Hero />
      <ParallaxContentWrapper>
        <InauguralDrop products={products} />
        <LuxurySection />
        <ProductSection products={products} />
        <CollectionSection collections={collections} />
        <FeaturesSection />
      </ParallaxContentWrapper>
    </SmoothScroll>
  )
}
