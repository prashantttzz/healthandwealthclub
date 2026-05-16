"use client"

import { login, sendPasswordResetEmail } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { toast } from "@medusajs/ui"

import { useState, useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

import Spinner from "@modules/common/icons/spinner"

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(login, null)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [isSendingReset, setIsSendingReset] = useState(false)

  const handleResetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSendingReset(true)
    const res = await sendPasswordResetEmail(resetEmail)
    setIsSendingReset(false)
    if (res.success) {
      toast.success("Password reset link sent to your email")
      setIsForgotPassword(false)
    } else {
      toast.error(res.error || "Failed to send reset link")
    }
  }

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center font-manrope text-accent"
      data-testid="login-page"
    >
      <h1 className="text-4xl lg:text-5xl font-newsreader italic tracking-tight mb-2">
        {isForgotPassword ? "Reset Password" : "Welcome Back"}
      </h1>
      <p className="text-center text-[13px] text-accent/60 mb-10">
        {isForgotPassword
          ? "Enter your email address and we'll send you a link to reset your password."
          : "Sign in to access your account and enhanced shopping experience."}
      </p>

      {isForgotPassword ? (
        <form onSubmit={handleResetPasswordSubmit} className="w-full space-y-6">
          <div className="flex flex-col w-full gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold tracking-wide">Email</label>
              <input
                name="email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                placeholder="hello@example.com"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-14 bg-accent text-[#fbf8f1] font-bold text-[14px] transition-all hover:opacity-90 disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            disabled={isSendingReset}
          >
            {isSendingReset ? <Spinner size="20" color="#fbf8f1" /> : "Send Reset Link"}
          </button>
          
          <button
            type="button"
            onClick={() => setIsForgotPassword(false)}
            className="w-full text-center text-[12px] text-accent/60 mt-4 underline font-bold"
          >
            Back to Sign in
          </button>
        </form>
      ) : (
        <form className="w-full space-y-6" action={formAction}>
          <div className="flex flex-col w-full gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold tracking-wide">Email</label>
              <input
                name="email"
                type="email"
                title="Enter a valid email address."
                autoComplete="email"
                required
                className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                placeholder="hello@example.com"
                data-testid="email-input"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold tracking-wide">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                placeholder="••••••••"
                data-testid="password-input"
              />
            </div>
            
            <div className="flex justify-end -mt-3 mb-2">
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-[11px] font-bold text-accent/60 hover:text-accent transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </div>
          <ErrorMessage error={message} data-testid="login-error-message" />
          <button 
            type="submit"
            className="w-full h-14 bg-accent text-[#fbf8f1] font-bold text-[14px] transition-all hover:opacity-90 disabled:opacity-50 mt-4 flex items-center justify-center gap-2" 
            data-testid="sign-in-button"
            disabled={isPending}
          >
            {isPending ? <Spinner size="20" color="#fbf8f1" /> : "Sign in"}
          </button>
        </form>
      )}

      {!isForgotPassword && (
        <span className="text-center text-accent/60 text-[13px] mt-8">
          Not a member?{" "}
          <button
            onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
            className="font-bold text-accent underline tracking-wide"
            data-testid="register-button"
          >
            Join us.
          </button>
        </span>
      )}
    </div>
  )
}

export default Login
