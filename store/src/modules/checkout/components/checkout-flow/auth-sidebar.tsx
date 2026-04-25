"use client"

import React, { useState, useEffect, useActionState } from "react"
import { login, signup } from "@lib/data/customer"
import { X, Smartphone } from "lucide-react"

const Ico = {
  x: (c = "") => <X className={c} strokeWidth={2} />,
}

const AuthSidebar = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [view, setView] = useState<"login" | "signup">("login")
  const [loginMessage, loginAction, pendingLogin] = useActionState(login, null)
  const [signupMessage, signupAction, pendingSignup] = useActionState(signup, null)

  // Listen to successful login (message is undefined on success)
  useEffect(() => {
    if (isOpen && pendingLogin === false && loginMessage === undefined) {
      window.location.reload()
    }
  }, [pendingLogin, loginMessage, isOpen])

  // Listen to successful signup (message is an object on success)
  useEffect(() => {
    if (isOpen && pendingSignup === false && signupMessage && typeof signupMessage === "object") {
      window.location.reload()
    }
  }, [pendingSignup, signupMessage, isOpen])

  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full max-w-[460px] bg-bg z-[100] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-accent/5">
          <h2 className="font-newsreader italic text-3xl text-accent">{view === "login" ? "Welcome Back" : "Join City Reach"}</h2>
          <button onClick={onClose} className="p-2 text-accent/30 hover:text-accent transition-colors">{Ico.x("w-5 h-5")}</button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          {view === "login" ? (
            <form action={loginAction} className="flex flex-col gap-5">
              <p className="font-manrope text-[13px] text-accent/50 mb-4 leading-relaxed">Sign in to sync your bag and access your saved addresses for a seamless experience.</p>
              
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Email Address</label>
                <input name="email" type="email" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Password</label>
                <input name="password" type="password" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors placeholder:text-accent/15" />
              </div>
              
              {loginMessage && typeof loginMessage === "string" && (
                <p className="text-red-500 font-manrope text-[11px] font-bold mt-2">{loginMessage}</p>
              )}

              <button disabled={pendingLogin} className="w-full py-4 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase mt-4 hover:bg-accent/90 transition-all disabled:opacity-50">
                {pendingLogin ? "Authenticating..." : "Sign In"}
              </button>

              <button type="button" onClick={() => setView("signup")} className="mt-8 font-manrope text-[12px] uppercase font-bold tracking-[0.1em] text-accent/50 hover:text-accent transition-colors">
                New here? create an account
              </button>
            </form>
          ) : (
            <form action={signupAction} className="flex flex-col gap-5">
              <p className="font-manrope text-[13px] text-accent/50 mb-4 leading-relaxed">Create an account to checkout faster and track your orders seamlessly.</p>
              
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">First Name</label>
                  <input name="first_name" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Last Name</label>
                  <input name="last_name" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Phone</label>
                <input name="phone" type="tel" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Email Address</label>
                <input name="email" type="email" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-manrope text-[11px] text-accent/40 font-bold uppercase tracking-[0.2em]">Password</label>
                <input name="password" type="password" required className="w-full h-12 px-4 bg-accent/[0.02] border border-accent/10 font-manrope text-[14px] text-accent outline-none focus:border-accent/30 transition-colors" />
              </div>

              {signupMessage && typeof signupMessage === "string" && (
                <p className="text-red-500 font-manrope text-[11px] font-bold mt-2">{signupMessage}</p>
              )}

              <button disabled={pendingSignup} className="w-full py-4 bg-accent text-bg font-manrope text-[13px] font-bold tracking-[0.3em] uppercase mt-4 hover:bg-accent/90 transition-all disabled:opacity-50">
                {pendingSignup ? "Creating..." : "Create Account"}
              </button>

              <button type="button" onClick={() => setView("login")} className="mt-8 font-manrope text-[12px] uppercase font-bold tracking-[0.1em] text-accent/50 hover:text-accent transition-colors">
                Already a member? Sign in
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default AuthSidebar
