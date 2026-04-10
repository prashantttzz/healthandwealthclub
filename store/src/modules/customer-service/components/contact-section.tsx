"use client"

import { Mail, Phone, Clock } from "lucide-react"

export default function ContactSection() {
  return (
    <div className="w-full flex flex-col gap-10 text-accent font-manrope">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-newsreader italic tracking-tight">Contact Us</h2>
        <p className="text-[13px] text-accent/60">We’re here to help. Reach out to our dedicated support team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-4 p-8 bg-transparent border border-accent/10 rounded-2xl">
          <Mail className="text-accent/40" size={24} />
          <div>
            <h3 className="font-bold text-[14px]">Email</h3>
            <p className="text-[12px] text-accent/60 mt-1">support@healthandwealth.club</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 p-8 bg-transparent border border-accent/10 rounded-2xl">
          <Phone className="text-accent/40" size={24} />
          <div>
            <h3 className="font-bold text-[14px]">Phone</h3>
            <p className="text-[12px] text-accent/60 mt-1">+1 (800) 123-4567</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4 p-8 bg-transparent border border-accent/10 rounded-2xl">
          <Clock className="text-accent/40" size={24} />
          <div>
            <h3 className="font-bold text-[14px]">Business Hours</h3>
            <p className="text-[12px] text-accent/60 mt-1">Mon - Fri, 9am - 6pm EST</p>
          </div>
        </div>
      </div>

      {/* Mock Contact Form */}
      <div className="w-full bg-accent/5 rounded-2xl p-8 lg:p-10 border border-accent/10 mt-4">
        <h3 className="font-bold text-[18px] mb-8">Send us a message</h3>
        <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="flex flex-col gap-2">
               <label className="text-[12px] font-bold tracking-wide">Name</label>
               <input type="text" className="w-full h-14 px-4 bg-transparent border border-accent/20 outline-none focus:border-accent/60 text-[14px]" placeholder="Jane Doe" required />
             </div>
             <div className="flex flex-col gap-2">
               <label className="text-[12px] font-bold tracking-wide">Email</label>
               <input type="email" className="w-full h-14 px-4 bg-transparent border border-accent/20 outline-none focus:border-accent/60 text-[14px]" placeholder="jane@example.com" required />
             </div>
          </div>
          
          <div className="flex flex-col gap-2">
               <label className="text-[12px] font-bold tracking-wide">Order Number (Optional)</label>
               <input type="text" className="w-full h-14 px-4 bg-transparent border border-accent/20 outline-none focus:border-accent/60 text-[14px]" placeholder="#102934" />
          </div>

          <div className="flex flex-col gap-2">
               <label className="text-[12px] font-bold tracking-wide">Message</label>
               <textarea className="w-full p-4 bg-transparent border border-accent/20 outline-none focus:border-accent/60 text-[14px] min-h-[150px] resize-y" placeholder="How can we help you today?" required></textarea>
          </div>
          
          <button className="px-10 py-4 bg-accent text-bg font-bold text-[14px] transition-all hover:opacity-90 mt-2 self-start">
            Submit Request
          </button>
        </form>
      </div>

    </div>
  )
}
