import { AppSideBar } from "@/components/layout/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="flex-1 overflow-auto p-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
