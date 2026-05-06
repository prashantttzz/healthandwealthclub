import { Metadata } from "next"
import { notFound } from "next/navigation"

import { listProducts } from "@lib/data/products"
import { PRODUCT_DETAIL_FIELDS } from "@lib/constants"
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
    queryParams: { handle: params.handle, fields: "title,description,thumbnail" },
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
    alternates: {
      canonical: `/${params.countryCode}/products/${params.handle}`,
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
      queryParams: { handle: params.handle, fields: PRODUCT_DETAIL_FIELDS },
    })
  ])

  const fetchedProduct = response.products[0]

  if (!region || !fetchedProduct) {
    notFound()
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": fetchedProduct.title,
            "image": fetchedProduct.thumbnail,
            "description": fetchedProduct.description,
            "sku": fetchedProduct.variants?.[0]?.sku,
            "brand": {
              "@type": "Brand",
              "name": "HEALTH & WEALTH CLUB"
            },
            "offers": {
              "@type": "Offer",
              "url": `${process.env.NEXT_PUBLIC_BASE_URL}/${params.countryCode}/products/${params.handle}`,
              "priceCurrency": "USD", // Should ideally be dynamic
              "price": fetchedProduct.variants?.[0]?.calculated_price?.calculated_amount,
              "availability": fetchedProduct.variants?.some(v => !v.manage_inventory || (v.inventory_quantity || 0) > 0) 
                ? "https://schema.org/InStock" 
                : "https://schema.org/OutOfStock",
            }
          })
        }}
      />
      <ProductTemplate
        product={fetchedProduct}
        region={region}
        countryCode={params.countryCode}
        searchParams={searchParams}
        relatedProducts={
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts product={fetchedProduct} countryCode={params.countryCode} />
          </Suspense>
        }
      />
    </>
  )
}