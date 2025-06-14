import { AppSideBar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSideBar />
        <div className="flex flex-col flex-1">
          <Header />
          <main>{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
