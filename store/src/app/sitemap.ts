import { MetadataRoute } from "next"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"
import { listCategories } from "@lib/data/categories"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://cityreach.in"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countryCode = process.env.NEXT_PUBLIC_DEFAULT_REGION || "in"

  // Fetch all products
  const { response: { products } } = await listProducts({
    countryCode,
    queryParams: { limit: 100 },
  })

  // Fetch all collections
  const { collections } = await listCollections({ limit: "100" })

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/${countryCode}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/${countryCode}/store`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ]

  // Product routes
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/${countryCode}/products/${product.handle}`,
    lastModified: new Date(product.updated_at || new Date()),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  // Collection routes
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((collection) => ({
    url: `${BASE_URL}/${countryCode}/store?collection=${collection.id}`,
    lastModified: new Date(collection.updated_at || new Date()),
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...collectionRoutes]
}
