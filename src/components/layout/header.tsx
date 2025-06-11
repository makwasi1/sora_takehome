import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { LogOut, User } from "lucide-react"
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