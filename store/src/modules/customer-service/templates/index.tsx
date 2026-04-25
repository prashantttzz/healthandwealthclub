"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { 
  PackageIcon, 
  TruckDeliveryIcon, 
  MessageQuestionIcon, 
  CustomerServiceIcon,
  LicenseIcon,
  Shield01Icon
} from "@hugeicons/core-free-icons"
import { motion } from "framer-motion"
import Accordion from "@modules/products/components/product-tabs/accordion"
import { CONTACT_LINKS } from "@lib/constants"

const CustomerServiceTemplate = () => {
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
          <span className="text-[11px] uppercase font-bold tracking-[0.4em] text-accent/30">Support Center</span>
          <h1 className="font-newsreader italic text-6xl lg:text-8xl text-accent tracking-tighter leading-[0.9]">
            City Reach <br /> Concierge.
          </h1>
          <p className="text-[15px] text-accent/50 leading-relaxed mt-4 font-medium">
            The Hub for all Club inquiries. From bespoke shipping logistics to our foundational terms, everything you need to navigate the collective is here.
          </p>
        </motion.div>

        {/* Main Support Grid (Anchor Links) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="px-6 md:px-12 lg:px-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <SupportCard 
              icon={<HugeiconsIcon icon={TruckDeliveryIcon} size={24} />}
              title="Shipping"
              href="#shipping"
            />
            <SupportCard 
              icon={<HugeiconsIcon icon={PackageIcon} size={24} />}
              title="Returns"
              href="#returns"
            />
            <SupportCard 
              icon={<HugeiconsIcon icon={MessageQuestionIcon} size={24} />}
              title="FAQs"
              href="#faqs"
            />
            <SupportCard 
              icon={<HugeiconsIcon icon={LicenseIcon} size={24} />}
              title="Terms"
              href="#terms"
            />
            <SupportCard 
              icon={<HugeiconsIcon icon={Shield01Icon} size={24} />}
              title="Privacy"
              href="#privacy"
            />
            <SupportCard 
              icon={<HugeiconsIcon icon={CustomerServiceIcon} size={24} />}
              title="Contact"
              href="#contact"
            />
          </div>
        </motion.div>

        {/* Section: Direct Contact */}
        <motion.div 
          id="contact" 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="scroll-mt-32 px-6 md:px-12 lg:px-16"
        >
          <div className="bg-[#F2EDE5] border border-accent/5 p-12 lg:p-20 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col gap-6 max-w-xl text-left">
              <h2 className="font-newsreader italic text-4xl lg:text-5xl text-accent tracking-tighter">Need personalized assistance?</h2>
              <p className="text-[14px] text-accent/60 leading-relaxed font-medium">
                Our direct concierge team is available Monday through Friday. Whether by email or instant message, we prioritize your requests with the utmost attention.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <ContactButton label="Email Support" href={CONTACT_LINKS.email} />
                <ContactButton label="WhatsApp Concierge" href={CONTACT_LINKS.whatsapp} secondary />
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center p-8 bg-accent text-bg aspect-square w-40 h-40 rounded-full shadow-2xl animate-pulse">
               <HugeiconsIcon icon={CustomerServiceIcon} size={32} />
               <span className="text-[10px] uppercase font-bold tracking-widest mt-2">Live Now</span>
            </div>

            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          </div>
        </motion.div>

        {/* Section: FAQs */}
        <motion.div 
          id="faqs" 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="scroll-mt-32 px-6 md:px-12 lg:px-16"
        >
          <div className="max-w-4xl mx-auto w-full py-16">
            <div className="flex flex-col gap-8">
              <h3 className="font-newsreader italic text-4xl lg:text-5xl text-accent text-center mb-8 tracking-tighter">Concierge FAQ</h3>
              <Accordion type="single" collapsible>
                <Accordion.Item title="What are your shipping destinations?" value="shipping">
                  <p className="text-[14px] text-accent/60 leading-relaxed font-medium">
                    City Reach offers premium shipping with tailored logistics. UAE orders enjoy delivery within 1-2 business days, GCC countries within 3-5 business days, and worldwide orders typically arrive within 5-7 business days. Our logistics network is optimized for speed and safety, ensuring your items arrive in pristine condition.
                  </p>
                </Accordion.Item>
                <Accordion.Item title="How do I manage my membership?" value="membership">
                  <p className="text-[14px] text-accent/60 leading-relaxed font-medium">
                    Membership settings can be managed directly through your Account Dashboard. Here you can update your personal information, view your order history, and access exclusive member-only collection drops.
                  </p>
                </Accordion.Item>
                <Accordion.Item title="What is your return policy?" value="returns">
                  <p className="text-[14px] text-accent/60 leading-relaxed font-medium">
                    All sales at City Reach are final. We maintain a strict no-refund and no-exchange policy to ensure the exclusivity and pristine condition of our collections. Please ensure all details are correct before finalizing your order.
                  </p>
                </Accordion.Item>
                <Accordion.Item title="Can I change my order after it's placed?" value="orders">
                  <p className="text-[14px] text-accent/60 leading-relaxed font-medium">
                    Due to our expedited processing, we can only accommodate changes within 2 hours of order placement. Please contact our concierge team immediately via WhatsApp for urgent modifications.
                  </p>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </motion.div>

        {/* Section: Shipping & Returns */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 border-y border-accent/5 bg-secondary/10"
        >
           <div id="shipping" className="scroll-mt-32 p-12 lg:p-20 border-b lg:border-b-0 lg:border-r border-accent/5">
              <h3 className="font-newsreader italic text-4xl text-accent mb-8 tracking-tighter">Shipping & Delivery</h3>
              <div className="space-y-8 text-[14px] text-accent/60 leading-relaxed font-medium">
                 <div className="space-y-3 text-left">
                    <h4 className="text-accent font-bold uppercase tracking-widest text-[11px]">Bespoke Logistics</h4>
                    <p>Every Club order is handled with extreme care. We partner with DHL Express and FedEx Priority to ensure that your curated pieces are delivered with the speed and security they deserve. UAE delivery: 1-2 days. GCC delivery: 3-5 days. Worldwide delivery: 5-7 days.</p>
                 </div>
                 <div className="space-y-3 text-left">
                    <h4 className="text-accent font-bold uppercase tracking-widest text-[11px]">Tracking Your Order</h4>
                    <p>Once your order is processed (typically within 24-48 hours), you will receive a digital tracking dossier via email. You can also monitor real-time updates through your Member Dashboard.</p>
                 </div>
                 <div className="space-y-3 text-left">
                    <h4 className="text-accent font-bold uppercase tracking-widest text-[11px]">Duties & Taxes</h4>
                    <p>For international deliveries, duties and taxes are calculated at checkout to ensure a DDP (Delivered Duty Paid) experience, meaning no unexpected fees upon arrival.</p>
                 </div>
              </div>
           </div>
           <div id="returns" className="scroll-mt-32 p-12 lg:p-20">
              <h3 className="font-newsreader italic text-4xl text-accent mb-8 tracking-tighter">Returns & Exchanges</h3>
              <div className="space-y-8 text-[14px] text-accent/60 leading-relaxed font-medium">
                 <div className="space-y-3 text-left">
                    <h4 className="text-accent font-bold uppercase tracking-widest text-[11px]">Final Sale Policy</h4>
                    <p>We believe in the exceptional quality of our collection. To maintain our artisanal standards, all purchases are considered final. We do not offer refunds or exchanges.</p>
                 </div>
                 <div className="space-y-3 text-left">
                    <h4 className="text-accent font-bold uppercase tracking-widest text-[11px]">Support Inquiry</h4>
                    <p>If you believe there is a manufacturing defect with your piece, please contact our concierge team within 24 hours of delivery with photographic evidence for review.</p>
                 </div>
                 <div className="space-y-3 text-left">
                    <h4 className="text-accent font-bold uppercase tracking-widest text-[11px]">Exclusions</h4>
                    <p>Items purchased during special collection drops or personalized pieces are strictly final sale and cannot be reviewed for return under any circumstances.</p>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Section: Legal (Terms & Privacy) */}
        <div className="px-6 md:px-12 lg:px-16 flex flex-col gap-24 py-16">
           {/* Terms */}
           <motion.div 
            id="terms" 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="scroll-mt-32 flex flex-col lg:flex-row gap-12 lg:gap-24"
           >
              <div className="lg:w-1/3 text-left">
                 <h3 className="font-newsreader italic text-4xl text-accent sticky top-32 tracking-tighter">Terms of Service</h3>
                 <p className="text-[12px] text-accent/40 mt-4 uppercase tracking-widest font-bold">Last Updated: April 2026</p>
              </div>
              <div className="lg:w-2/3 space-y-12 text-left">
                 <div className="space-y-4">
                    <h4 className="font-bold text-accent uppercase tracking-widest text-[13px]">1. The Membership Agreement</h4>
                    <p className="text-[15px] text-accent/60 leading-relaxed font-medium">By accessing City Reach, you agree to be bound by these terms. Our collective is a curated experience designed for intentional living. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your membership.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-bold text-accent uppercase tracking-widest text-[13px]">2. Product Availability & Bespoke Orders</h4>
                    <p className="text-[15px] text-accent/60 leading-relaxed font-medium">Many of our pieces are produced in limited quantities or made-to-order. We reserve the right to limit quantities or cancel orders if artisanal materials become unavailable. Pricing is subject to change based on market fluctuations in luxury raw materials.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-bold text-accent uppercase tracking-widest text-[13px]">3. Intellectual Property</h4>
                    <p className="text-[15px] text-accent/60 leading-relaxed font-medium">All designs, imagery, and text on this platform are the property of City Reach legacy. Unauthorized reproduction or distribution of our aesthetic assets is strictly prohibited.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-bold text-accent uppercase tracking-widest text-[13px]">4. Governing Law</h4>
                    <p className="text-[15px] text-accent/60 leading-relaxed font-medium">These terms are governed by the laws of the jurisdiction in which City Reach is headquartered, without regard to conflict of law principles.</p>
                 </div>
              </div>
           </motion.div>

           {/* Privacy */}
           <motion.div 
            id="privacy" 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="scroll-mt-32 flex flex-col lg:flex-row gap-12 lg:gap-24 border-t border-accent/5 pt-24"
           >
              <div className="lg:w-1/3 text-left">
                 <h3 className="font-newsreader italic text-4xl text-accent sticky top-32 tracking-tighter">Privacy Policy</h3>
                 <p className="text-[12px] text-accent/40 mt-4 uppercase tracking-widest font-bold">Your Security is Paramount</p>
              </div>
              <div className="lg:w-2/3 space-y-12 text-left">
                 <div className="space-y-4">
                    <h4 className="font-bold text-accent uppercase tracking-widest text-[13px]">Data Collection for Curated Service</h4>
                    <p className="text-[15px] text-accent/60 leading-relaxed font-medium">We collect personal information such as name, email, and shipping details solely to facilitate your experience. We also analyze browsing patterns to refine our curation and provide personalized collection recommendations.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-bold text-accent uppercase tracking-widest text-[13px]">Safe Guarding Your Assets</h4>
                    <p className="text-[15px] text-accent/60 leading-relaxed font-medium">Your data is encrypted using industry-standard protocols. We do not sell your personal information to third parties. We only share data with essential logistics partners required to fulfill your orders.</p>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-bold text-accent uppercase tracking-widest text-[13px]">Cookies & Digital Identity</h4>
                    <p className="text-[15px] text-accent/60 leading-relaxed font-medium">We use cookies to maintain your session and remember your preferences. You may manage your cookie settings through your browser, though some features of City Reach may be limited if cookies are disabled.</p>
                 </div>
              </div>
           </motion.div>
        </div>

        {/* Philosophy Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="px-6 md:px-12 lg:px-16 border-t border-accent/5 pt-16 flex flex-col md:flex-row justify-between gap-12 opacity-40 hover:opacity-100 transition-opacity duration-500"
        >
          <div className="flex flex-col gap-4 max-w-xs text-left">
            <h4 className="font-newsreader italic text-xl text-accent uppercase tracking-tight">Our Commitment</h4>
            <p className="text-[12px] leading-relaxed font-medium">We believe that service is an art form. Every detail of your journey with City Reach is curated for excellence.</p>
          </div>
          <div className="flex flex-col gap-4 max-w-xs text-left">
            <h4 className="font-newsreader italic text-xl text-accent uppercase tracking-tight">Global Presence</h4>
            <p className="text-[12px] leading-relaxed font-medium">Across multiple time zones, our support network ensures that you are never out of reach from a solution.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const SupportCard = ({ icon, title, href }: { icon: React.ReactNode, title: string, href: string }) => (
  <a href={href} className="group">
    <div className="flex flex-col items-center justify-center gap-4 p-8 bg-secondary/30 border border-accent/5 hover:bg-secondary hover:border-accent/20 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 text-center relative overflow-hidden">
      <div className="w-12 h-12 bg-accent text-bg flex items-center justify-center relative z-10 transition-transform group-hover:scale-110">
        <HugeiconsIcon icon={(icon as any).props.icon || icon} size={20} />
      </div>
      <h3 className="font-manrope text-[11px] font-bold uppercase tracking-[0.2em] text-accent transition-all group-hover:tracking-[0.3em] relative z-10">
        {title}
      </h3>
      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  </a>
)

const ContactButton = ({ label, href, secondary = false }: { label: string, href: string, secondary?: boolean }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noreferrer"
    className={`px-8 py-4 text-[12px] font-bold uppercase tracking-widest transition-all ${
      secondary 
        ? "bg-transparent border border-accent text-accent hover:bg-accent hover:text-bg" 
        : "bg-accent text-bg hover:opacity-90 shadow-lg"
    }`}
  >
    {label}
  </a>
)

export default CustomerServiceTemplate
