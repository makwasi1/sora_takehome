import { ClockIcon, FolderIcon, HomeIcon, PlusIcon, Share2Icon, StarIcon, TrashIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const items = [
    {
        label: "Home",
        icon: HomeIcon,
        href: "/home",
    },
    {
        label: "My Drive",
        icon: FolderIcon,
        href: "/home/new",
    },
    {
        label: "Shared with me",
        icon: Share2Icon,
        href: "/home/shared",
    },
    {
        label: "Recent",
        icon: ClockIcon,
        href: "/home/recent",
    },
    {
        label: "Starred",
        icon: StarIcon,
        href: "/home/starred",
    },
    {
        label: "Trash",
        icon: TrashIcon,
        href: "/home/trash",
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

export function AppSideBar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar-background">
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl font-bold text-center mt-8 ml-2">Drive</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 py-1 mb-4 mt-4 ml-2">
              <Button variant={"outline"} className="w-40 h-15 justify-center gap-2" size="sm">
                <PlusIcon className="h-10 w-10" />
                <span>New</span>
              </Button>
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
                        <Link href={item.href} className="flex items-center gap-2">
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
    </Sidebar>
  );
}
