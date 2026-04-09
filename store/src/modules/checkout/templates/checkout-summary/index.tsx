import { Heading } from "@medusajs/ui"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { Package, ShieldCheck, MapPin } from "lucide-react"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-0 lg:top-12 flex flex-col gap-y-12 py-12 lg:py-0">
      <div className="w-full bg-transparent flex flex-col">
        <Heading
          level="h2"
          className="font-newsreader italic text-3xl mb-8"
        >
          Order Summary
        </Heading>
        
        <div className="mb-10">
          <ItemsPreviewTemplate cart={cart} />
        </div>

        <div className="mb-10 border-t border-black/5 pt-10">
          <DiscountCode cart={cart} />
        </div>

        <div className="border-t border-black/5 pt-10">
          <CartTotals totals={cart} />
        </div>

        {/* Benefits Section */}
        <div className="mt-16 grid grid-cols-3 gap-4 pt-10 border-t border-black/5">
          <div className="flex flex-col items-center text-center gap-3">
             <Package size={20} className="text-accent/60" />
             <span className="font-manrope text-[9px] uppercase font-bold tracking-widest text-accent/40 leading-tight">Free<br/>Returns</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
             <ShieldCheck size={20} className="text-accent/60" />
             <span className="font-manrope text-[9px] uppercase font-bold tracking-widest text-accent/40 leading-tight">Authentic<br/>Quality</span>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
             <MapPin size={20} className="text-accent/60" />
             <span className="font-manrope text-[9px] uppercase font-bold tracking-widest text-accent/40 leading-tight">Dubai<br/>Based</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
