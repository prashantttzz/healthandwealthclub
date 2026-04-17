"use client"

import { Badge, Heading, Input, Label, Text } from "@medusajs/ui"
import React from "react"

import { applyPromotions } from "@lib/data/cart"
import { useCurrencyFormatter } from "@lib/currency"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { SubmitButton } from "../submit-button"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { formatPrice } = useCurrencyFormatter()

  const { promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    setIsLoading(true)
    try {
      const validPromotions = promotions.filter(
        (promotion) => promotion.code !== code
      )

      await applyPromotions(
        validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
      )
    } finally {
      setIsLoading(false)
    }
  }

  const addPromotionCode = async (formData: FormData) => {
    setErrorMessage("")
    setIsLoading(true)

    const code = formData.get("code")
    if (!code) {
      setIsLoading(false)
      return
    }
    const input = document.getElementById("promotion-input") as HTMLInputElement
    const codes = promotions
      .filter((p) => p.code !== undefined)
      .map((p) => p.code!)
    codes.push(code.toString())

    try {
      await applyPromotions(codes)
    } catch (e: any) {
      setErrorMessage(e.message)
    } finally {
      setIsLoading(false)
    }

    if (input) {
      input.value = ""
    }
  }

  return (
    <div className="w-full bg-transparent flex flex-col">
      <div className="txt-medium">
        <form action={(a) => addPromotionCode(a)} className="w-full mb-5">
           <div className="flex flex-col gap-3">
              <label
                htmlFor="promotion-input"
                className="font-manrope text-[10px] uppercase font-bold tracking-[0.2em] text-accent/60"
              >
                Promo Code
              </label>
              <div className="flex w-full gap-x-2">
                <input
                  className="w-full h-12 px-4 bg-accent/[0.03] border border-black/5 focus:border-accent/20 focus:bg-accent/[0.05] transition-all outline-none font-manrope text-[12px] uppercase tracking-widest text-accent placeholder:text-accent/20"
                  id="promotion-input"
                  name="code"
                  type="text"
                  placeholder="Enter code"
                  data-testid="discount-input"
                />
                <button
                  type="submit"
                  data-testid="discount-apply-button"
                  disabled={isLoading}
                  className="bg-accent text-bg px-6 font-manrope text-[11px] uppercase font-bold tracking-widest hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 min-w-[80px] flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
           </div>

           <ErrorMessage
            error={errorMessage}
            data-testid="discount-error-message"
          />
        </form>

        {promotions.length > 0 && (
          <div className="w-full flex items-center">
            <div className="flex flex-col w-full">
              <Heading className="txt-medium mb-2">
                Promotion(s) applied:
              </Heading>

              {promotions.map((promotion) => {
                return (
                  <div
                    key={promotion.id}
                    className="flex items-center justify-between w-full max-w-full mb-2"
                    data-testid="discount-row"
                  >
                    <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                      <span className="truncate" data-testid="discount-code">
                        <Badge
                          color={promotion.is_automatic ? "green" : "grey"}
                          size="small"
                        >
                          {promotion.code}
                        </Badge>{" "}
                        (
                        {promotion.application_method?.value !== undefined &&
                          promotion.application_method.currency_code !==
                            undefined && (
                            <>
                              {promotion.application_method.type ===
                              "percentage"
                                ? `${promotion.application_method.value}%`
                                : formatPrice(+promotion.application_method.value)}
                            </>
                          )}
                        )
                        {/* {promotion.is_automatic && (
                          <Tooltip content="This promotion is automatically applied">
                            <InformationCircleSolid className="inline text-zinc-400" />
                          </Tooltip>
                        )} */}
                      </span>
                    </Text>
                    {!promotion.is_automatic && (
                      <button
                        className="flex items-center"
                        onClick={() => {
                          if (!promotion.code) {
                            return
                          }

                          removePromotionCode(promotion.code)
                        }}
                        data-testid="remove-discount-button"
                      >
                        <Trash size={14} />
                        <span className="sr-only">
                          Remove discount code from order
                        </span>
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscountCode
