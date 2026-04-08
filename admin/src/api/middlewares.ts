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
      middlewares: [authenticate("admin", ["session", "bearer", "api-key"])],
    },
  ],
})
