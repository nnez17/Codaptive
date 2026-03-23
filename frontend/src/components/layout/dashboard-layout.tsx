import { Outlet } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/src/components/ui/sidebar";
import { DashboardSidebar } from "@/src/components/layout/dashboard-sidebar";

export function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
