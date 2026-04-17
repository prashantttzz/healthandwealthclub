"use client"

import { useActionState } from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { SUPPORT_LINKS } from "@lib/constants"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center font-manrope text-accent"
      data-testid="register-page"
    >
      <h1 className="text-4xl lg:text-5xl font-newsreader italic tracking-tight mb-2 text-center">
        Become a Member
      </h1>
      <p className="text-center text-[13px] text-accent/60 mb-10">
        Create your profile to access an enhanced shopping experience.
      </p>
      <form className="w-full space-y-6" action={formAction}>
        <div className="flex flex-col w-full gap-5">
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[12px] font-bold tracking-wide">First Name</label>
              <input
                name="first_name"
                type="text"
                required
                autoComplete="given-name"
                className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                placeholder="John"
                data-testid="first-name-input"
              />
            </div>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[12px] font-bold tracking-wide">Last Name</label>
              <input
                name="last_name"
                type="text"
                required
                autoComplete="family-name"
                className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                placeholder="Doe"
                data-testid="last-name-input"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold tracking-wide">Email</label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
              placeholder="hello@example.com"
              data-testid="email-input"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold tracking-wide">Phone</label>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
              placeholder="+1 234 567 8900"
              data-testid="phone-input"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold tracking-wide">Password</label>
            <input
              name="password"
              type="password"
              required
              autoComplete="new-password"
              className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
              placeholder="••••••••"
              data-testid="password-input"
            />
          </div>
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        
        <span className="block text-center text-accent/60 text-[11px] mt-2 mb-6">
          By creating an account, you agree to our{" "}
          <LocalizedClientLink
            href={SUPPORT_LINKS.privacy}
            className="font-bold underline text-accent"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href={SUPPORT_LINKS.terms}
            className="font-bold underline text-accent"
          >
            Terms of Use
          </LocalizedClientLink>.
        </span>

        <button 
          type="submit"
          className="w-full h-14 bg-[#3d2f20] text-[#fbf8f1] font-bold text-[14px] transition-all hover:opacity-90 disabled:opacity-50" 
          data-testid="register-button"
        >
          Join
        </button>
      </form>
      <span className="text-center text-accent/60 text-[13px] mt-8">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="font-bold text-accent underline tracking-wide"
        >
          Sign in.
        </button>
      </span>
    </div>
  )
}

export default Register
