"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronRight } from "lucide-react"
import { clx } from "@medusajs/ui"


type BreadcrumbProps = {
  items: {
    label: string
    href?: string
  }[]
  className?: string
}

const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
  return (
    <nav className={clx("flex items-center gap-2 text-[15px] font-regular tracking-wide", className)}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <LocalizedClientLink 
              href={item.href} 
              className="text-accent/50 hover:text-accent transition-colors"
            >
              {item.label}
            </LocalizedClientLink>
          ) : (
            <span className="text-accent font-regular">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <ChevronRight className="w-3 h-3 text-accent/20" strokeWidth={3} />
          )}
        </div>
      ))}
    </nav>
  )
}

export default Breadcrumb
