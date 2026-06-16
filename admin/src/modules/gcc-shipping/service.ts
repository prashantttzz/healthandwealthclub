import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
import { CalculatedShippingOptionPrice, FulfillmentOption } from "@medusajs/types"

import { Client } from 'pg'

export default class GccShippingProviderService extends AbstractFulfillmentProviderService {
  static identifier = "gcc-shipping"

  constructor(container: any) {
    super()
  }

  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    return [
      { id: "gcc-weight-based", is_calculated: true },
      { id: "india-weight-based", is_calculated: true }
    ]
  }

  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<any> {
    return { ...data }
  }

  async validateOption(data: any): Promise<boolean> {
    return true
  }

  async canCalculate(data: any): Promise<boolean> {
    return true
  }

  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    cartContext: any
  ): Promise<CalculatedShippingOptionPrice> {
    if (!cartContext?.id) {
      return { calculated_amount: 0, is_calculated_price_tax_inclusive: false }
    }

    try {
      const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres.sxojtfykjtdzhkmchnce:bablaSupabase%4031@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
      const client = new Client({ connectionString: dbUrl })
      await client.connect()

      // Fetch cart items and product categories
      const queryStr = `
        SELECT c.id, ca.country_code, ci.quantity, ci.product_id 
        FROM cart c 
        LEFT JOIN cart_address ca ON c.shipping_address_id = ca.id 
        LEFT JOIN cart_line_item ci ON c.id = ci.cart_id 
        WHERE c.id = $1
      `
      const cartRes = await client.query(queryStr, [cartContext.id])
      
      if (cartRes.rows.length === 0) {
        await client.end()
        return { calculated_amount: 0, is_calculated_price_tax_inclusive: false }
      }

      const countryCode = cartRes.rows[0].country_code?.toLowerCase() || ""

      // Pricing matrix
      const matrix: Record<string, Record<number, number>> = {
        sa: { 1: 85, 2: 100, 3: 120, 4: 135, 5: 160 },
        qa: { 1: 85, 2: 100, 3: 120, 4: 135, 5: 160 },
        bh: { 1: 90, 2: 125, 3: 165, 4: 200, 5: 235 },
        kw: { 1: 110, 2: 155, 3: 200, 4: 245, 5: 260 },
        om: { 1: 65, 2: 80, 3: 90, 4: 100, 5: 115 },
        in: { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250 }, // For testing purposes
      }

      if (!matrix[countryCode]) {
        // If not a GCC country, fallback to 0 or original option data
        // Ideally we shouldn't use this provider for non-GCC if configured correctly.
        return { calculated_amount: 0, is_calculated_price_tax_inclusive: false }
      }

      let heavyItems = 0 // Jackets, Pants, Hoodies (1 piece = 1kg)
      let lightItems = 0 // Others (up to 2 pieces = 1kg)

      const targetCategories = ["hoodie", "jacket", "pant", "hoodies", "jackets", "pants"]

      for (const row of cartRes.rows) {
        if (!row.product_id) continue;
        const quantity = row.quantity || 1
        
        // Fetch product categories for this product
        const catQuery = `
          SELECT pc.name 
          FROM product_category pc
          JOIN product_category_product pcp ON pc.id = pcp.product_category_id
          WHERE pcp.product_id = $1
        `
        const catRes = await client.query(catQuery, [row.product_id])
        
        let isHeavy = false
        for (const catRow of catRes.rows) {
          const catName = (catRow.name || "").toLowerCase()
          if (targetCategories.some(t => catName.includes(t))) {
            isHeavy = true
            break
          }
        }

        if (isHeavy) {
          heavyItems += quantity
        } else {
          lightItems += quantity
        }
      }

      await client.end()

      // Calculate weight
      // heavyItems: 1kg each
      // lightItems: 1kg per 2 pieces (ceil division)
      let totalWeight = heavyItems + Math.ceil(lightItems / 2)

      // Minimum weight is 1kg if there are any items
      if (totalWeight === 0 && (heavyItems > 0 || lightItems > 0)) {
        totalWeight = 1
      }
      
      // Cap at 5kg as requested
      if (totalWeight > 5) {
        totalWeight = 5
      }

      const priceTable = matrix[countryCode]
      const finalPrice = priceTable[totalWeight] || priceTable[5] || 0

      return { calculated_amount: finalPrice, is_calculated_price_tax_inclusive: false }
    } catch (error) {
      console.error("Error calculating GCC shipping price:", error)
      return { calculated_amount: 0, is_calculated_price_tax_inclusive: false }
    }
  }

  async createFulfillment(
    data: Record<string, unknown>,
    items: any[],
    order: any,
    fulfillment: any
  ) {
    return { data: {}, labels: [] }
  }

  async cancelFulfillment(fulfillment: Record<string, unknown>) {
    return {}
  }

  async createReturnFulfillment(fromData: Record<string, unknown>) {
    return { data: {}, labels: [] }
  }

  async getFulfillmentDocuments(data: Record<string, unknown>) {
    return []
  }

  async retrieveDocuments(fulfillmentData: Record<string, unknown>, documentType: string): Promise<void> {
  }

  async getReturnDocuments(data: Record<string, unknown>) {
    return []
  }

  async getShipmentDocuments(data: Record<string, unknown>) {
    return []
  }
}
