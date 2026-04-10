import { Metadata } from "next"

import StoreTemplate from "@modules/store/templates"
import { sortOptions } from "@modules/store/components/refinement-list/sort-dropdown"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: sortOptions
    page?: string

    search?: string
    category?: string
    size?: string
    color?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, search, category, size, color } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}

      search={search}
      category={category}
      size={size}
      color={color}
      countryCode={params.countryCode}
    />
  )
}
