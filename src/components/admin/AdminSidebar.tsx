import { LayoutDashboard, Building, Building2, Shield, Home, ArrowLeft } from "lucide-react";
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
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavLink, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const menuItems = [
  { title: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Properties", path: "/admin/properties", icon: Building },
  { title: "Brokers", path: "/admin/brokers", icon: Shield },
  { title: "Organizations", path: "/admin/organizations", icon: Building2 },
];

export const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b p-4">
        <Link to="/" className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <ArrowLeft className="h-4 w-4" />
            {!collapsed && <span>Back to Marketplace</span>}
          </Button>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Portal</SidebarGroupLabel>
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
