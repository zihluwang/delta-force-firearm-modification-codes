import { ComponentType } from "react"
import { createBrowserRouter } from "react-router-dom"
import ErrorPage from "@/components/error-page"
import EmptyLayout from "@/layout/empty-layout"
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
          lazy: lazy(() => import("@/page/firearms")),
        },
        {
          path: "firearms",
          lazy: lazy(() => import("@/page/firearms")),
        },
        {
          path: "mod-codes",
          lazy: lazy(() => import("@/page/mod-codes")),
        },
      ],
    },
    {
      element: <EmptyLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "login",
          lazy: lazy(() => import("@/page/login")),
        },
      ],
    },
  ],
  {
    basename: "/",
  }
)

export default router
