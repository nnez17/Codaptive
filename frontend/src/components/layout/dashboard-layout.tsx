import { Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";

export function DashboardLayout() {
  const isCompact = useMediaQuery("(max-width: 1023px)");

  return (
    <SidebarProvider defaultOpen={true} forceIsMobile={isCompact || undefined}>
      <DashboardSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
