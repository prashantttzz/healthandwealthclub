import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Client } from "pg"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })

  try {
    await client.connect()

    const queryStr = `
      SELECT c.id, ca.country_code, ci.quantity, ci.product_id 
      FROM cart c 
      LEFT JOIN cart_address ca ON c.shipping_address_id = ca.id 
      LEFT JOIN cart_line_item ci ON c.id = ci.cart_id 
      WHERE c.id = $1
    `
    const cartRes = await client.query(queryStr, [id])
    
    if (cartRes.rows.length === 0) {
      await client.end()
      return res.json({ error: "Cart not found" })
    }

    const targetCategories = ["pant", "hoodie", "jacket", "pants", "hoodies", "jackets"]
    let totalHeavyQuantity = 0
    let totalLightQuantity = 0

    for (const row of cartRes.rows) {
      if (!row.product_id) continue

      const qty = parseInt(row.quantity, 10)

      const catQueryStr = `
        SELECT pc.name 
        FROM product_category_product pcp
        JOIN product_category pc ON pcp.product_category_id = pc.id
        WHERE pcp.product_id = $1
      `
      const catRes = await client.query(catQueryStr, [row.product_id])

      let isHeavy = false
      for (const catRow of catRes.rows) {
        const catName = (catRow.name || "").toLowerCase()
        if (targetCategories.some(t => catName.includes(t))) {
          isHeavy = true
          break
        }
      }

      if (isHeavy) {
        totalHeavyQuantity += qty
      } else {
        totalLightQuantity += qty
      }
    }

    await client.end()

    // Calculate weight the exact same way
    const heavyWeight = totalHeavyQuantity * 1
    const lightWeight = Math.ceil(totalLightQuantity / 2) * 1
    const totalWeight = heavyWeight + lightWeight

    const countryCode = (cartRes.rows[0]?.country_code || "").toLowerCase()

    const matrix: Record<string, Record<number, number>> = {
      sa: { 1: 50, 2: 70, 3: 100, 4: 120, 5: 150 },
      qa: { 1: 50, 2: 70, 3: 100, 4: 120, 5: 150 },
      bh: { 1: 5, 2: 7, 3: 10, 4: 12, 5: 15 },
      kw: { 1: 5, 2: 7, 3: 10, 4: 12, 5: 15 },
      om: { 1: 5, 2: 7, 3: 10, 4: 12, 5: 15 },
      in: { 1: 50, 2: 100, 3: 150, 4: 200, 5: 250 },
      ae: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    }

    const rates = matrix[countryCode] || matrix["sa"] // fallback to SA if not found just to show something

    res.json({
      breakdown: {
        heavyQuantity: totalHeavyQuantity,
        lightQuantity: totalLightQuantity,
        totalWeightKg: totalWeight,
        rates,
        countryCode
      }
    })

  } catch (error) {
    await client.end()
    res.status(500).json({ error: error.message })
  }
}
