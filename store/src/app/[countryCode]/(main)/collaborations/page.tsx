import { Metadata } from "next"
import AboutUsTemplate from "@modules/about/templates"

export const metadata: Metadata = {
  title: "Collaborations | City Reach",
  description: "Learn more about the vision, ethos, and team behind City Reach.",
}

export default function AboutUsPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  return <AboutUsTemplate />
}
