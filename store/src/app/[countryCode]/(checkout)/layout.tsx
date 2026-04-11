export default function CheckoutLayout(props: {
  children: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  return <>{props.children}</>
}
