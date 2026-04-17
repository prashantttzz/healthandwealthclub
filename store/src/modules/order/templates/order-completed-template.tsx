import { cookies as nextCookies } from "next/headers"
import { HttpTypes } from "@medusajs/types"
import { Check, Truck, CreditCard, Package } from "lucide-react"
import LocalizedPrice from "@modules/common/components/localized-price"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { paymentInfoMap } from "@lib/constants"
import OnboardingCta from "@modules/order/components/onboarding-cta"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  const payment = order.payment_collections?.[0]?.payments?.[0]
  const paymentProviderId = payment?.provider_id || ""
  const paymentMethod = paymentInfoMap[paymentProviderId]?.title || "Payment Card"

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24">
        {/* Onboarding */}
        {isOnboarding && <div className="mb-12"><OnboardingCta orderId={order.id} /></div>}

        {/* Success Header */}
        <div className="flex flex-col items-center text-center mb-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="w-24 h-24 bg-green-500/10 flex items-center justify-center rounded-full mb-8 shadow-inner border border-green-500/20">
            <Check className="w-12 h-12 text-green-500" strokeWidth={2.5} />
          </div>
          <h1 className="font-newsreader italic text-5xl md:text-6xl text-accent mb-6">Thank you.</h1>
          <p className="font-manrope text-[15px] text-accent/60 max-w-lg leading-relaxed">
            Your order <span className="font-bold text-accent">#{order.display_id}</span> has been successfully placed. We've sent your confirmation and tracking details to <span className="font-bold text-accent border-b border-accent/20 pb-0.5">{order.email}</span>.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-16 lg:gap-24 items-start">
          
          {/* LEFT COL - Items & Details */}
          <div className="flex flex-col gap-16 animate-in fade-in duration-700 delay-150 fill-mode-both">
            
            {/* Items */}
            <section>
              <h2 className="font-manrope text-[13px] font-bold text-accent uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <Package className="w-5 h-5 text-accent/30" /> Order Items
              </h2>
              <div className="flex flex-col border border-accent/10 bg-secondary shadow-sm">
                {order.items?.map((item, idx) => (
                  <div key={item.id} className={`flex gap-6 p-6 md:p-8 ${idx !== 0 ? "border-t border-accent/10" : ""}`}>
                    <div className="w-[90px] h-[110px] bg-accent/[0.03] overflow-hidden flex-shrink-0 border border-accent/5">
                      <Thumbnail thumbnail={item.thumbnail} size="square" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-manrope text-[16px] font-bold text-accent mb-1.5">{item.product_title}</p>
                          <p className="font-manrope text-[12px] text-accent/40 uppercase tracking-widest font-semibold">{item.variant_title || "Default"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-manrope text-[15px] font-bold text-accent">
                            <LocalizedPrice amount={item.total || 0} />
                          </p>
                          <p className="font-manrope text-[11px] text-accent/40 mt-1.5 font-bold">QTY: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery & Payment Info */}
            <div className="grid sm:grid-cols-2 gap-8">
              <section className="p-8 border border-accent/10 bg-black/[0.02] shadow-sm">
                <h2 className="font-manrope text-[12px] font-bold text-accent/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <Truck className="w-4 h-4" /> Delivery Address
                </h2>
                <div className="font-manrope text-[14px] text-accent leading-relaxed">
                  <p className="font-bold mb-2 tracking-wide text-[15px]">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                  <p className="text-accent/60">{order.shipping_address?.address_1} {order.shipping_address?.address_2}</p>
                  <p className="text-accent/60">{order.shipping_address?.city}, {order.shipping_address?.postal_code}</p>
                  <p className="text-accent/60 mt-3">{order.shipping_address?.phone}</p>
                </div>
              </section>
              
              <section className="p-8 border border-accent/10 bg-black/[0.02] shadow-sm">
                <h2 className="font-manrope text-[12px] font-bold text-accent/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <CreditCard className="w-4 h-4" /> Payment Details
                </h2>
                <div className="font-manrope text-[14px] text-accent leading-relaxed">
                  <p className="font-bold mb-2 tracking-wide text-[15px]">{paymentMethod}</p>
                  {payment?.data?.card_last4 && (
                    <p className="text-accent/60 flex items-center gap-2 mt-1">
                      <span className="tracking-[0.15em]">**** **** **** {payment.data.card_last4 as string}</span>
                    </p>
                  )}
                  <p className="text-accent/60 mt-3 uppercase tracking-widest text-[11px] font-bold">
                     Status: {(order.payment_status || "Pending").replace("_", " ")}
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* RIGHT COL - Summary */}
          <div className="animate-in fade-in duration-700 delay-300 fill-mode-both">
            <div className="sticky top-32 bg-accent text-bg p-10 flex flex-col gap-10 shadow-2xl">
              <h2 className="font-newsreader italic text-3xl">Order Summary</h2>
              
              <div className="flex flex-col gap-5 font-manrope text-[13px] uppercase tracking-[0.15em] text-bg/70">
                <div className="flex justify-between"><span>Subtotal</span><span className="text-bg font-semibold"><LocalizedPrice amount={order.item_subtotal || 0} /></span></div>
                
                {order.discount_total > 0 && (
                  <div className="flex justify-between text-green-400 font-bold"><span>Discount</span><span>- <LocalizedPrice amount={order.discount_total} /></span></div>
                )}
                
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-bg font-semibold">
                    {order.shipping_total === 0 ? "Free" : <LocalizedPrice amount={order.shipping_total || 0} />}
                  </span>
                </div>
                
                {order.tax_total > 0 && (
                  <div className="flex justify-between"><span>Taxes</span><span className="text-bg font-semibold"><LocalizedPrice amount={order.tax_total} /></span></div>
                )}
              </div>

              <div className="border-t border-dashed border-bg/20 pt-8 flex justify-between items-end">
                 <div className="flex flex-col gap-2">
                   <span className="font-manrope text-[11px] uppercase font-bold tracking-[0.2em] text-bg/50">Total Paid</span>
                   <span className="font-newsreader italic text-4xl leading-none"><LocalizedPrice amount={order.total || 0} /></span>
                 </div>
              </div>

              <LocalizedClientLink 
                href="/store" 
                className="w-full py-5 bg-bg text-accent font-manrope text-[13px] font-bold tracking-[0.3em] uppercase hover:bg-bg/90 transition-all text-center mt-2">
                Continue Shopping
              </LocalizedClientLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
