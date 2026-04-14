"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Package from "@modules/common/icons/package"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { Bolt, Ruler } from "lucide-react"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const isTshirt = product.categories?.some(
    (c) => 
      c.handle?.toLowerCase().includes("t-shirt") || 
      c.name?.toLowerCase().includes("t-shirt") ||
      c.handle?.toLowerCase() === "tshirts"
  )

  const isJacket = product.categories?.some(
    (c) => 
      c.handle?.toLowerCase().includes("jacket") || 
      c.name?.toLowerCase().includes("jacket")
  )

  const isHoodie = product.categories?.some(
    (c) => 
      c.handle?.toLowerCase().includes("hoodie") || 
      c.name?.toLowerCase().includes("hoodie")
  )

  const isPants = product.categories?.some(
    (c) => 
      c.handle?.toLowerCase().includes("pants") || 
      c.name?.toLowerCase().includes("pants") ||
      c.handle?.toLowerCase().includes("trouser") ||
      c.name?.toLowerCase().includes("trouser")
  )

  const tabs = [
    {
      label: "Specifications",
      component: <ProductInfoTab product={product} />,
      icon: <Package size={16} />,
    },
    {
      label: "The Experience",
      component: <EthosTab />,
      icon: <Bolt size={16} />,
    },
    ...(isTshirt || isJacket || isHoodie || isPants ? [{
      label: "Size Guide",
      component: <SizeGuideTab type={isPants ? "pants" : (isHoodie ? "hoodie" : (isJacket ? "jacket" : "tshirt"))} />,
      icon: <Ruler size={16} />,
    }] : []),
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

const SizeGuideTab = ({ type = "tshirt" }: { type?: "tshirt" | "jacket" | "hoodie" | "pants" }) => {
  const tshirtData = [
    { s: "S", v1: "21", v2: "24.5", v3: "17.5", v4: "9" },
    { s: "M", v1: "22", v2: "25.5", v3: "18.5", v4: "9.5" },
    { s: "L", v1: "23", v2: "26.5", v3: "19.5", v4: "10" },
    { s: "XL", v1: "24", v2: "27.5", v3: "20.5", v4: "10.5" },
  ]

  const jacketData = [
    { s: "S", v1: "21", v2: "26", v3: "17", v4: "24.5" },
    { s: "M", v1: "22", v2: "27", v3: "18", v4: "25" },
    { s: "L", v1: "23", v2: "28", v3: "19", v4: "25.5" },
    { s: "XL", v1: "24", v2: "29", v3: "20", v4: "26" },
  ]

  const hoodieData = [
    { s: "XS", v1: "20", v2: "24", v3: "16", v4: "24" },
    { s: "S", v1: "21", v2: "25", v3: "17", v4: "24.5" },
    { s: "M", v1: "22", v2: "26", v3: "18", v4: "25" },
    { s: "L", v1: "23", v2: "27", v3: "19", v4: "25.5" },
    { s: "XL", v1: "24", v2: "28", v3: "20", v4: "26" },
    { s: "2XL", v1: "25", v2: "29", v3: "21", v4: "26.5" },
  ]

  const pantsData = [
    { s: "XS", v1: "36.5", v2: "21", v3: "38", v4: "23" },
    { s: "S", v1: "37.5", v2: "23", v3: "40", v4: "24" },
    { s: "M", v1: "38.5", v2: "25", v3: "42", v4: "25" },
    { s: "L", v1: "39.5", v2: "27", v3: "44", v4: "26" },
    { s: "XL", v1: "40.5", v2: "29", v3: "46", v4: "27" },
    { s: "2XL", v1: "41.5", v2: "31", v3: "48", v4: "28" },
  ]

  const headers = type === "pants" 
    ? { h1: "Length", h2: "Waist", h3: "Hip", h4: "Thigh" }
    : { h1: "Chest", h2: "Length", h3: "Shoulder", h4: "Sleeve" }

  const data = type === "pants" ? pantsData : (type === "hoodie" ? hoodieData : (type === "jacket" ? jacketData : tshirtData))

  return (
    <div className="py-2 space-y-6">
      <div className="space-y-4">
        <h4 className="font-manrope text-[10px] tracking-[0.2em] uppercase font-semibold text-accent space-x-2">
          <span>{type === "hoodie" ? "Hoodie" : (type === "jacket" ? "Jacket" : (type === "pants" ? "Pants" : "T-Shirt"))}</span>
          <span>Measurements (Inches)</span>
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[400px]">
            <thead>
              <tr className="border-b border-accent/5">
                <th className="py-3 font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold">Size</th>
                <th className="py-3 font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold text-center">{headers.h1}</th>
                <th className="py-3 font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold text-center">{headers.h2}</th>
                <th className="py-3 font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold text-center">{headers.h3}</th>
                <th className="py-3 font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold text-center">{headers.h4}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/5">
              {data.map((row) => (
                <tr key={row.s} className="group hover:bg-black/[0.02] transition-colors font-manrope">
                  <td className="py-4 font-manrope text-xs font-bold text-accent">{row.s}</td>
                  <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v1}</td>
                  <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v2}</td>
                  <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v3}</td>
                  <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="font-manrope text-[11px] leading-relaxed text-accent/40 italic">
        * Measurements are taken while laying flat. For the best fit, we recommend measuring a garment you already own.
      </p>
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
