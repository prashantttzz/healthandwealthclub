import { defineMiddlewares } from "@medusajs/framework/http"
import { authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/reviews*",
      middlewares: [],
    },
    {
      matcher: "/admin/reviews*",
      middlewares: [authenticate("user", ["session", "bearer", "api-key"])],
    },
  ],
})
