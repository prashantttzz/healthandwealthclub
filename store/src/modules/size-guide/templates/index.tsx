"use client"

import { motion } from "framer-motion"
import { Ruler } from "lucide-react"

const SizeGuideTemplate = () => {
  return (
    <div className="bg-bg min-h-screen font-manrope">
      <div className="flex flex-col gap-16 py-12 lg:py-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Editorial Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 max-w-2xl px-6 md:px-12 lg:px-16"
        >
          <span className="text-[11px] uppercase font-bold tracking-[0.4em] text-accent/30">Measurement Guide</span>
          <h1 className="font-newsreader italic text-6xl lg:text-8xl text-accent tracking-tighter leading-[0.9]">
            The Perfect <br /> Fit.
          </h1>
          <p className="text-[15px] text-accent/50 leading-relaxed mt-4 font-medium">
            Precision in every stitch. Use our comprehensive guide to ensure your selected pieces reflect your exacting standards. All measurements are provided in inches.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="px-6 md:px-12 lg:px-16 grid grid-cols-1 gap-24">
          
          {/* T-Shirts */}
          <Section 
            title="T-Shirts" 
            subtitle="The Essential Foundation" 
            type="tshirt"
          />

          {/* Hoodies */}
          <Section 
            title="Hoodies" 
            subtitle="Premium Comfort" 
            type="hoodie"
          />

          {/* Jackets */}
          <Section 
            title="Jackets" 
            subtitle="Layered Excellence" 
            type="jacket"
          />

          {/* Pants & Trousers */}
          <Section 
            title="Pants & Trousers" 
            subtitle="Tailored Movement" 
            type="pants"
          />

        </div>

        {/* Measurement Tips */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-6 md:px-12 lg:px-16 border-t border-accent/5 pt-16 flex flex-col md:flex-row justify-between gap-12 opacity-60"
        >
          <div className="flex flex-col gap-4 max-w-xs text-left">
            <h4 className="font-newsreader italic text-xl text-accent uppercase tracking-tight">How to Measure</h4>
            <p className="text-[12px] leading-relaxed font-medium">For the most accurate results, measure a garment you already own while it is laying flat on a level surface.</p>
          </div>
          <div className="flex flex-col gap-4 max-w-xs text-left">
            <h4 className="font-newsreader italic text-xl text-accent uppercase tracking-tight">Artisanal Variations</h4>
            <p className="text-[12px] leading-relaxed font-medium">Due to the hand-finished nature of our collections, a tolerance of +/- 0.5 inches is considered standard.</p>
          </div>
          <div className="flex flex-col gap-4 max-w-xs text-left">
            <h4 className="font-newsreader italic text-xl text-accent uppercase tracking-tight">Concierge Advice</h4>
            <p className="text-[12px] leading-relaxed font-medium">Unsure of your selection? Our concierge is available via WhatsApp for personalized sizing consultations.</p>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

const Section = ({ title, subtitle, type }: { title: string, subtitle: string, type: "tshirt" | "hoodie" | "pants" | "jacket" }) => {
  const tshirtData = [
    { s: "S", v1: "21", v2: "24.5", v3: "17.5", v4: "9" },
    { s: "M", v1: "22", v2: "25.5", v3: "18.5", v4: "9.5" },
    { s: "L", v1: "23", v2: "26.5", v3: "19.5", v4: "10" },
    { s: "XL", v1: "24", v2: "27.5", v3: "20.5", v4: "10.5" },
  ]

  const jacketData = [
    { s: "XS", v1: "20", v2: "24", v3: "16", v4: "24", v5: "10", v6: "4", v7: "17" },
    { s: "S", v1: "21", v2: "25", v3: "17", v4: "24.5", v5: "10.5", v6: "4", v7: "18" },
    { s: "M", v1: "22", v2: "26", v3: "18", v4: "25", v5: "11", v6: "4.25", v7: "19" },
    { s: "L", v1: "23", v2: "27", v3: "19", v4: "25.5", v5: "11.5", v6: "4.25", v7: "20" },
    { s: "XL", v1: "24", v2: "28", v3: "20", v4: "26", v5: "12", v6: "4.5", v7: "21" },
  ]

  const hoodieData = [
    { s: "XS", v1: "20", v2: "24", v3: "16", v4: "24", v5: "10", v6: "4", v7: "17" },
    { s: "S", v1: "21", v2: "25", v3: "17", v4: "24.5", v5: "10.5", v6: "4", v7: "18" },
    { s: "M", v1: "22", v2: "26", v3: "18", v4: "25", v5: "11", v6: "4.25", v7: "19" },
    { s: "L", v1: "23", v2: "27", v3: "19", v4: "25.5", v5: "11.5", v6: "4.25", v7: "20" },
    { s: "XL", v1: "24", v2: "28", v3: "20", v4: "26", v5: "12", v6: "4.5", v7: "21" },
    { s: "2XL", v1: "25", v2: "29", v3: "21", v4: "26.5", v5: "12.5", v6: "4.5", v7: "22" },
  ]

  const pantsData = [
    { s: "XS", v1: "36.5", v2: "21", v3: "38", v4: "23", v5: "11", v6: "14.5", v7: "14.5" },
    { s: "S", v1: "37.5", v2: "23", v3: "40", v4: "24", v5: "11.5", v6: "15", v7: "15" },
    { s: "M", v1: "38.5", v2: "25", v3: "42", v4: "25", v5: "12", v6: "15.5", v7: "15.5" },
    { s: "L", v1: "39.5", v2: "27", v3: "44", v4: "26", v5: "12.5", v6: "16", v7: "16" },
    { s: "XL", v1: "40.5", v2: "29", v3: "46", v4: "27", v5: "13", v6: "16.5", v7: "16.5" },
    { s: "2XL", v1: "41.5", v2: "31", v3: "48", v4: "28", v5: "13.5", v6: "17", v7: "17" },
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
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-newsreader italic text-3xl lg:text-5xl text-accent tracking-tighter">{title}</h3>
        <p className="text-[12px] uppercase font-bold tracking-[0.3em] text-accent/30">{subtitle}</p>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-accent/10">
              {headers.map((h, i) => (
                <th key={h} className={`py-6 font-manrope text-[10px] uppercase tracking-widest text-accent/40 font-bold ${i === 0 ? "text-left" : "text-center px-4"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-accent/5">
            {data.map((row: any) => (
              <tr key={row.s} className="group hover:bg-accent/[0.02] transition-colors font-manrope">
                <td className="py-6 font-manrope text-xs font-bold text-accent">{row.s}</td>
                <td className="py-6 font-manrope text-xs text-accent/70 text-center">{row.v1}</td>
                <td className="py-6 font-manrope text-xs text-accent/70 text-center">{row.v2}</td>
                <td className="py-6 font-manrope text-xs text-accent/70 text-center">{row.v3}</td>
                <td className="py-6 font-manrope text-xs text-accent/70 text-center">{row.v4}</td>
                {row.v5 && <td className="py-6 font-manrope text-xs text-accent/70 text-center">{row.v5}</td>}
                {row.v6 && <td className="py-6 font-manrope text-xs text-accent/70 text-center">{row.v6}</td>}
                {row.v7 && <td className="py-6 font-manrope text-xs text-accent/70 text-center">{row.v7}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default SizeGuideTemplate
