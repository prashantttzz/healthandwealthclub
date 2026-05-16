"use client"

import React, { useState, useEffect } from "react"
import { useSearchParams, useRouter, useParams } from "next/navigation"
import { verifyAndResetPassword } from "@lib/data/customer"
import Spinner from "@modules/common/icons/spinner"
import { toast } from "@medusajs/ui"

const ResetPasswordTemplate = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { countryCode } = useParams()
  
  const email = searchParams.get("email")
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!email || !token) {
      toast.error("Invalid or missing password reset link.")
      router.push(`/${countryCode}/account`)
    }
  }, [email, token, router, countryCode])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsSubmitting(true)
    const res = await verifyAndResetPassword(email as string, token as string, password)
    setIsSubmitting(false)

    if (res.success) {
      toast.success("Password updated successfully!")
      router.push(`/${countryCode}/account`)
    } else {
      toast.error(res.error || "Failed to update password")
    }
  }

  if (!email || !token) return null

  return (
    <div className="w-full min-h-[60vh] flex justify-center items-center py-24 px-4 bg-bg">
      <div className="max-w-sm w-full flex flex-col items-center font-manrope text-accent" data-testid="reset-password-page">
        <h1 className="text-4xl lg:text-5xl font-newsreader italic tracking-tight mb-2 text-center">
          Reset Password
        </h1>
        <p className="text-center text-[13px] text-accent/60 mb-10">
          Enter a new password for {email}.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex flex-col w-full gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold tracking-wide">New Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[12px] font-bold tracking-wide">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-14 px-4 bg-transparent border border-accent/20 text-[14px] text-accent outline-none focus:border-accent/60 transition-colors placeholder:text-accent/30"
                placeholder="••••••••"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full h-14 bg-accent text-[#fbf8f1] font-bold text-[14px] transition-all hover:opacity-90 disabled:opacity-50 mt-4 flex items-center justify-center gap-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Spinner size="20" color="#fbf8f1" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordTemplate
