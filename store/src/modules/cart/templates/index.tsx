import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-20 bg-bg min-h-screen">
      <div className="content-container px-4 md:px-8 max-w-[1440px] mx-auto" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-x-12 lg:gap-x-24">
            <div className="flex flex-col py-6 gap-y-12">
              {!customer && (
                <div className="border-b border-black/5 pb-8">
                  <SignInPrompt />
                </div>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-24 pt-6">
                {cart && cart.region && (
                  <div className="border-t lg:border-t-0 lg:border-l border-black/5 lg:pl-12">
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
