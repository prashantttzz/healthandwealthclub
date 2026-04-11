"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Package from "@modules/common/icons/package"
import Medusa from "@modules/common/icons/medusa"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Specifications",
      component: <ProductInfoTab product={product} />,
      icon: <Package size={16} />,
    },
    {
      label: "The Experience",
      component: <EthosTab />,
      icon: <Medusa size={16} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
      icon: <FastDelivery size={16} />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            value={tab.label}
            icon={tab.icon}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const EthosTab = () => {
  return (
    <div className="py-2 space-y-6">
      <div className="space-y-4">
        <h4 className="font-manrope text-[10px] tracking-[0.2em] uppercase font-semibold text-accent">Craftsmanship</h4>
        <p className="font-manrope text-[13px] leading-relaxed text-accent/70">
          Every piece in our collective is a testament to the intersection of health, wealth, and timeless design. We source only the finest materials from heritage mills, ensuring that your investment matures in quality over time.
        </p>
      </div>
      <div className="space-y-4">
        <h4 className="font-manrope text-[10px] tracking-[0.2em] uppercase font-semibold text-accent">Ethos</h4>
        <p className="font-manrope text-[13px] leading-relaxed text-accent/70">
          We believe in conscious consumption—creating fewer, better things that serve a purpose in your daily ritual.
        </p>
      </div>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="py-2">
      <div className="grid grid-cols-2 gap-y-10 gap-x-12">
        <div className="space-y-2">
          <span className="font-manrope text-[10px] tracking-[0.2em] uppercase font-bold text-accent">Material</span>
          <p className="font-manrope text-[13px] text-accent/80 font-regular whitespace-pre-wrap">{product.material ? product.material : "Organic Cotton & Silk Blend"}</p>
        </div>
        <div className="space-y-2">
          <span className="font-manrope text-[10px] tracking-[0.2em] uppercase font-bold text-accent">Weight</span>
          <p className="font-manrope text-[13px] text-accent/80 font-regular">{product.weight ? `${product.weight} g` : "340 g"}</p>
        </div>
        <div className="space-y-2">
          <span className="font-manrope text-[10px] tracking-[0.2em] uppercase font-bold text-accent">Dimensions</span>
          <p className="font-manrope text-[13px] text-accent/80 font-regular">
            {product.length && product.width && product.height
              ? `${product.length}L x ${product.width}W x ${product.height}H`
              : "Reg. Fit / True to Size"}
          </p>
        </div>
        <div className="space-y-2">
          <span className="font-manrope text-[10px] tracking-[0.2em] uppercase font-bold text-accent ">Origin</span>
          <p className="font-manrope text-[13px] text-accent/80 font-regular">{product.origin_country ? product.origin_country : "Designed in Dubai"}</p>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="py-2 space-y-8">
      <div className="flex items-start gap-x-6">
        <div className="pt-1"><FastDelivery /></div>
        <div className="space-y-1">
          <span className="font-manrope text-[11px] tracking-widest uppercase font-semibold text-accent/80  leading-none">Global Logistics</span>
          <p className="font-manrope text-[13px] leading-relaxed text-accent/60 max-w-sm">
            Complimentary shipping on all Experience orders. GCC delivery: 3-5 business days. Worldwide delivery: 5-7 business days.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-x-6">
        <div className="pt-1"><Refresh /></div>
        <div className="space-y-1">
          <span className="font-manrope text-[11px] tracking-widest uppercase font-semibold text-accent/80  leading-none">No Refunds & Exchanges</span>
          <p className="font-manrope text-[13px] leading-relaxed text-accent/60 max-w-sm">
            To maintain the exclusivity and pristine condition of our pieces, we do not offer refunds or exchanges. All sales are final.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductTabs
