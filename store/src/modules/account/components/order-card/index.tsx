import { HttpTypes } from "@medusajs/types"
import Thumbnail from "@modules/products/components/thumbnail"
import { ChevronRight } from "lucide-react"
import { convertToLocale } from "@lib/util/money"
import { getDeliveryEstimate } from "@lib/util/delivery-estimate"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  shipped: { label: "Shipped", color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-500" },
  partially_shipped: { label: "Partially Shipped", color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-400" },
  fulfilled: { label: "Fulfilled", color: "bg-green-50 text-green-600 border-green-200", dot: "bg-green-500" },
  not_fulfilled: { label: "Processing", color: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-500" },
  canceled: { label: "Cancelled", color: "bg-red-50 text-red-600 border-red-200", dot: "bg-red-500" },
  returned: { label: "Returned", color: "bg-gray-100 text-gray-500 border-gray-200", dot: "bg-gray-400" },
  delivered: { label: "Delivered", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-600" },
}

const OrderCard = ({ order }: OrderCardProps) => {
  const status = order.fulfillment_status || "not_fulfilled"
  const cfg = statusConfig[status] ?? { label: "Placed", color: "bg-accent/5 text-accent/60 border-accent/10", dot: "bg-accent/40" }
  const deliveryEstimate = getDeliveryEstimate({
    countryCode: order.shipping_address?.country_code,
    baseDate: order.created_at,
  })

  const previewItems = order.items?.slice(0, 3) ?? []
  const extraCount = (order.items?.length ?? 0) - previewItems.length

  return (
    <div
      className="font-manrope group animate-in fade-in slide-in-from-bottom-2 duration-500"
      data-testid="order-card"
    >
      <div className="flex items-center gap-4 sm:gap-8 py-6 sm:py-8 px-1">
        <div className="flex-shrink-0 flex items-center -space-x-8 sm:space-x-3">
          {previewItems.map((item, index) => (
            <div
              key={item.id}
              className={`w-16 h-20 bg-accent/[0.03] border border-accent/10 overflow-hidden flex-shrink-0 shadow-sm transition-transform ${
                index > 0 ? "hidden sm:block" : "block sm:z-0 z-[1] ring-2 ring-bg sm:ring-0"
              }`}
            >
              <Thumbnail 
                thumbnail={item.variant?.images?.[0]?.url || item.thumbnail} 
                images={item.variant?.images?.length ? item.variant.images : item.variant?.product?.images}
                size="square" 
              />
            </div>
          ))}
          {extraCount > 0 && (
            <div className="w-16 h-20 bg-accent/5 border border-dashed border-accent/20 flex items-center justify-center flex-shrink-0 hidden sm:flex">
              <span className="font-manrope text-[11px] font-bold text-accent/40">+{extraCount}</span>
            </div>
          )}
          {order.items && order.items.length > 1 && (
            <div className="sm:hidden w-16 h-20 bg-accent/5 border border-accent/10 flex items-center justify-center flex-shrink-0 z-0 -translate-x-12">
              <span className="font-manrope text-[11px] font-bold text-accent/40">+{order.items.length - 1}</span>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-0.5 sm:gap-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-0.5">
            <h3 className="font-newsreader italic text-xl sm:text-2xl text-accent leading-none truncate pr-2">
              {order.items && order.items.length > 0
                ? order.items.length > 1
                  ? `${order.items[0].title} + ${order.items.length - 1}`
                  : order.items[0].title
                : `Order #${order.display_id}`}
            </h3>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-widest border w-fit ${cfg.color}`}>
              <span className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 sm:gap-1">
            <p className="font-manrope text-[11px] sm:text-[12px] text-accent font-bold tracking-wide">
              Order #{order.display_id}
              <span className="mx-1 opacity-20">|</span>
              {new Date(order.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
            </p>
            <p className="font-manrope text-[12px] sm:text-[13px] text-accent/60 font-medium truncate">
              {convertToLocale({
                amount: order.total ?? 0,
                currency_code: order.currency_code ?? "USD",
              })}
              {" · "}
              {order.items?.length} {order.items?.length === 1 ? "item" : "items"}
              {order.shipping_address?.city && (
                <span className="hidden xs:inline">
                  {" · "} Delivering to {order.shipping_address.city}
                </span>
              )}
            </p>
            <p className="font-manrope text-[10px] sm:text-[11px] text-accent/35 uppercase tracking-[0.14em]">
              Delivery ETA: <span className="font-bold text-accent/60">{deliveryEstimate.formattedDate}</span>
            </p>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 text-accent/20 group-hover:text-accent transition-colors duration-300">
          <span className="font-manrope text-[11px] font-bold uppercase tracking-widest hidden lg:block">Details</span>
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

export default OrderCard
