import { Home, Building, Users, Megaphone, Building2, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

const menuItems = [
  { title: "Dashboard", path: "/portal/dashboard", icon: Home, description: "Tổng quan" },
  { title: "Hồ sơ cá nhân", path: "/portal/profile", icon: User, description: "Xác thực và quản lý" },
  { title: "Quản lý tin đăng", path: "/portal/properties", icon: Building, description: "CRUD và kiểm soát" },
  { title: "Quản lý khách hàng", path: "/portal/customers", icon: Users, description: "CRM" },
  { title: "Marketing", path: "/portal/marketing", icon: Megaphone, description: "Chiến dịch" },
  { title: "Tổ chức", path: "/portal/organization", icon: Building2, description: "Quản lý văn phòng" },
];

export const PortalSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Broker Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.path}
                        className={({ isActive }) =>
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }
                      >
                        <Icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
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
};
