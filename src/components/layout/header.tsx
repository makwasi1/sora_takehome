import { SidebarTrigger } from "@/components/ui/sidebar"

export function Header() {
  return (
    <header className="bg-background">
      <div className="flex h-16 items-center px-2">
        <div className="flex items-center">
          <SidebarTrigger />
        </div>
      </div>
    </header>
  )
} 