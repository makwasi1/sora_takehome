import { ReactNode } from "react"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background">
        <div className="flex h-16 items-center border-b px-4">
          <h1 className="text-xl font-bold">Drive Clone</h1>
        </div>
        <nav className="space-y-1 p-4">
          {/* Add navigation items here */}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-background">
          <div className="flex h-full items-center px-4">
            {/* Add header content here */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
} 