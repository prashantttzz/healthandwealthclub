import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { 
  ChartBar, 
  CurrencyDollar, 
  ShoppingBag, 
  Clock, 
  CreditCard, 
  ArrowPath
} from "@medusajs/icons"
import { 
  Container, 
  Heading, 
  Text, 
  Table, 
  Badge, 
  Button 
} from "@medusajs/ui"
import { sdk } from "../../lib/sdk"
import { defineRouteConfig } from "@medusajs/admin-sdk"

// --- Safe Currency Formatter (Forced AED) ---
const formatCurrency = (amount: number, currencyCode: string = "AED") => {
  try {
    const code = "AED"
    const decimals = 2
    
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount)
  } catch (e) {
    return `AED ${(amount || 0).toFixed(2)}`
  }
}

// --- Customer Name Helper ---
const getCustomerIdentity = (order: any) => {
  const firstName = order.customer?.first_name || order.shipping_address?.first_name || ""
  const lastName = order.customer?.last_name || order.shipping_address?.last_name || ""
  const fullName = `${firstName} ${lastName}`.trim()
  
  if (fullName) return fullName
  if (order.email) return order.email
  if (order.customer?.email) return order.customer.email
  return "Guest Customer"
}

// --- SVG Chart Components ---
const AovChart = ({ data, currency }: { data: { label: string; value: number }[]; currency: string }) => {
  const totalSum = data.reduce((acc, d) => acc + d.value, 0)
  if (totalSum === 0) {
    return (
      <div className="flex h-[110px] items-center justify-center border border-dashed border-ui-border-base rounded-lg bg-ui-bg-subtle text-ui-fg-subtle text-xs font-normal">
        No orders recorded in the last 7 days
      </div>
    )
  }

  const width = 500
  const height = 110
  const paddingX = 25
  const paddingY = 15

  const maxVal = Math.max(...data.map(d => d.value), 1)
  
  const points = data.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (data.length - 1 || 1)
    const y = height - paddingY - (d.value / maxVal) * (height - 2 * paddingY)
    return { x, y, ...d }
  })

  const pathD = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  )

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : ""

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="h-[120px] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="aovGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(245, 158, 11)" stopOpacity="0.15"/>
              <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.0"/>
            </linearGradient>
          </defs>
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="currentColor" className="text-ui-border-base" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.25} />
          <line x1={paddingX} y1={(height) / 2} x2={width - paddingX} y2={(height) / 2} stroke="currentColor" className="text-ui-border-base" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.25} />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="currentColor" className="text-ui-border-base" strokeWidth={0.5} opacity={0.5} />

          <path d={areaD} fill="url(#aovGradient)" />
          <path d={pathD} fill="none" stroke="rgb(245, 158, 11)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle cx={p.x} cy={p.y} r={3} fill="rgb(245, 158, 11)" stroke="var(--bg-base)" strokeWidth={1.5} className="transition-all duration-200 group-hover:r-4" />
              <title>{`${p.label}: ${formatCurrency(p.value, currency)} AOV`}</title>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex justify-between px-6 text-xs text-ui-fg-subtle font-normal uppercase tracking-wider">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

const OrdersChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const totalSum = data.reduce((acc, d) => acc + d.value, 0)
  if (totalSum === 0) {
    return (
      <div className="flex h-[110px] items-center justify-center border border-dashed border-ui-border-base rounded-lg bg-ui-bg-subtle text-ui-fg-subtle text-xs font-normal">
        No orders placed in the last 7 days
      </div>
    )
  }

  const width = 500
  const height = 110
  const paddingX = 25
  const paddingY = 15

  const maxVal = Math.max(...data.map(d => d.value), 1)
  const barWidth = 14

  const bars = data.map((d, i) => {
    const x = paddingX + (i * (width - 2 * paddingX)) / (data.length - 1 || 1) - barWidth / 2
    const barHeight = (d.value / maxVal) * (height - 2 * paddingY)
    const y = height - paddingY - barHeight
    return { x, y, barHeight, ...d }
  })

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="h-[120px] w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="currentColor" className="text-ui-border-base" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.25} />
          <line x1={paddingX} y1={(height) / 2} x2={width - paddingX} y2={(height) / 2} stroke="currentColor" className="text-ui-border-base" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.25} />
          <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="currentColor" className="text-ui-border-base" strokeWidth={0.5} opacity={0.5} />

          {bars.map((b, i) => (
            <g key={i} className="group cursor-pointer">
              <rect 
                x={b.x} 
                y={b.y} 
                width={barWidth} 
                height={Math.max(b.barHeight, 1.5)} 
                rx={1.5}
                fill="rgb(99, 102, 241)" 
                className="transition-all duration-200 hover:fill-indigo-600 opacity-70 hover:opacity-100" 
              />
              <title>{`${b.label}: ${b.value} Orders`}</title>
            </g>
          ))}
        </svg>
      </div>
      <div className="flex justify-between px-6 text-xs text-ui-fg-subtle font-normal uppercase tracking-wider">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  )
}

