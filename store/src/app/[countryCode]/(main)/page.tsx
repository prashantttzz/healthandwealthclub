import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import ParallaxContentWrapper from "@modules/home/components/parallax-content-wrapper"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import LuxurySection from "@modules/home/components/luxury-section"
import CollectionSection from "@modules/home/components/collection-section"
import ProductSection from "@modules/home/components/product-section"
import FeaturesSection from "@modules/home/components/features-section"
import { InauguralDrop } from "@modules/home/components/inaugural-drop"

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
  return (
    <>
      <Hero />
      <ParallaxContentWrapper>
        <InauguralDrop products={products} />
        <LuxurySection />
        <ProductSection />
        <CollectionSection />
        <FeaturesSection />
      </ParallaxContentWrapper>
    </>
  )
}
