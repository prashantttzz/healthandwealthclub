"use client"

import { clx } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function Pagination({
  page,
  totalPages,
  'data-testid': dataTestid
}: {
  page: number
  totalPages: number
  'data-testid'?: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Helper function to generate an array of numbers within a range
  const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index)

  // Function to handle page changes
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  // Function to render a page button
  const renderPageButton = (
    p: number,
    label: string | number,
    isCurrent: boolean
  ) => (
    <button
      key={p}
      className={clx(
        "flex items-center justify-center min-w-[32px] md:min-w-[40px] aspect-square rounded-lg text-[11px] font-bold transition-all duration-300",
        {
          "bg-accent text-bg shadow-lg": isCurrent,
          "text-accent/40 hover:bg-accent/5 hover:text-accent": !isCurrent,
        }
      )}
      disabled={isCurrent}
      onClick={() => handlePageChange(p)}
    >
      {label}
    </button>
  )

  // Function to render ellipsis
  const renderEllipsis = (key: string) => (
    <span
      key={key}
      className="flex items-center justify-center min-w-[32px] md:min-w-[40px] aspect-square text-accent/20 cursor-default"
    >
      ...
    </span>
  )

  // Function to render page buttons based on the current page and total pages
  const renderPageButtons = () => {
    const buttons = []

    if (totalPages <= 5) {
      // Show all pages
      buttons.push(
        ...arrayRange(1, totalPages).map((p) =>
          renderPageButton(p, p, p === page)
        )
      )
    } else {
      // Handle different cases for displaying pages and ellipses
      if (page <= 3) {
        buttons.push(
          ...arrayRange(1, 4).map((p) => renderPageButton(p, p, p === page))
        )
        buttons.push(renderEllipsis("ellipsis1"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      } else if (page >= totalPages - 2) {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis2"))
        buttons.push(
          ...arrayRange(totalPages - 3, totalPages).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
      } else {
        buttons.push(renderPageButton(1, 1, 1 === page))
        buttons.push(renderEllipsis("ellipsis3"))
        buttons.push(
          ...arrayRange(page - 1, page + 1).map((p) =>
            renderPageButton(p, p, p === page)
          )
        )
        buttons.push(renderEllipsis("ellipsis4"))
        buttons.push(
          renderPageButton(totalPages, totalPages, totalPages === page)
        )
      }
    }

    return buttons
  }

  // Render the component
  return (
    <div className="flex flex-col items-center gap-6 w-full mt-24 py-8 border-t border-black/5">
      <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-accent/30">
        Page <span className="text-accent">{page}</span> of {totalPages}
      </div>
      
      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-accent disabled:opacity-20 hover:bg-accent/5 rounded-lg transition-all"
        >
          Previous
        </button>

        <div className="flex gap-1 md:gap-2 items-center" data-testid={dataTestid}>
          {renderPageButtons()}
        </div>

        <button 
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 text-[10px] uppercase font-bold tracking-widest text-accent disabled:opacity-20 hover:bg-accent/5 rounded-lg transition-all"
        >
          Next
        </button>
      </div>
    </div>
  )
}
