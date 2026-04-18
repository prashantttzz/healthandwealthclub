import { Metadata } from "next"
import SizeGuideTemplate from "@modules/size-guide/templates"

export const metadata: Metadata = {
  title: "Size Guide | The Health & Wealth Club",
  description: "Comprehensive size guide for all Club collections. Precision measurements to ensure your perfect fit.",
}

// Enable caching for the size guide page (24 hours)
export const revalidate = 86400

export default function SizeGuidePage() {
  return <SizeGuideTemplate />
}
