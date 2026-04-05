"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"

type Props = {
  params: { countryCode: string; handle: string }
  searchParams: { v_id?: string }
}

export default function ProductPage({ params, searchParams }: Props) {
  const [product, setProduct] = useState<HttpTypes.StoreProduct | null>(null)
  const [region, setRegion] = useState<HttpTypes.StoreRegion | null>(null)
  const [loading, setLoading] = useState(true)

  const selectedVariantId = searchParams.v_id

  useEffect(() => {
    async function fetchData() {
      try {
        const regionData = await getRegion(params.countryCode)
        if (!regionData) return notFound()

        const { response } = await listProducts({
          countryCode: params.countryCode,
          queryParams: { handle: params.handle },
        })

        const fetchedProduct = response.products[0]
        if (!fetchedProduct) return notFound()

        setProduct(fetchedProduct)
        setRegion(regionData)
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.countryCode, params.handle])

  if (loading) return <div>Loading...</div>
  if (!product || !region) return notFound()

  return (
    <ProductTemplate
      product={product}
      region={region}
      countryCode={params.countryCode}
      images={product.images||[]}
    />
  )
}