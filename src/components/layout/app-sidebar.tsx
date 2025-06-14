import { ClockIcon, FolderIcon, HomeIcon, Share2Icon, StarIcon, TrashIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { UploadButton } from "../shared/upload-button";


const items = [
    {
        label: "Home",
        icon: HomeIcon,
        href: "/home",
    },
    {
        label: "My Folders",
        icon: FolderIcon,
        href: "/folders",
    },
    {
        label: "Shared with me",
        icon: Share2Icon,
        href: "#",
    },
    {
        label: "Recent",
        icon: ClockIcon,
        href: "#",
    },
    {
        label: "Starred",
        icon: StarIcon,
        href: "#",
    },
    {
        label: "Trash",
        icon: TrashIcon,
        href: "#h",
    }
];

const groupedItems = items.reduce((groups, item, index) => {
  const groupIndex = Math.floor(index / 2);
  if (!groups[groupIndex]) {
    groups[groupIndex] = [];
  }
  groups[groupIndex].push(item);
  return groups;
}, [] as typeof items[]);

export async function AppSideBar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-background">
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold text-center mt-8 ml-2">
            Super Drive
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1 mb-4 mt-4 ml-2">
              <UploadButton />
            </div>
            <SidebarMenu className="ml-5">
              {groupedItems.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-2">
                  {group.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        variant="default"
                        className="w-full justify-start gap-2"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                  {groupIndex < groupedItems.length - 1 && (
                    <div className="h-4" />
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
