"use client"

import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"
import Package from "@modules/common/icons/package"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"
import { Bolt, Ruler } from "lucide-react"
import clsx from "clsx"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const isTshirt = product.categories?.some(
    (c) => 
      c.handle?.toLowerCase().includes("t-shirt") || 
      c.name?.toLowerCase().includes("t-shirt") ||
      c.handle?.toLowerCase() === "tshirts"
  ) || 
  product.collection?.handle?.toLowerCase().includes("t-shirt") ||
  product.title?.toLowerCase().includes("t-shirt") ||
  product.title?.toLowerCase().includes("tee")

  const isJacket = product.categories?.some(
    (c) => 
      c.handle?.toLowerCase().includes("jacket") || 
      c.name?.toLowerCase().includes("jacket")
  ) ||
  product.collection?.handle?.toLowerCase().includes("jacket") ||
  product.title?.toLowerCase().includes("jacket")

  const isHoodie = product.categories?.some(
    (c) => 
      c.handle?.toLowerCase().includes("hoodie") || 
      c.name?.toLowerCase().includes("hoodie")
  ) ||
  product.collection?.handle?.toLowerCase().includes("hoodie") ||
  product.title?.toLowerCase().includes("hoodie")

  const isPants = product.categories?.some(
    (c) => 
      c.handle?.toLowerCase().includes("pants") || 
      c.name?.toLowerCase().includes("pants") ||
      c.handle?.toLowerCase().includes("trouser") ||
      c.name?.toLowerCase().includes("trouser")
  ) ||
  product.collection?.handle?.toLowerCase().includes("pants") ||
  product.collection?.handle?.toLowerCase().includes("trouser") ||
  product.title?.toLowerCase().includes("pants") ||
  product.title?.toLowerCase().includes("trouser") ||
  product.title?.toLowerCase().includes("short")
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
    },{
      label: "Size Guide",
      component: <SizeGuideTab type={isPants ? "pants" : (isHoodie ? "hoodie" : (isJacket ? "jacket" : "tshirt"))} />,
      icon: <Ruler size={16} />,
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
            id={tab.label.toLowerCase().replace(/\s+/g, "-")}
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
    // Removed 2XL/XXL for T-shirt as requested
  ]

  const jacketData = [
    { s: "XS", v1: "20", v2: "24", v3: "16", v4: "24", v5: "10", v6: "4", v7: "17" },
    { s: "S", v1: "21", v2: "25", v3: "17", v4: "24.5", v5: "10.5", v6: "4", v7: "18" },
    { s: "M", v1: "22", v2: "26", v3: "18", v4: "25", v5: "11", v6: "4.25", v7: "19" },
    { s: "L", v1: "23", v2: "27", v3: "19", v4: "25.5", v5: "11.5", v6: "4.25", v7: "20" },
    { s: "XL", v1: "24", v2: "28", v3: "20", v4: "26", v5: "12", v6: "4.5", v7: "21" },
    // Removed 2XL and above for Jacket as requested ("remove 2xl")
  ]

  const hoodieData = [
    { s: "XS", v1: "20", v2: "24", v3: "16", v4: "24", v5: "10", v6: "4", v7: "17" },
    { s: "S", v1: "21", v2: "25", v3: "17", v4: "24.5", v5: "10.5", v6: "4", v7: "18" },
    { s: "M", v1: "22", v2: "26", v3: "18", v4: "25", v5: "11", v6: "4.25", v7: "19" },
    { s: "L", v1: "23", v2: "27", v3: "19", v4: "25.5", v5: "11.5", v6: "4.25", v7: "20" },
    { s: "XL", v1: "24", v2: "28", v3: "20", v4: "26", v5: "12", v6: "4.5", v7: "21" },
    { s: "2XL", v1: "25", v2: "29", v3: "21", v4: "26.5", v5: "12.5", v6: "4.5", v7: "22" },
    // Removed 3XL for Hoodie as requested
  ]

  const pantsData = [
    { s: "XS", v1: "36.5", v2: "21", v3: "38", v4: "23", v5: "11", v6: "14.5", v7: "14.5" },
    { s: "S", v1: "37.5", v2: "23", v3: "40", v4: "24", v5: "11.5", v6: "15", v7: "15" },
    { s: "M", v1: "38.5", v2: "25", v3: "42", v4: "25", v5: "12", v6: "15.5", v7: "15.5" },
    { s: "L", v1: "39.5", v2: "27", v3: "44", v4: "26", v5: "12.5", v6: "16", v7: "16" },
    { s: "XL", v1: "40.5", v2: "29", v3: "46", v4: "27", v5: "13", v6: "16.5", v7: "16.5" },
    { s: "2XL", v1: "41.5", v2: "31", v3: "48", v4: "28", v5: "13.5", v6: "17", v7: "17" },
    // Removed 3XL for Pant as requested
  ]

  const getHeaders = () => {
    if (type === "pants") {
      return ["Size", "Length", "Waist", "Hip", "Thigh", "F. Rise", "B. Rise", "Bottom"]
    }
    if (type === "hoodie" || type === "jacket") {
      return ["Size", "Chest", "Length", "Shoulder", "Sleeve", "Arm", "Cuff", "Rib"]
    }
    return ["Size", "Chest", "Length", "Shoulder", "Sleeve"]
  }

  const data = type === "pants" ? pantsData : (type === "hoodie" ? hoodieData : (type === "jacket" ? jacketData : tshirtData))
  const headers = getHeaders()

  return (
    <div className="py-2 space-y-6" id="size-guide-content">
      <div className="space-y-4">
        <h4 className="font-manrope text-[10px] tracking-[0.2em] uppercase font-semibold text-accent space-x-2">
          <span>{type === "hoodie" ? "Hoodie" : (type === "jacket" ? "Jacket" : (type === "pants" ? "Pants" : "T Shirt"))}</span>
          <span>Measurements (Inches)</span>
        </h4>
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-accent/5">
                {headers.map((h, i) => (
                  <th key={h} className={clsx(
                    "py-3 font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold",
                    i === 0 ? "text-left" : "text-center px-2"
                  )}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/5">
              {data.map((row: any) => (
                <tr key={row.s} className="group hover:bg-black/[0.02] transition-colors font-manrope">
                  <td className="py-4 font-manrope text-xs font-bold text-accent">{row.s}</td>
                  <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v1}</td>
                  <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v2}</td>
                  <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v3}</td>
                  <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v4}</td>
                  {row.v5 && <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v5}</td>}
                  {row.v6 && <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v6}</td>}
                  {row.v7 && <td className="py-4 font-manrope text-xs text-accent/70 text-center">{row.v7}</td>}
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
            UAE delivery: 1-2 business days. Other GCC countries: 5-7 business days. International delivery: 7-10 business days.
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
