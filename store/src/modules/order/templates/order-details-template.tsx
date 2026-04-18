"use client"

import { HttpTypes } from "@medusajs/types"
import { Truck, CreditCard, Package, ChevronLeft, MapPin } from "lucide-react"
import LocalizedPrice from "@modules/common/components/localized-price"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { paymentInfoMap } from "@lib/constants"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  Note01Icon, 
  Package01Icon, 
  PackageCheck, 
  TruckDeliveryIcon, 
  Tick01Icon,
} from "@hugeicons/core-free-icons"
import React from "react"
import { getDeliveryEstimate } from "@lib/util/delivery-estimate"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]
  const paymentProviderId = payment?.provider_id || ""
  const paymentMethod = paymentInfoMap[paymentProviderId]?.title || "Payment Card"
  const deliveryEstimate = getDeliveryEstimate({
    countryCode: order.shipping_address?.country_code,
    baseDate: order.created_at,
  })

  const getStepLevel = () => {
    const fulfillmentStatus = order.fulfillment_status || ""
    const isDelivered = ["delivered", "fulfilled"].includes(fulfillmentStatus)
    const isShipped = ["shipped", "partially_shipped"].includes(fulfillmentStatus)
    const isPreparingShipment = ["requires_action", "not_fulfilled", "partially_fulfilled"].includes(fulfillmentStatus)
    const isValidated = ["captured", "authorized"].includes(order.payment_status)

    if (isDelivered) return 4
    if (isShipped) return 3
    if (isPreparingShipment) return 2
    if (isValidated) return 1
    return 0
  }

  const currentStep = getStepLevel()

  const steps = [
    { label: "Order Confirmed",   sub: "Order placed and confirmed",        icon: Note01Icon,         timestamp: order.created_at },
    { label: "Payment Validated", sub: "Payment captured successfully",      icon: PackageCheck,       timestamp: order.created_at },
    { label: "Preparing Shipment",sub: "Packaging your items",               icon: Package01Icon,      timestamp: null },
    { label: "Shipped",           sub: "Your order is on the way",           icon: TruckDeliveryIcon,  timestamp: null },
    { label: "Delivered",         sub: "Delivered to your address",          icon: Tick01Icon,         timestamp: null },
  ]

  const isInProgress = currentStep < 4

  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-[1100px] mx-auto pb-20 md:pb-28">

        {/* Header */}
        <div className="flex flex-col gap-8 mb-14 animate-in fade-in slide-in-from-top-4 duration-700">
          <LocalizedClientLink
            href="/account/orders"
            className="inline-flex items-center gap-2 text-accent/50 hover:text-accent font-manrope text-[11px] uppercase font-bold tracking-widest transition-colors w-fit"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Orders
          </LocalizedClientLink>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="font-manrope text-[10px] font-bold uppercase tracking-[0.4em] text-accent/30">Order Tracking</span>
              <h1 className="font-newsreader italic text-4xl md:text-5xl text-accent">Order #{order.display_id}</h1>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-manrope text-[12px] text-accent/40 font-semibold">
                Placed on {new Date(order.created_at).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              <p className="font-manrope text-[12px] text-accent/50 mt-1">
                Estimated delivery by <span className="font-bold text-accent/70">{deliveryEstimate.formattedDate}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">

          {/* LEFT — Timeline + Items + Address */}
          <div className="flex flex-col gap-10">

            {/* ── Myntra-style Vertical Timeline Card ── */}
            <div className="border border-accent/10 bg-secondary shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Card Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-accent/5">
                <span className="font-manrope text-[12px] font-bold uppercase tracking-[0.25em] text-accent/60">Timeline</span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  isInProgress
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-green-50 text-green-600 border border-green-200"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isInProgress ? "bg-blue-500 animate-pulse" : "bg-green-500"}`} />
                  {isInProgress ? "In Progress" : "Delivered"}
                </span>
              </div>

              {/* Steps */}
              <div className="px-6 py-2">
                {steps.map((step, index) => {
                  const isDone   = index < currentStep
                  const isActive = index === currentStep
                  const isPending= index > currentStep

                  return (
                    <div key={index} className="flex gap-5 relative">

                      {/* Vertical connector line */}
                      {index < steps.length - 1 && (
                        <div
                          className={`absolute left-[23px] top-12 w-[2px] h-[calc(100%-12px)] transition-all duration-700 ${
                            isDone ? "bg-accent" : "bg-accent/10"
                          }`}
                        />
                      )}

                      {/* Icon circle */}
                      <div className="flex-shrink-0 pt-5 z-10">
                        <div className={`w-[46px] h-[46px] rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                          isDone
                            ? "bg-accent border-accent text-bg shadow-md"
                            : isActive
                              ? "bg-accent border-accent text-bg shadow-xl scale-110"
                              : "bg-bg border-accent/15 text-accent/25"
                        }`}>
                          {isActive && (
                            <span className="absolute w-[46px] h-[46px] rounded-full border-2 border-accent animate-ping opacity-20" />
                          )}
                          <HugeiconsIcon icon={step.icon} size={18} />
                        </div>
                      </div>

                      {/* Text */}
                      <div className={`flex-1 flex flex-col py-5 border-b border-accent/5 last:border-0 ${isPending ? "opacity-35" : ""}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className={`font-manrope text-[14px] font-bold mb-0.5 ${isActive || isDone ? "text-accent" : "text-accent/40"}`}>
                              {step.label}
                            </p>
                            <p className="font-manrope text-[12px] text-accent/40 leading-snug">{step.sub}</p>
                          </div>
                          {(isDone || isActive) && step.timestamp && (
                            <span className="font-manrope text-[10px] text-accent/40 font-semibold whitespace-nowrap flex-shrink-0 pt-0.5">
                              {new Date(step.timestamp).toLocaleDateString("en-US", { day: "numeric", month: "short" })}
                              {", "}
                              {new Date(step.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer CTA */}
              <div className="px-6 py-5 bg-accent/[0.02] border-t border-accent/5 flex items-center gap-3">
                <MapPin className="w-4 h-4 text-accent/30 flex-shrink-0" />
                <p className="font-manrope text-[12px] text-accent/50 leading-snug">
                  Delivering to <span className="font-bold text-accent/70">{order.shipping_address?.address_1}, {order.shipping_address?.city}</span> by <span className="font-bold text-accent/70">{deliveryEstimate.formattedDate}</span>
                </p>
              </div>
            </div>

            {/* ── Items ── */}
            <section className="animate-in fade-in duration-700 delay-200 fill-mode-both">
              <h2 className="font-manrope text-[12px] font-bold text-accent/50 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
                <Package className="w-4 h-4" /> Items in this order
              </h2>
              <div className="flex flex-col border border-accent/10 bg-secondary shadow-sm overflow-hidden">
                {order.items?.map((item, idx) => (
                  <LocalizedClientLink 
                    key={item.id} 
                    href={`/products/${item.variant?.product?.handle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex gap-5 p-5 md:p-6 transition-colors hover:bg-accent/[0.02]"
                  >
                    <div className="w-[72px] h-[90px] bg-accent/[0.03] overflow-hidden flex-shrink-0 border border-accent/8">
                      <Thumbnail thumbnail={item.thumbnail} size="square" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-manrope text-[15px] font-bold text-accent mb-1">{item.product_title}</p>
                          <p className="font-manrope text-[11px] text-accent/40 uppercase tracking-widest font-semibold">{item.variant_title || "Default"}</p>
                          <p className="font-manrope text-[11px] text-accent/40 mt-1 font-bold">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-manrope text-[14px] font-bold text-accent flex-shrink-0">
                          <LocalizedPrice amount={item.total || 0} />
                        </p>
                      </div>
                    </div>
                  </LocalizedClientLink>
                ))}
              </div>
            </section>

            {/* ── Delivery + Payment ── */}
            <div className="grid sm:grid-cols-2 gap-6 animate-in fade-in duration-700 delay-300 fill-mode-both">
              <section className="p-7 border border-accent/10 bg-secondary shadow-sm">
                <h2 className="font-manrope text-[11px] font-bold text-accent/40 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5" /> Delivery Address
                </h2>
                <div className="font-manrope text-[13px] text-accent leading-relaxed">
                  <p className="font-bold mb-1 text-[14px]">{order.shipping_address?.first_name} {order.shipping_address?.last_name}</p>
                  <p className="text-accent/60">{order.shipping_address?.address_1}{order.shipping_address?.address_2 ? ", " + order.shipping_address.address_2 : ""}</p>
                  <p className="text-accent/60">{order.shipping_address?.city}, {order.shipping_address?.postal_code}</p>
                  {order.shipping_address?.phone && <p className="text-accent/60 mt-2">{order.shipping_address.phone}</p>}
                </div>
              </section>

              <section className="p-7 border border-accent/10 bg-secondary shadow-sm">
                <h2 className="font-manrope text-[11px] font-bold text-accent/40 uppercase tracking-[0.25em] mb-5 flex items-center gap-2">
                  <CreditCard className="w-3.5 h-3.5" /> Payment
                </h2>
                <div className="font-manrope text-[13px] text-accent leading-relaxed">
                  <p className="font-bold mb-1 text-[14px]">{paymentMethod}</p>
                  {!!payment?.data?.card_last4 && (
                    <p className="text-accent/60 tracking-[0.15em]">**** **** **** {String(payment.data.card_last4)}</p>
                  )}
                  <p className="mt-2 uppercase tracking-widest text-[10px] font-bold text-accent/40">
                    {(order.payment_status || "pending").replace(/_/g, " ")}
                  </p>
                </div>
              </section>
            </div>

          </div>

          {/* RIGHT — Price Summary */}
          <div className="animate-in fade-in duration-700 delay-[400ms] fill-mode-both">
            <div className="sticky top-28 bg-accent text-bg p-9 flex flex-col gap-8 shadow-2xl">
              <h2 className="font-newsreader italic text-3xl">Price Details</h2>

              <div className="flex flex-col gap-4 font-manrope text-[13px] text-bg/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-bg"><LocalizedPrice amount={order.item_subtotal || 0} /></span>
                </div>
                {order.discount_total > 0 && (
                  <div className="flex justify-between text-green-400 font-bold">
                    <span>Discount</span>
                    <span>- <LocalizedPrice amount={order.discount_total} /></span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-bold text-bg">
                    {order.shipping_total === 0 ? "Free" : <LocalizedPrice amount={order.shipping_total || 0} />}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ETA</span>
                  <span className="font-bold text-bg">{deliveryEstimate.formattedDate}</span>
                </div>
                {order.tax_total > 0 && (
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span className="font-bold text-bg"><LocalizedPrice amount={order.tax_total} /></span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-bg/20 pt-7 flex justify-between items-end">
                <div className="flex flex-col gap-1.5">
                  <span className="font-manrope text-[10px] uppercase font-bold tracking-[0.2em] text-bg/40">Total Paid</span>
                  <span className="font-newsreader italic text-4xl leading-none">
                    <LocalizedPrice amount={order.total || 0} />
                  </span>
                </div>
              </div>

              <LocalizedClientLink
                href="/store"
                className="w-full py-5 bg-bg text-accent font-manrope text-[12px] font-bold tracking-[0.3em] uppercase hover:bg-bg/90 transition-all text-center"
              >
                Continue Shopping
              </LocalizedClientLink>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
