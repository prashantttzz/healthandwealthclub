import { Metadata } from "next"
import CustomerServiceTemplate from "@modules/customer-service/templates"

export const metadata: Metadata = {
  title: "Customer Support",
  description: "Find answers to your questions, policies, and contact information.",
}

export default function CustomerServicePage() {
  return <CustomerServiceTemplate />
}
