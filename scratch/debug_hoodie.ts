async function debugHoodie() {
  const backendUrl = "https://health-wealthclub.onrender.com"
  const publishableKey = "pk_12b9edd6b8de567cd2c2e9715a4d58e882f11612600daa6f673ae55a280ccdf7"

  async function getProduct(handle: string) {
    const url = `${backendUrl}/store/products?handle=${handle}&fields=*variants.images,*images`
    const res = await fetch(url, {
      headers: {
        "x-publishable-api-key": publishableKey
      }
    })
    return res.json()
  }

  try {
    let data = await getProduct("hoodie")
    
    if (data.products && data.products.length > 0) {
      const product = data.products[0]
      console.log(`Product: ${product.title} (${product.handle})`)
      console.log(`Product Images: ${product.images?.length || 0}`)
      
      product.variants.forEach((v: any, i: number) => {
        console.log(`\nVariant ${i + 1}: ${v.title}`)
        console.log(`- Images count: ${v.images?.length || 0}`)
        if (v.images && v.images.length > 0) {
          v.images.forEach((img: any) => console.log(`  - ${img.url}`))
        }
      })
    } else {
      console.log("No hoodie found with handle 'hoodie'")
    }
  } catch (e) {
    console.error(e)
  }
}

debugHoodie()
