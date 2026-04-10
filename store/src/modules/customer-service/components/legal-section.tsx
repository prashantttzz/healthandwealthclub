"use client"

export default function LegalSection({ type }: { type: "privacy" | "terms" }) {
  const isPrivacy = type === "privacy"
  
  return (
    <div className="w-full flex flex-col gap-10 text-accent font-manrope">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-newsreader italic tracking-tight">
          {isPrivacy ? "Privacy Policy" : "Terms of Use"}
        </h2>
        <p className="text-[13px] text-accent/60">
          Last Updated: April 2026
        </p>
      </div>

      <div className="prose prose-sm max-w-none text-accent/80 p-8 lg:p-12 bg-transparent border border-accent/10 rounded-2xl">
        {isPrivacy ? (
          <div className="space-y-6 text-[14px] leading-loose">
            <h3 className="text-[16px] font-bold text-accent">1. Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, items requested, delivery notes, and other information you choose to provide.
            </p>

            <h3 className="text-[16px] font-bold text-accent">2. Use of Information</h3>
            <p className="mb-2">We may use the information we collect about you to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide, maintain, and improve our Services, including, for example, to facilitate payments, send receipts, provide products and services you request, develop new features, and provide customer support.</li>
              <li>Perform internal operations, including to prevent fraud and abuse of our Services; troubleshoot software bugs and operational problems; conduct data analysis, testing, and research.</li>
              <li>Send you communications we think will be of interest to you, including information about products, services, promotions, news, and events of Health and Wealth Club.</li>
            </ul>

            <h3 className="text-[16px] font-bold text-accent">3. Sharing of Information</h3>
            <p>
              We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with third party service providers; in response to a request for information by a competent authority; with law enforcement officials, government authorities, or third parties if we believe your actions are inconsistent with our User agreements.
            </p>
          </div>
        ) : (
          <div className="space-y-6 text-[14px] leading-loose">
            <h3 className="text-[16px] font-bold text-accent">1. Acceptance of Terms</h3>
            <p>
              By accessing and using the Health and Wealth Club website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h3 className="text-[16px] font-bold text-accent">2. Provision of Services</h3>
            <p>
              We are constantly innovating in order to provide the best possible experience for our users. You acknowledge and agree that the form and nature of the Services which we provide may change from time to time without prior notice to you.
            </p>

            <h3 className="text-[16px] font-bold text-accent">3. Limitation of Liability</h3>
            <p>
              In no event will Health and Wealth Club, its affiliates or their licensors, service providers, employees, agents, officers or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Website, any websites linked to it, any content on the Website or such other websites or any services or items obtained through the Website.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
