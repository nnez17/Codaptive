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
} from "@/src/components/ui/sidebar";
import { PanelLeft } from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useAccount } from "@/src/contexts/account";
import {
  loggedOutNavItems,
  loggedInNavItems,
  profileNavItems,
  type NavItem,
} from "data/sidebar";

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { account } = useAccount();

  let navItems: NavItem[] = loggedOutNavItems;

  if (account) {
    if (currentPath === "/profile" || currentPath === "/settings") {
      navItems = profileNavItems;
    } else {
      navItems = loggedInNavItems;
    }
  }

  return (
    <Sidebar className="border-r border-gray-100 bg-white transition-all">
      <SidebarHeader className="px-6 md:px-8 pt-8 md:pt-12 pb-6 md:pb-8">
        <Link
          to="/"
          className="block"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-black font-sans">
            Codaptive
          </h1>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 md:px-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 md:gap-3">
              {navItems.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      className={`h-auto px-3 md:px-4 py-2.5 md:py-3 text-base md:text-lg font-medium rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-blue-50 text-blue-600 hover:bg-blue-50"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Link
                        to={item.href.split("#")[0]}
                        hash={
                          item.href.includes("#")
                            ? item.href.split("#")[1]
                            : undefined
                        }
                        className="flex items-center gap-3 md:gap-4"
                        onClick={() => {
                          if (item.href === "/") {
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }
                        }}
                      >
                        {item.icon ? (
                          <item.icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                        ) : null}
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* Collapse */}
              <SidebarMenuItem className="pt-2 hidden md:block">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="flex items-center gap-4 w-full px-4 py-3 text-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
                >
                  <div className="p-1 border-2 border-gray-400 rounded-md">
                    <PanelLeft className="w-4 h-4" />
                  </div>
                  <span>Collapse</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
