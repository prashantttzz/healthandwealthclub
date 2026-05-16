import { Metadata } from "next"
import ResetPasswordTemplate from "@modules/account/templates/reset-password-template"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your Health & Wealth Club password.",
}

export default function ResetPasswordPage() {
  return <ResetPasswordTemplate />
}
