import { Gift } from "@medusajs/icons"
import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"

const OrderGiftingWidget = ({ data }: DetailWidgetProps<AdminOrder>) => {
  const metadata = data.shipping_address?.metadata
  const recipientName = metadata?.recipient_name as string | undefined
  const recipientPhone = metadata?.recipient_phone as string | undefined

  if (!recipientName && !recipientPhone) {
    return null
  }

  return (
    <Container className="p-6">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-ui-border-base">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-500 dark:bg-orange-950 dark:text-orange-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <Heading level="h3" className="text-ui-fg-base font-regular">
              Gifting Information
            </Heading>
            <Text className="text-ui-fg-subtle text-xs mt-0.5">
              This order was marked as a gift by the buyer.
            </Text>
          </div>
        </div>
        <Badge color="orange" size="small" className="font-medium text-xs ">
          Gift Order
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-1 bg-ui-bg-subtle p-3 rounded-lg border border-ui-border-base">
          <Text className="text-ui-fg-subtle text-xs font-regular">
            Recipient Name
          </Text>
          <Text className="text-ui-fg-base font-medium text-xs mt-0.5">
            {recipientName || "—"}
          </Text>
        </div>

        <div className="flex flex-col gap-1 bg-ui-bg-subtle p-3 rounded-lg border border-ui-border-base">
          <Text className="text-ui-fg-subtle text-xs font-regular">
            Recipient Phone
          </Text>
          <Text className="text-ui-fg-base font-medium text-xs mt-0.5">
            {recipientPhone || "—"}
          </Text>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.before",
})

export default OrderGiftingWidget
