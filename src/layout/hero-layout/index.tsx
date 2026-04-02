import { Outlet, Link } from "react-router-dom"
import { useMemo } from "react"
import dayjs from "dayjs"

/**
 * Main application component that serves as the root layout.
 * Uses React Router's Outlet to render child routes.
 */
export default function HeroLayout() {
  const today = useMemo(() => dayjs(), [])

  return (
    <div className="bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                三角洲行动改枪码库
              </h1>
            </div>
            <nav className="flex space-x-8">
              <Link
                to="/mod-codes"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                改枪码
              </Link>
              <a
                href="https://github.com/zihluwang/delta-force-firearm-modification-codes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                GitHub
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-screen-2xl mx-auto py-6 sm:px-6 lg:px-10">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-screen-2xl mx-auto py-4 px-4 sm:px-6 lg:px-10">
          <p className="text-center text-sm text-gray-500">
            © 2024-{today.year()} Zihlu Wang 和 OnixByte。使用 React 与 TypeScript 构建。
          </p>
        </div>
      </footer>
    </div>
  )
}