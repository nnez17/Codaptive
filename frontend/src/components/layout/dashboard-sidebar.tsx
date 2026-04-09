import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useRouterState } from "@tanstack/react-router";
import { profileNavItems } from "data/sidebar";

export function DashboardSidebar() {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { isMobile } = useSidebar();

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className="border-r border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="px-8 pt-12 pb-8">
        <Link to="/">
          <h1 className="text-2xl font-bold tracking-tight text-sidebar-foreground font-sans">
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
                          ? "bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/10"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
