import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex items-center justify-between border-b border-black/5 pb-8">
        <Heading className="font-newsreader italic text-4xl md:text-5xl text-accent">
          Your Collection
        </Heading>
        <span className="font-manrope text-[11px] uppercase tracking-[0.2em] font-bold text-accent/30">
          {items?.length || 0} {items?.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>
      <Table className="border-collapse bg-transparent">
        <Table.Header className="border-t-0 bg-transparent hidden md:table-header-group">
          <Table.Row className="text-accent/60 !bg-transparent border-b border-black/5">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
                .sort((a, b) => {
                  return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      currencyCode={cart?.currency_code}
                    />
                  )
                })
            : repeat(5).map((i) => {
                return <SkeletonLineItem key={i} />
              })}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
