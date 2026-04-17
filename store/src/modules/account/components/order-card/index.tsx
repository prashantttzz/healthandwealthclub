import { HttpTypes } from "@medusajs/types"
import Thumbnail from "@modules/products/components/thumbnail"
import { ChevronRight } from "lucide-react"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  shipped:          { label: "Shipped",       color: "bg-blue-50 text-blue-600 border-blue-200",   dot: "bg-blue-500"  },
  partially_shipped:{ label: "Partially Shipped", color: "bg-blue-50 text-blue-600 border-blue-200", dot: "bg-blue-400" },
  fulfilled:        { label: "Fulfilled",     color: "bg-green-50 text-green-600 border-green-200", dot: "bg-green-500" },
  not_fulfilled:    { label: "Processing",    color: "bg-amber-50 text-amber-600 border-amber-200", dot: "bg-amber-500" },
  canceled:         { label: "Cancelled",     color: "bg-red-50 text-red-600 border-red-200",       dot: "bg-red-500"   },
  returned:         { label: "Returned",      color: "bg-gray-100 text-gray-500 border-gray-200",   dot: "bg-gray-400"  },
  delivered:        { label: "Delivered",     color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-600" },
}

const OrderCard = ({ order }: OrderCardProps) => {
  const status = order.fulfillment_status || "not_fulfilled"
  const cfg = statusConfig[status] ?? { label: "Placed", color: "bg-accent/5 text-accent/60 border-accent/10", dot: "bg-accent/40" }

  const previewItems = order.items?.slice(0, 3) ?? []
  const extraCount  = (order.items?.length ?? 0) - previewItems.length

  return (
    <div
      className="font-manrope group animate-in fade-in slide-in-from-bottom-2 duration-500"
      data-testid="order-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-7 px-1">

        {/* Thumbnails */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {previewItems.map((item) => (
            <div
              key={item.id}
              className="w-16 h-20 bg-accent/[0.03] border border-accent/10 overflow-hidden flex-shrink-0"
            >
              <Thumbnail thumbnail={item.thumbnail} size="square" />
            </div>
          ))}
          {extraCount > 0 && (
            <div className="w-16 h-20 bg-accent/5 border border-dashed border-accent/20 flex items-center justify-center flex-shrink-0">
              <span className="font-manrope text-[11px] font-bold text-accent/40">+{extraCount}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <div className="flex items-start gap-3 flex-wrap">
            <h3 className="font-newsreader italic text-2xl text-accent leading-none">#{order.display_id}</h3>
            {/* Status pill */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>

          <p className="font-manrope text-[12px] text-accent/40 font-semibold tracking-wide">
            {new Date(order.created_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            {" · "}
            {order.items?.length} {order.items?.length === 1 ? "item" : "items"}
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 flex items-center gap-2 text-accent/30 group-hover:text-accent transition-colors duration-300">
          <span className="font-manrope text-[11px] font-bold uppercase tracking-widest hidden sm:block">View Details</span>
          <ChevronRight className="w-5 h-5" />
        </div>

      </div>
    </div>
  )
}

export default OrderCard
