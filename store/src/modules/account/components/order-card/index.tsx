import { useMemo } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import { HttpTypes } from "@medusajs/types"
import { ClipboardList, ClipboardCheck, Package, Truck, CheckCircle, Check } from "lucide-react"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  // Mock logic to determine current step based on Medusa status
  const getStepLevel = () => {
    if (order.fulfillment_status === "shipped") return 3
    if (order.fulfillment_status === "fulfilled") return 2
    if (order.payment_status === "captured") return 1
    return 0 // Default order placed
  }

  const currentStep = getStepLevel()

  const steps = [
    { label: "Order Placed", date: new Date(order.created_at).toLocaleDateString(), time: new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), icon: ClipboardList },
    { label: "Accepted", date: currentStep >= 1 ? new Date(order.updated_at).toLocaleDateString() : "Expected", time: "", icon: ClipboardCheck },
    { label: "In Progress", date: currentStep >= 2 ? "Done" : "Expected", time: "", icon: Package },
    { label: "On the Way", date: currentStep >= 3 ? "Done" : "Expected", time: "", icon: Truck },
    { label: "Delivered", date: currentStep >= 4 ? "Done" : "Expected", time: "", icon: CheckCircle },
  ]

  return (
    <div className="font-manrope space-y-8" data-testid="order-card">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-[14px] text-accent tracking-wide">Order Status</h3>
        <p className="text-[12px] text-accent/60 uppercase tracking-widest">Order ID: <span className="font-bold">#{order.display_id}</span></p>
      </div>

      {/* Tracker Graphic */}
      <div className="w-full bg-transparent border border-accent/10 rounded-2xl p-8 lg:p-10 shadow-sm relative">
        <div className="flex justify-between relative mb-8">
          {/* Connecting Line Backdrop */}
          <div className="absolute top-6 left-8 right-8 h-[2px] bg-black/5 -z-10" />
          
          {/* Connecting Line Active */}
          <div 
            className="absolute top-6 left-8 h-[2px] bg-[#3d2f20] -z-10 transition-all duration-500" 
            style={{ width: `${(currentStep / 4) * (100 - (16 / window.innerWidth * 100))}%` }} 
          />

          {steps.map((step, index) => {
            const isActive = index <= currentStep
            const Icon = step.icon
            return (
              <div key={index} className="flex flex-col items-center gap-3 relative bg-[#F2EDE5] px-2 h-full z-10">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-accent text-[#F2EDE5]' : 'bg-transparent border border-accent/10 text-accent/30'}`}>
                   <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                </div>
                
                {/* Active checkmark badge */}
                {isActive && (
                  <div className="absolute top-0 right-0 w-4 h-4 bg-accent rounded-full flex items-center justify-center border-2 border-[#F2EDE5] translate-x-1 -translate-y-1">
                    <Check size={10} className="text-[#F2EDE5]" strokeWidth={3} />
                  </div>
                )}

                <div className="text-center">
                   <p className={`text-[11px] font-bold tracking-wide uppercase ${isActive ? 'text-accent' : 'text-accent/30'}`}>{step.label}</p>
                   <p className="text-[10px] text-accent/50 mt-1">{step.date}</p>
                   {step.time && <p className="text-[9px] text-accent/40">{step.time}</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Products List */}
      <div className="w-full bg-transparent border border-accent/10 rounded-2xl shadow-sm overflow-hidden text-accent">
        <div className="px-8 py-5 border-b border-accent/10 bg-accent/5">
           <h3 className="text-[13px] font-bold tracking-wide">Products</h3>
        </div>
        
        <div className="flex flex-col">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-6 p-6 border-b border-accent/10 last:border-0 items-center">
              <div className="w-20 h-20 bg-accent/5 rounded-xl border border-accent/10 overflow-hidden shrink-0">
                <Thumbnail thumbnail={item.thumbnail} images={[]} size="full" className="object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                 <p className="font-bold text-[14px]">{item.title}</p>
                 <p className="text-[12px] text-accent/60">
                   Variant: {item.variant_title} | {item.quantity} Qty
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default OrderCard
