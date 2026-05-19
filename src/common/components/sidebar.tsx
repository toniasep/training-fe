import { Link, useLocation } from "react-router-dom";
import {
  Sidebar as UiSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, FileText, ClipboardList } from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();

  return (
    <UiSidebar>
      <SidebarHeader className="h-16 flex items-center px-6 font-bold text-xl tracking-wide border-b">
        Backoffice
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/" || location.pathname === "/dashboard"}>
                  <Link to="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.startsWith("/requests")}>
                  <Link to="#">
                    <FileText />
                    <span>Requests</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.startsWith("/audit-logs")}>
                  <Link to="#">
                    <ClipboardList />
                    <span>Audit Logs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname.startsWith("/users")}>
                  <Link to="/users">
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </UiSidebar>
  );
};
