import { Heading, Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div 
      className="py-48 px-4 flex flex-col justify-center items-center text-center bg-bg min-h-[60vh]" 
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="font-newsreader italic text-5xl md:text-7xl text-accent mb-6"
      >
        Your cart is empty
      </Heading>
      <Text className="font-manrope text-[11px] uppercase tracking-[0.3em] font-bold text-accent/40 mb-12 max-w-sm leading-relaxed">
        The collection awaits. Begin your search for handcrafted excellence and timeless style.
      </Text>
      <LocalizedClientLink 
        href="/store"
        className="px-12 py-4 bg-accent text-bg font-manrope text-[11px] uppercase font-bold tracking-[0.3em] hover:bg-accent/90 transition-all duration-300 rounded-full"
      >
        Browse products
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
