import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-transparent flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <Heading level="h2" className="font-newsreader italic text-xl md:text-2xl text-accent">
          Already have an account?
        </Heading>
        <Text className="font-manrope text-[11px] uppercase tracking-widest font-bold text-accent/40">
          Sign in for a better experience.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10 bg-accent text-bg px-10 hover:bg-accent rounded-none!" data-testid="sign-in-button">
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
