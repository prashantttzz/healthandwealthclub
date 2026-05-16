import { retrieveCustomer } from "@lib/data/customer"
import AccountLayout from "@modules/account/templates/account-layout"

export const dynamic = "force-dynamic"

export default async function AccountPageLayout(props: {
  dashboard: React.ReactNode
  login: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const { dashboard, login } = props
  const customer = await retrieveCustomer().catch(() => null)

  return (
    <AccountLayout customer={customer}>
      {customer ? dashboard : login}
    </AccountLayout>
  )
}