// --- Main Page Component ---
const DashboardPage = () => {
  // Fetch actual orders with expanded fields to resolve missing customer data
  const { data: realData, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["admin_dashboard_orders"],
    queryFn: async () => {
      const response = await sdk.admin.order.list({ 
        limit: 100,
        fields: "*shipping_address,*customer,*items"
      })
      return response
    }
  })

  const realOrders = realData?.orders || []

  // Prepare latest orders explicit sort
  const latestOrders = useMemo(() => {
    return [...realOrders]
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
  }, [realOrders])

  // --- Process Live Data ---
  const metrics = useMemo(() => {
    let totalSales = 0
    let pendingCount = 0

    // Region metrics
    const regionsMap: { [key: string]: { count: number; sales: number } } = {}
    // Product metrics
    const productsMap: { [key: string]: { title: string; count: number; sales: number } } = {}

    realOrders.forEach((o: any) => {
      totalSales += Number(o.total || 0)
      
      if (o.status === "pending" || o.fulfillment_status === "pending" || o.fulfillment_status === "not_fulfilled") {
        pendingCount++
      }

      // Aggregate shipping regions
      const country = o.shipping_address?.country_code?.toUpperCase() || "Unknown"
      if (!regionsMap[country]) {
        regionsMap[country] = { count: 0, sales: 0 }
      }
      regionsMap[country].count++
      regionsMap[country].sales += Number(o.total || 0)

      // Aggregate products & quantities
      const items = o.items || []
      items.forEach((item: any) => {
        const qty = Number(item.quantity || 1)
        const productId = item.product_id || item.product_title || "Unknown Product"
        if (!productsMap[productId]) {
          productsMap[productId] = { title: item.product_title || "Item", count: 0, sales: 0 }
        }
        productsMap[productId].count += qty
        productsMap[productId].sales += Number(item.total || (item.unit_price * qty))
      })
    })

    const aov = realOrders.length > 0 ? totalSales / realOrders.length : 0

    const regionsList = Object.keys(regionsMap).map(country => ({
      country,
      count: regionsMap[country].count,
      sales: regionsMap[country].sales
    })).sort((a, b) => b.sales - a.sales)

    const productsList = Object.keys(productsMap).map(id => ({
      id,
      title: productsMap[id].title,
      count: productsMap[id].count,
      sales: productsMap[id].sales
    })).sort((a, b) => b.count - a.count).slice(0, 5)

    return {
      totalSales,
      totalOrders: realOrders.length,
      aov,
      pendingCount,
      regions: regionsList,
      products: productsList
    }
  }, [realOrders])

  const aovChartData = useMemo(() => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const dayData: { [key: string]: { sales: number; count: number } } = {}
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayName = weekdays[d.getDay()]
      dayData[dayName] = { sales: 0, count: 0 }
    }

    realOrders.forEach((o: any) => {
      const orderDate = new Date(o.created_at)
      const dayName = weekdays[orderDate.getDay()]
      if (dayData[dayName] !== undefined) {
        dayData[dayName].sales += Number(o.total || 0)
        dayData[dayName].count += 1
      }
    })

    return Object.keys(dayData).map(key => ({
      label: key,
      value: dayData[key].count > 0 ? dayData[key].sales / dayData[key].count : 0
    }))
  }, [realOrders])

  const ordersChartData = useMemo(() => {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const dayData: { [key: string]: number } = {}
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dayName = weekdays[d.getDay()]
      dayData[dayName] = 0
    }

    realOrders.forEach((o: any) => {
      const orderDate = new Date(o.created_at)
      const dayName = weekdays[orderDate.getDay()]
      if (dayData[dayName] !== undefined) {
        dayData[dayName] += 1
      }
    })

    return Object.keys(dayData).map(key => ({
      label: key,
      value: dayData[key]
    }))
  }, [realOrders])

  const displayCurrency = "AED"

  const maxSalesRegion = useMemo(() => {
    if (metrics.regions.length === 0) return 1
    return Math.max(...metrics.regions.map(r => r.sales), 1)
  }, [metrics.regions])

  const maxProductSales = useMemo(() => {
    if (metrics.products.length === 0) return 1
    return Math.max(...metrics.products.map(p => p.sales), 1)
  }, [metrics.products])

  return (
    <div className="flex flex-col gap-3 p-1">
      {/* Header Panel */}
      <Container className="p-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <Heading level="h2" className="text-ui-fg-base text-sm font-medium">
              Store Analytics
            </Heading>
            <Text className="text-ui-fg-subtle text-xs mt-0.5 font-normal">
              Live dashboard statistics tracking performance and sales data.
            </Text>
          </div>

          <div className="flex items-center gap-2 bg-ui-bg-subtle p-1.5 px-3 rounded-md border border-ui-border-base self-start sm:self-auto">
            <span className="text-xs font-normal text-ui-fg-subtle">
              Live DB Mode
            </span>
            <div className="h-3 w-px bg-ui-border-base mx-1" />
            <Button variant="secondary" size="small" className="h-5 w-5 p-0 bg-transparent border-none shadow-none text-ui-fg-subtle hover:text-ui-fg-base" onClick={() => refetch()} disabled={isLoading || isFetching}>
              <ArrowPath className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </Container>

      {/* Main Metrics Row (Bigger Cards) */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        {/* Revenue */}
        <Container className="flex-1 p-4 flex items-center gap-4 bg-ui-bg-base border border-ui-border-base rounded-lg shadow-sm">
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center rounded-lg border border-emerald-100 dark:border-emerald-900 flex-shrink-0">
            <CurrencyDollar className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 gap-1">
            <span className="text-xs text-ui-fg-subtle font-medium uppercase tracking-wider truncate">
              Revenue
            </span>
            <span className="text-xl font-semibold text-ui-fg-base truncate">
              {formatCurrency(metrics.totalSales, displayCurrency)}
            </span>
          </div>
        </Container>

        {/* Orders */}
        <Container className="flex-1 p-4 flex items-center gap-4 bg-ui-bg-base border border-ui-border-base rounded-lg shadow-sm">
          <div className="h-10 w-10 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center rounded-lg border border-indigo-100 dark:border-indigo-900 flex-shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 gap-1">
            <span className="text-xs text-ui-fg-subtle font-medium uppercase tracking-wider truncate">
              Orders
            </span>
            <span className="text-xl font-semibold text-ui-fg-base truncate">
              {metrics.totalOrders}
            </span>
          </div>
        </Container>

        {/* AOV */}
        <Container className="flex-1 p-4 flex items-center gap-4 bg-ui-bg-base border border-ui-border-base rounded-lg shadow-sm">
          <div className="h-10 w-10 bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center rounded-lg border border-amber-100 dark:border-amber-900 flex-shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 gap-1">
            <span className="text-xs text-ui-fg-subtle font-medium uppercase tracking-wider truncate">
              Avg. Order Value
            </span>
            <span className="text-xl font-semibold text-ui-fg-base truncate">
              {formatCurrency(metrics.aov, displayCurrency)}
            </span>
          </div>
        </Container>

        {/* Pending */}
        <Container className="flex-1 p-4 flex items-center gap-4 bg-ui-bg-base border border-ui-border-base rounded-lg shadow-sm">
          <div className="h-10 w-10 bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 flex items-center justify-center rounded-lg border border-rose-100 dark:border-rose-900 flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 gap-1">
            <span className="text-xs text-ui-fg-subtle font-medium uppercase tracking-wider truncate">
              Pending
            </span>
            <span className="text-xl font-semibold text-ui-fg-base truncate">
              {metrics.pendingCount}
            </span>
          </div>
        </Container>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Container className="p-3 flex flex-col gap-2">
          <div>
            <span className="text-ui-fg-base text-sm font-medium">
              Average Order Value (Last 7 Days)
            </span>
          </div>
          <div className="mt-1">
            <AovChart data={aovChartData} currency={displayCurrency} />
          </div>
        </Container>

        <Container className="p-3 flex flex-col gap-2">
          <div>
            <span className="text-ui-fg-base text-sm font-medium">
              Order Frequencies (Last 7 Days)
            </span>
          </div>
          <div className="mt-1">
            <OrdersChart data={ordersChartData} />
          </div>
        </Container>
      </div>

      {/* Products & Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Top Selling Products */}
        <Container className="p-3 flex flex-col gap-2">
          <div>
            <span className="text-ui-fg-base text-sm font-medium">
              Top Products
            </span>
          </div>
          <div className="h-px bg-ui-border-base w-full mt-1" />
          <div className="flex flex-col gap-3 mt-1 flex-grow">
            {metrics.products.length === 0 ? (
              <div className="text-center py-4 text-xs text-ui-fg-subtle italic font-normal flex items-center justify-center h-full">No products sold yet</div>
            ) : (
              metrics.products.map((p) => (
                <div key={p.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-normal">
                    <span className="text-ui-fg-base truncate max-w-[200px]">{p.title}</span>
                    <span className="text-ui-fg-subtle">{p.count} sold ({formatCurrency(p.sales, displayCurrency)})</span>
                  </div>
                  <div className="w-full bg-ui-bg-subtle rounded-full h-1 border border-ui-border-base overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500 opacity-80" 
                      style={{ width: `${(p.sales / maxProductSales) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Container>

        {/* Sales by Region */}
        <Container className="p-3 flex flex-col gap-2">
          <div>
            <span className="text-ui-fg-base text-sm font-medium">
              Sales by Region
            </span>
          </div>
          <div className="h-px bg-ui-border-base w-full mt-1" />
          <div className="flex flex-col gap-3 mt-1 flex-grow">
            {metrics.regions.length === 0 ? (
              <div className="text-center py-4 text-xs text-ui-fg-subtle italic font-normal flex items-center justify-center h-full">No orders in regions yet</div>
            ) : (
              metrics.regions.map((r) => (
                <div key={r.country} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-normal">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-ui-fg-base uppercase">{r.country}</span>
                    </div>
                    <span className="text-ui-fg-subtle">{r.count} orders ({formatCurrency(r.sales, displayCurrency)})</span>
                  </div>
                  <div className="w-full bg-ui-bg-subtle rounded-full h-1 border border-ui-border-base overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500 opacity-80" 
                      style={{ width: `${(r.sales / maxSalesRegion) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Container>
      </div>

      {/* Recent Orders Section */}
      <Container className="p-0 divide-y overflow-hidden shadow-none border-ui-border-base">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-ui-fg-base text-sm font-medium">
              Recent Orders
            </span>
          </div>
          <Button variant="secondary" size="small" className="h-6 text-xs py-0 px-3 font-normal shadow-none border-ui-border-base" asChild>
            <a href="/app/orders">View All Orders</a>
          </Button>
        </div>
        
        <Table>
          <Table.Header>
            <Table.Row className="bg-ui-bg-subtle">
              <Table.HeaderCell className="text-xs py-2 font-normal">Order</Table.HeaderCell>
              <Table.HeaderCell className="text-xs py-2 font-normal">Customer</Table.HeaderCell>
              <Table.HeaderCell className="text-xs py-2 font-normal">Date</Table.HeaderCell>
              <Table.HeaderCell className="text-xs py-2 font-normal">Status</Table.HeaderCell>
              <Table.HeaderCell className="text-right text-xs py-2 font-normal">Total</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <td colSpan={5} className="text-center py-6 text-xs text-ui-fg-subtle font-normal">
                  Loading recent orders...
                </td>
              </Table.Row>
            ) : latestOrders.length === 0 ? (
              <Table.Row>
                <td colSpan={5} className="text-center py-6 text-xs text-ui-fg-subtle font-normal">
                  No orders found.
                </td>
              </Table.Row>
            ) : (
              latestOrders.map((order: any) => (
                <Table.Row key={order.id} className="hover:bg-ui-bg-subtle transition-colors cursor-pointer text-xs font-normal">
                  <Table.Cell className="text-ui-fg-base py-2">
                    #{order.display_id}
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-subtle max-w-[200px] truncate py-2">
                    {getCustomerIdentity(order)}
                  </Table.Cell>
                  <Table.Cell className="text-ui-fg-subtle py-2">
                    {new Date(order.created_at).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="py-2">
                    <Badge 
                      color={
                        order.fulfillment_status === "delivered" || order.fulfillment_status === "shipped" || order.fulfillment_status === "fulfilled"
                          ? "green" 
                          : order.fulfillment_status === "canceled" || order.status === "canceled"
                          ? "red"
                          : "orange"
                      } 
                      size="small" 
                      className="text-xs px-2 py-0.5 h-5 leading-none font-normal"
                    >
                      {order.fulfillment_status || order.status}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell className="text-right text-ui-fg-base py-2">
                    {formatCurrency(Number(order.total || 0), order.currency_code || displayCurrency)}
                  </Table.Cell>
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table>
      </Container>
    </div>
  )
}

// Sidebar config
export const config = defineRouteConfig({
  label: "Dashboard",
  icon: ChartBar,
})

export default DashboardPage
