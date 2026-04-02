import { ComponentType } from "react"
import { createBrowserRouter } from "react-router-dom"
import ErrorPage from "@/components/error-page"
import HeroLayout from "@/layout/hero-layout"

function lazy<T extends { default: ComponentType<unknown> }>(importer: () => Promise<T>) {
  return async () => {
    const module = await importer()
    return {
      Component: module.default,
    }
  }
}

/**
 * Main application router configuration using React Router v6.
 * Defines all routes and their corresponding components.
 */
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <HeroLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          lazy: lazy(() => import("@/page/mod-codes")),
        },
        {
          path: "mod-codes",
          lazy: lazy(() => import("@/page/mod-codes")),
        },
      ],
    },
  ],
  {
    basename: "/",
  }
)

export default router
