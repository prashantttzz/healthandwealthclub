"use client"

import { Table, Text, clx, toast } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import QuantitySelector from "@modules/cart/components/item/quantity-selector"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  type?: "full" | "preview"
}

const Item = ({ item, type = "full" }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)

    const inventory = item.variant?.inventory_quantity
    const manageInventory = item.variant?.manage_inventory !== false

    if (quantity > item.quantity && manageInventory && typeof inventory === "number" && quantity > inventory) {
      toast.error("Maximum quantity reached for this item.")
      return
    }

    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .then((res) => {
        if (typeof res === "string") {
          throw new Error(res)
        }
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQuantity = item.variant?.manage_inventory === false 
    ? 100 
    : (item.variant?.inventory_quantity ?? 10)

  return (
    <>
      {/* Mobile Card View (< md) */}
      <div className="md:hidden flex flex-col gap-6 py-8 border-b border-black/5 w-full bg-transparent" data-testid="product-row-mobile">
        <div className="flex gap-6">
          <div className="w-24 shrink-0">
            <LocalizedClientLink href={`/products/${item.product_handle}`}>
              <Thumbnail
                thumbnail={item.variant?.images?.[0]?.url || item.thumbnail}
                images={item.variant?.images?.length ? item.variant.images : item.variant?.product?.images}
                size="square"
              />
            </LocalizedClientLink>
          </div>

          <div className="flex flex-col gap-2 flex-grow">
            <Text className="font-newsreader italic text-xl text-accent font-bold leading-tight">
              {item.product_title}
            </Text>
            <div className="font-manrope text-[11px] uppercase tracking-widest text-accent/60 font-bold">
              <LineItemOptions variant={item.variant} />
            </div>
            <LineItemUnitPrice item={item} style="tight" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-black/5">
          <div className="flex items-center gap-3">
            <span className="font-manrope text-[10px] uppercase font-bold text-accent/90 tracking-widest">Qty</span>
            <QuantitySelector
              quantity={item.quantity}
              onChange={(value) => changeQuantity(value)}
              maxQuantity={maxQuantity}
              loading={updating}
            />
          </div>
          <DeleteButton id={item.id} />
        </div>

        <div className="flex items-center justify-between">
          <span className="font-manrope text-[10px] uppercase font-bold text-accent/30 tracking-widest">Total cost</span>
          <LineItemPrice item={item} style="tight" />
        </div>
        <ErrorMessage error={error} />
      </div>

      {/* Desktop Table Row (>= md) */}
      <Table.Row className="hidden md:table-row !bg-transparent border-b border-black/5 last:border-0 grow-0" data-testid="product-row-desktop">
        <Table.Cell className="!pl-0 p-4 w-24 shrink-0">
          <LocalizedClientLink
            href={`/products/${item.product_handle}`}
            className="flex small:w-24 w-16"
          >
            <Thumbnail
              thumbnail={item.variant?.images?.[0]?.url || item.thumbnail}
              images={item.variant?.images?.length ? item.variant.images : item.variant?.product?.images}
              size="square"
            />
          </LocalizedClientLink>
        </Table.Cell>

        <Table.Cell className="text-left py-4">
          <div className="flex flex-col gap-1">
            <Text
              className="font-newsreader italic text-lg md:text-xl text-accent font-bold leading-tight"
              data-testid="product-title"
            >
              {item.product_title}
            </Text>
            <div className="font-manrope text-[11px] uppercase tracking-widest text-accent/60 font-bold">
               <LineItemOptions variant={item.variant} data-testid="product-variant" />
            </div>
          </div>
        </Table.Cell>

        {type === "full" && (
          <Table.Cell className="py-4">
            <div className="flex items-center gap-8">
              <QuantitySelector
                quantity={item.quantity}
                onChange={(value) => changeQuantity(value)}
                maxQuantity={maxQuantity}
                loading={updating}
              />
              <DeleteButton id={item.id} data-testid="product-delete-button" />
            </div>
            <ErrorMessage error={error} data-testid="product-error-message" />
          </Table.Cell>
        )}

        {type === "full" && (
          <Table.Cell className="hidden md:table-cell">
            <LineItemUnitPrice
              item={item}
              style="tight"
            />
          </Table.Cell>
        )}

        <Table.Cell className="!pr-0 text-right py-4">
          <LineItemPrice
            item={item}
            style="tight"
          />
        </Table.Cell>
      </Table.Row>
    </>
  )
}

export default Item
