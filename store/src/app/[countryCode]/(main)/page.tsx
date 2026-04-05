import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import ParallaxContentWrapper from "@modules/home/components/parallax-content-wrapper"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import AboutSection from "@modules/home/components/about-seection"

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

        <div className="py-12 lg:py-20 px-6 lg:px-0 lg:pl-20 w-full max-w-[1440px] mx-auto">
          <div className="flex items-center gap-4 lg:gap-10 mb-10 lg:mb-20">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light whitespace-nowrap font-gilda">
              The Inaugural Drop
            </h2>
            <div className="bg-black h-[1px] lg:h-1 flex-grow" />
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
            {products.map((product) => (
              <li key={product.id} className="flex justify-center">
                <ProductPreview product={product} />
              </li>
            ))}
          </ul>
        </div>
        <AboutSection />
      </ParallaxContentWrapper>

    </>
  )
}