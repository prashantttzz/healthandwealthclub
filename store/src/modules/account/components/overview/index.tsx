import { Container } from "@medusajs/ui"
import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { HugeiconsIcon } from "@hugeicons/react"
import { 
  PackageIcon, 
  Location01Icon, 
UserIcon, 
  ArrowRight01Icon,
  CreditCardIcon
} from "@hugeicons/core-free-icons"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const completion = getProfileCompletion(customer)
  const firstName = customer?.first_name || "there"

  return (
    <div data-testid="overview-page-wrapper" className="flex flex-col gap-12 pt-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-3">
        <h1 className="font-newsreader italic text-5xl lg:text-6xl text-accent tracking-tight leading-tight">
          Welcome home, <br className="md:hidden" /> {firstName}.
        </h1>
        <p className="font-manrope text-[14px] text-accent/50 max-w-lg leading-relaxed">
          From your personal dashboard, you can track your recent orders, manage shipping addresses, and edit your profile details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Completion Card */}
        <div className="lg:col-span-2 flex flex-col justify-between p-10 bg-[#F2EDE5] border border-accent/5 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="font-manrope text-[11px] uppercase font-bold tracking-[0.3em] text-accent/30">Your Membership</span>
              <h3 className="font-newsreader italic text-3xl text-accent">Complete your profile</h3>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <span className="font-manrope text-[11px] font-bold text-accent">{completion}% complete</span>
                {completion < 100 && (
                  <LocalizedClientLink href="/account/profile" className="font-manrope text-[11px] font-bold text-accent underline underline-offset-4 decoration-accent/20 hover:decoration-accent transition-all">
                    Finish now
                  </LocalizedClientLink>
                )}
              </div>
              <div className="w-full h-1.5 bg-accent/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-1000 ease-out" 
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Abstract background element */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-accent/[0.03] rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Info Stat */}
        <div className="flex flex-col justify-center items-center p-10 bg-accent text-bg border border-accent/5 shadow-xl text-center gap-4">
          <div className="w-12 h-12 rounded-full border border-bg/10 flex items-center justify-center mb-2">
            <HugeiconsIcon icon={PackageIcon} size={20} className="text-bg/60" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-newsreader italic text-4xl leading-none">{orders?.length || 0}</span>
            <span className="font-manrope text-[10px] uppercase font-bold tracking-[0.3em] text-bg/40">Total Orders</span>
          </div>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashTile 
          href="/account/orders" 
          icon={<HugeiconsIcon icon={PackageIcon} size={20} />} 
          label="Track Orders" 
        />
        <DashTile 
          href="/account/addresses" 
          icon={<HugeiconsIcon icon={Location01Icon} size={20} />} 
          label="Shipping Details" 
        />
        <DashTile 
          href="/account/profile" 
          icon={<HugeiconsIcon icon={UserIcon} size={20} />} 
          label="Account Settings" 
        />
      </div>

      {/* Recent Activity */}
      <div className="flex flex-col gap-8 mt-4">
        <div className="flex items-center justify-between border-b border-accent/5 pb-4">
          <h3 className="font-manrope text-[11px] uppercase font-bold tracking-[0.3em] text-accent/30">Recent Activity</h3>
          <LocalizedClientLink href="/account/orders" className="font-manrope text-[11px] font-bold text-accent underline underline-offset-4">
            View All
          </LocalizedClientLink>
        </div>

        <ul className="flex flex-col gap-4">
          {orders && orders.length > 0 ? (
            orders.slice(0, 3).map((order) => (
              <li key={order.id}>
                <LocalizedClientLink href={`/account/orders/details/${order.id}`}>
                  <div className="group flex items-center justify-between p-6 bg-secondary border border-accent/5 hover:border-accent/20 transition-all duration-300">
                    <div className="flex items-center gap-6">
                      <div className="w-10 h-10 bg-accent/5 flex items-center justify-center">
                        <span className="font-manrope text-[10px] font-bold text-accent/40">#{order.display_id}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-manrope text-[13px] font-bold text-accent">Order Placed</span>
                        <span className="font-manrope text-[11px] text-accent/40 lowercase">
                          {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-newsreader italic text-xl text-accent">
                        {convertToLocale({
                          amount: order.total,
                          currency_code: order.currency_code,
                        })}
                      </span>
                      <HugeiconsIcon icon={ArrowRight01Icon} size={18} className="text-accent/20 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-accent/5 text-center">
              <HugeiconsIcon icon={PackageIcon} size={32} className="text-accent/10 mb-4" />
              <p className="font-manrope text-[13px] text-accent/40">No recent orders found.</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

const DashTile = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <LocalizedClientLink href={href} className="group">
    <div className="flex items-center gap-5 p-6 bg-white border border-accent/5 group-hover:border-accent/30 transition-all duration-300">
      <div className="w-10 h-10 flex items-center justify-center text-accent/40 group-hover:text-accent transition-colors">
        {icon}
      </div>
      <span className="font-manrope text-[12px] font-bold text-accent uppercase tracking-widest">{label}</span>
    </div>
  </LocalizedClientLink>
)

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0
  if (!customer) return 0
  if (customer.email) count++
  if (customer.first_name && customer.last_name) count++
  if (customer.phone) count++
  const billingAddress = customer.addresses?.find((addr) => addr.is_default_billing)
  if (billingAddress) count++
  return (count / 4) * 100
}

export default Overview
