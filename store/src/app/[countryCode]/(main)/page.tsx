import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import ParallaxContentWrapper from "@modules/home/components/parallax-content-wrapper"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LuxurySection from "@modules/home/components/luxury-section"
import CollectionSection from "@modules/home/components/collection-section"
import { listCollections } from "@lib/data/collections"
import ProductSection from "@modules/home/components/product-section"
import FeaturesSection from "@modules/home/components/features-section"
import { InauguralDrop } from "@modules/home/components/inaugural-drop"
import SmoothScroll from "@modules/common/components/smooth-scroll"
import Preloader from "@modules/common/components/preloader"

export const metadata: Metadata = {
  title: "Health and Wealth Club",
  description: "Your health and wealth store",
}

export const dynamic = 'force-dynamic'

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) return null

  const { response } = await listProducts({
    countryCode,
    queryParams: { limit: 100 },
  })

  const products = response.products
  const { collections } = await listCollections({ limit: "4" })

  return (
    <SmoothScroll>
      <Preloader />
      <Hero />
      
      {/* Content that slides over the sticky hero */}
      <div className="relative z-10 bg-bg shadow-[0_-50px_100px_rgba(0,0,0,0.15)]">
        <InauguralDrop products={products} />
        <LuxurySection />
        <ProductSection products={products} />
        <CollectionSection collections={collections} />
        <FeaturesSection />
      </div>
    </SmoothScroll>
  )
}
