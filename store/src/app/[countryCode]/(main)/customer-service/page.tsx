import { Metadata } from "next"
import CustomerServiceTemplate from "@modules/customer-service/templates"

export const metadata: Metadata = {
  title: "Customer Service | City Reach",
  description: "Get in touch with our concierge team for support, shipping inquiries, and more.",
}

export default function CustomerServicePage() {
  return <CustomerServiceTemplate />
}
