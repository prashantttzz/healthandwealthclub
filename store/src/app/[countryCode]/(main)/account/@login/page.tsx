import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Account",
  description: "your account.",
}

export default function Login(props: {
  params: Promise<{ countryCode: string }>
}) {
  return <LoginTemplate />
}
