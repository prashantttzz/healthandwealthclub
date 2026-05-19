export default function medusaError(error: any): never {
  console.log("error",error)
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const u = new URL(error.config.url, error.config.baseURL)
    console.error("Resource:", u.toString())
    console.error("Response data:", error.response.data)
    console.error("Status code:", error.response.status)
    console.error("Headers:", error.response.headers)

    // Extracting the error message from the response data
    const message = typeof error.response.data.message === 'string' 
      ? error.response.data.message 
      : (typeof error.response.data === 'string' ? error.response.data : "")

    if (message.includes("Some variant does not have the required inventory")) {
      throw new Error("Not enough items in stock.")
    }

    throw new Error(message ? message.charAt(0).toUpperCase() + message.slice(1) + "." : "An error occurred.")
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error("No response received: " + error.request)
  } else {
    console.log("error",error)
    const msg = error.message || ""
    if (msg.includes("Some variant does not have the required inventory")) {
      throw new Error("Not enough items in stock.")
    }
    // Something happened in setting up the request that triggered an Error
    throw new Error("Error setting up the request: " + msg)
  }
}
