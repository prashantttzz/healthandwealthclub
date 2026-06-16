import { MedusaContainer } from "@medusajs/framework/types"

export default async function run({ container }: { container: MedusaContainer }) {
  try {
    const fulfillmentModule = container.resolve("fulfillment")
    const options = await fulfillmentModule.retrieveFulfillmentOptions("gcc-shipping_gcc-shipping")
    console.log("Options:", options)
  } catch (e) {
    console.error("Error:", e)
  }
}
