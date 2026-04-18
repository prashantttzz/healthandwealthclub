import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"

import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

import Spinner from "@modules/common/icons/spinner"

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction, isPending] = useActionState(login, null)

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center font-manrope text-accent"
      data-testid="login-page"
    >
      <h1 className="text-4xl lg:text-5xl font-newsreader italic tracking-tight mb-2">Welcome Back</h1>
      <p className="text-center text-[13px] text-accent/60 mb-10">
        Sign in to access your account and enhanced shopping experience.
      </p>
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
    </div>
  )
}

export default Login
