import { Metadata } from "next"
import AboutUsTemplate from "@modules/about/templates"

export const metadata: Metadata = {
  title: "About Us | The Health & Wealth Club",
  description: "Learn more about the vision, ethos, and team behind The Health & Wealth Club.",
}

export default function AboutUsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  return <AboutUsTemplate />
}
