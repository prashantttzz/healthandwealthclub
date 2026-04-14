"use client"

import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import LocalizedPrice from "@modules/common/components/localized-price"

type LineItemUnitPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
}

const LineItemUnitPrice = ({
  item,
  style = "default",
}: LineItemUnitPriceProps) => {
  const total = item.total ?? 0
  const original_total = item.original_total ?? 0
  const quantity = item.quantity ?? 1
  const hasReducedPrice = total < original_total

  const percentage_diff = original_total > 0 ? Math.round(
    ((original_total - total) / original_total) * 100
  ) : 0

  return (
    <div className="flex flex-col text-ui-fg-muted justify-center h-full">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-ui-fg-muted">Original: </span>
            )}
            <span
              className="line-through"
              data-testid="product-unit-original-price"
            >
              <LocalizedPrice amount={original_total / quantity} />
            </span>
          </p>
          {style === "default" && (
            <span className="text-ui-fg-interactive">-{percentage_diff}%</span>
          )}
        </>
      )}
      <span
        className={clx("text-base-regular", {
          "text-ui-fg-interactive": hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        <LocalizedPrice amount={total / quantity} />
      </span>
    </div>
  )
}

export default LineItemUnitPrice
