"use client"

import { useState, useActionState, useRef } from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup, sendOtp } from "@lib/data/customer"
import { SUPPORT_LINKS } from "@lib/constants"
import { toast } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(signup, null)
  
  const [signupStep, setSignupStep] = useState<"details" | "otp">("details")
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: ""
  })

  const formRef = useRef<HTMLFormElement>(null)

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (signupStep === "details") {
      e.preventDefault()
      setIsSendingOtp(true)
      const res = await sendOtp(formData.email)
      setIsSendingOtp(false)
      
      if (res.success) {
        toast.success("Verification code sent to your email")
        setSignupStep("otp")
      } else {
        toast.error(res.error || "Failed to send verification code")
      }
    }
    // If step is otp, allow form to submit naturally to formAction
  }

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
      
      <form ref={formRef} className="w-full space-y-6" action={formAction} onSubmit={handleSignupSubmit}>
        {signupStep === "details" ? (
          <>
            <div className="flex flex-col w-full gap-5">
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[12px] font-bold tracking-wide">First Name</label>
                  <input
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={e => setFormData(p => ({...p, first_name: e.target.value}))}
                    autoComplete="given-name"
                    className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                    placeholder="John"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label className="text-[12px] font-bold tracking-wide">Last Name</label>
                  <input
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={e => setFormData(p => ({...p, last_name: e.target.value}))}
                    autoComplete="family-name"
                    className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold tracking-wide">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                  autoComplete="email"
                  className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                  placeholder="hello@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold tracking-wide">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={e => setFormData(p => ({...p, phone: e.target.value}))}
                  className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                  placeholder="+1 234 567 8900"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[12px] font-bold tracking-wide">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={e => setFormData(p => ({...p, password: e.target.value}))}
                  autoComplete="new-password"
                  className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                  placeholder="••••••••"
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
              className="w-full h-14 bg-[#3d2f20] text-[#fbf8f1] font-bold text-[14px] transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" 
              disabled={isSendingOtp}
            >
              {isSendingOtp ? <Spinner size="20" color="#fbf8f1" /> : "Verify Email"}
            </button>
          </>
        ) : (
          <>
            <p className="text-center text-[14px] text-accent/80 mb-6 font-medium">
              Enter the 6-digit verification code sent to {formData.email}.
            </p>
            
            <input type="hidden" name="first_name" value={formData.first_name} />
            <input type="hidden" name="last_name" value={formData.last_name} />
            <input type="hidden" name="email" value={formData.email} />
            <input type="hidden" name="password" value={formData.password} />
            <input type="hidden" name="phone" value={formData.phone} />

            <div className="flex flex-col gap-2 w-full mb-6">
              <label className="text-[12px] font-bold tracking-wide">Verification Code</label>
              <input
                name="otp"
                type="text"
                maxLength={6}
                required
                className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[20px] text-center tracking-[0.5em] text-accent outline-none focus:border-accent/60 transition-colors"
              />
            </div>

            <ErrorMessage error={message} data-testid="register-error" />

            <button 
              type="submit"
              className="w-full h-14 bg-[#3d2f20] text-[#fbf8f1] font-bold text-[14px] transition-all hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2" 
              disabled={isPending}
            >
              {isPending ? <Spinner size="20" color="#fbf8f1" /> : "Verify & Join"}
            </button>
            
            <button 
              type="button"
              onClick={() => setSignupStep("details")}
              className="w-full text-center text-[12px] text-accent/60 mt-4 underline font-bold"
            >
              Back to details
            </button>
          </>
        )}
      </form>
      
      {signupStep === "details" && (
        <span className="text-center text-accent/60 text-[13px] mt-8">
          Already a member?{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
            className="font-bold text-accent underline tracking-wide"
          >
            Sign in.
          </button>
        </span>
      )}
    </div>
  )
}

export default Register
