"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import React from "react"

/**
 * Use this component to create a Next.js `<Link />` that persists the current country code in the url,
 * without having to explicitly pass it as a prop.
 */
const isExternalHref = (href: string) =>
  /^(https?:\/\/|mailto:|tel:)/i.test(href)

const LocalizedClientLink = React.forwardRef<HTMLAnchorElement, {
  children?: React.ReactNode
  href: string
  className?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  passHref?: true
  [x: string]: any
}>(({
  children,
  href,
  ...props
}, ref) => {
  const { countryCode } = useParams()
  const localizedHref = isExternalHref(href) || href.startsWith("#")
    ? href
    : `/${countryCode}${href}`

  return (
    <Link href={localizedHref} ref={ref} {...props}>
      {children}
    </Link>
  )
})

LocalizedClientLink.displayName = "LocalizedClientLink"

export default LocalizedClientLink
