import { Metadata } from "next"

import StoreTemplate from "@modules/store/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-dropdown"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

export const revalidate = 3600

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string

    search?: string
    category?: string
    size?: string
    color?: string
    collection?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, search, category, size, color, collection } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}

      search={search}
      category={category}
      size={size}
      color={color}
      collection={collection}
      countryCode={params.countryCode}
    />
  )
}
