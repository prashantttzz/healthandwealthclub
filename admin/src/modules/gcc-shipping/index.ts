import GccShippingProviderService from "./service"
import { ModuleProviderExports } from "@medusajs/framework/types"

const services = [GccShippingProviderService]

export default {
  services,
} as ModuleProviderExports
