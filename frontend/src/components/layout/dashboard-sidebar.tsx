import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { Link, useRouterState } from "@tanstack/react-router";
import { profileNavItems } from "data/sidebar";
import { useIsMobile } from "@/src/hooks/use-mobile";

export function DashboardSidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isMobile = useIsMobile();

  return (
    <Sidebar
      collapsible={isMobile ? "icon" : "none"}
      className="border-r border-gray-100 bg-white"
    >
      <SidebarHeader className="px-8 pt-12 pb-8">
        <Link to="/">
          <h1 className="text-2xl font-bold tracking-tight text-black font-sans">
            Codaptive
          </h1>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {profileNavItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      className={`h-auto px-4 py-3 text-lg font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-50"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Link to={item.href} className="flex items-center gap-4">
                        {item.icon ? (
                          <item.icon className="w-5 h-5 shrink-0" />
                        ) : null}
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
