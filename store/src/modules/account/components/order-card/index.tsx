import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Note01Icon, 
  Package01Icon, 
  PackageCheck, 
  TruckDeliveryIcon, 
  Tick01Icon,
  CheckListIcon
} from "@hugeicons/core-free-icons"
import { HttpTypes } from "@medusajs/types"
import Thumbnail from "@modules/products/components/thumbnail"

type OrderCardProps = {
  order: HttpTypes.StoreOrder
}

const OrderCard = ({ order }: OrderCardProps) => {
  const getStepLevel = () => {
    const isShipped = ["shipped", "partially_shipped"].includes(order.fulfillment_status)
    const isFulfilled = order.fulfillment_status === "fulfilled" || isShipped
    const isValidated = ["captured", "authorized"].includes(order.payment_status)

    if (isShipped) return 3
    if (isFulfilled) return 2
    if (isValidated) return 1
    return 0 // Default order placed
  }

  const currentStep = getStepLevel()

  const steps = [
    { label: "Placed", icon: Note01Icon },
    { label: "Validated", icon: PackageCheck },
    { label: "Prepared", icon: Package01Icon },
    { label: "In Transit", icon: TruckDeliveryIcon },
    { label: "Arrived", icon: Tick01Icon },
  ]

  return (
    <div className="font-manrope space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700" data-testid="order-card">
      
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-accent/5 pb-8">
        <div className="flex flex-col gap-2 text-left">
          <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent/30">Order Dossier</span>
          <h3 className="font-newsreader italic text-4xl text-accent tracking-tighter">#{order.display_id}</h3>
        </div>
        <div className="flex flex-col lg:items-end gap-1 text-left lg:text-right">
           <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-accent/30">Purchased On</span>
           <span className="font-manrope text-[13px] font-bold text-accent">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Cinematic Tracker */}
      <div className="relative py-12 px-2">
        <div className="flex justify-between items-center relative gap-4">
          {/* Tracker Background Line (Laser Thin) */}
          <div className="absolute top-6 left-0 right-0 h-[1px] bg-accent/5 -z-0" />
          
          {/* Active Line */}
          <div 
            className="absolute top-6 left-0 h-[1px] bg-accent transition-all duration-1000 ease-out z-0 shadow-[0_0_10px_rgba(23,37,33,0.2)]" 
            style={{ width: `${(currentStep / 4) * 100}%` }} 
          />

          {steps.map((step, index) => {
            const isActive = index <= currentStep
            const isLastActive = index === currentStep
            return (
              <div key={index} className="flex flex-col items-center gap-6 relative z-10 w-20">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-bg border-4 ${
                    isActive 
                      ? 'bg-accent text-bg shadow-xl scale-110' 
                      : 'bg-bg text-accent/20 border-accent/5'
                  }`}
                >
                   <HugeiconsIcon icon={step.icon} size={18}  />
                   
                   {isActive && !isLastActive && (
                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent border-2 border-bg rounded-full flex items-center justify-center">
                        <HugeiconsIcon icon={CheckListIcon} size={8} />
                     </div>
                   )}

                   {isLastActive && (
                      <div className="absolute inset-0 rounded-full border border-accent animate-ping opacity-20" />
                   )}
                </div>
                
                <div className="text-center flex flex-col gap-1">
                   <p className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${isActive ? 'text-accent' : 'text-accent/20'}`}>
                     {step.label}
                   </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Premium Product List */}
      <div className="bg-secondary/20 border border-accent/5 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-accent/5 flex justify-between items-center">
           <h4 className="text-[11px] font-bold uppercase tracking-[0.4em] text-accent/40">Manifest Items</h4>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent opacity-40" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">{order?.items?.length} Units</span>
           </div>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {order.items?.map((item) => (
            <div key={item.id} className="bg-bg/50 p-4 border border-accent/5 rounded-2xl flex gap-6 items-center group hover:bg-white transition-all duration-500">
              <div className="w-20 h-24 bg-secondary/30 rounded-xl overflow-hidden shrink-0 relative">
                <Thumbnail thumbnail={item.thumbnail} images={[]} size="full" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-accent/5 mix-blend-multiply transition-opacity group-hover:opacity-0" />
              </div>
              <div className="flex flex-col gap-2 text-left">
                 <p className="font-newsreader italic text-xl text-accent leading-none">{item.title}</p>
                 <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent/40">Specification</span>
                    <span className="text-[11px] font-bold text-accent/70 uppercase tracking-tighter">
                      {item.variant_title} • Qty {item.quantity}
                    </span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default OrderCard
