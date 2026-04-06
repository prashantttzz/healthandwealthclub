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
        <div className="p-20 py-32 w-full  mx-auto">
          <div className="w-full items-center justify-center flex flex-col">

            <h2 className="text-2xl md:text-3xl lg:text-4xl  whitespace-nowrap font-newsreader ">
              The <span className="italic ">Inaugural Drop</span>
            </h2>
            <p className="font-manrope tracking-widest font-semibold text-black/90 uppercase text-[12px] mt-2">EXPLORE THE PILLARS OF INTENTIONAL LIVING AND TIMELESS STYLE</p>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-12 mt-10">
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