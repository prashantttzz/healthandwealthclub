import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

import RelatedProducts from "@modules/products/components/related-products"
import { Suspense } from "react"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { response } = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  })

  const product = response.products[0]

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Health and Wealth Club`,
    description: `${product.description}`,
    openGraph: {
      title: `${product.title} | Health and Wealth Club`,
      description: `${product.description}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export const revalidate = 1800

export default async function ProductPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams

  const [region, { response }] = await Promise.all([
    getRegion(params.countryCode),
    listProducts({
      countryCode: params.countryCode,
      queryParams: { handle: params.handle },
    })
  ])

  const fetchedProduct = response.products[0]

  if (!region || !fetchedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={fetchedProduct}
      region={region}
      countryCode={params.countryCode}
      relatedProducts={
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={fetchedProduct} countryCode={params.countryCode} />
        </Suspense>
      }
    />
  )
}