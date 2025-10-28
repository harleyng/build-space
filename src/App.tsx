import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PortalLayout } from "@/components/layouts/PortalLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import Index from "./pages/Index";
import Listings from "./pages/Listings";
import ListingDetail from "./pages/ListingDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import SubmitListing from "./pages/SubmitListing";
import MyListings from "./pages/MyListings";
import AdminListings from "./pages/AdminListings";
import AgentRegistration from "./pages/AgentRegistration";
import AdminUsers from "./pages/AdminUsers";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalProperties from "./pages/portal/PortalProperties";
import PortalCustomers from "./pages/portal/PortalCustomers";
import PortalMarketing from "./pages/portal/PortalMarketing";
import PortalOrganization from "./pages/portal/PortalOrganization";
import PortalProfile from "./pages/portal/PortalProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBrokers from "./pages/admin/AdminBrokers";
import AdminOrganizations from "./pages/admin/AdminOrganizations";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Marketplace */}
          <Route path="/" element={<Index />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          
          {/* Auth */}
          <Route path="/auth" element={<Auth />} />
          
          {/* Legacy Routes (backwards compatibility) */}
          <Route path="/submit-listing" element={<SubmitListing />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/register-agent" element={<AgentRegistration />} />
          
          {/* Broker/Organization Portal */}
          <Route element={<ProtectedRoute roles={['BROKER', 'ORGANIZATION']} />}>
            <Route path="/portal" element={<PortalLayout />}>
              <Route index element={<Navigate to="/portal/dashboard" replace />} />
              <Route path="dashboard" element={<PortalDashboard />} />
              <Route path="properties" element={<PortalProperties />} />
              <Route path="properties/new" element={<SubmitListing />} />
              <Route path="properties/:id/edit" element={<SubmitListing />} />
              <Route path="customers" element={<PortalCustomers />} />
              <Route path="marketing" element={<PortalMarketing />} />
              <Route path="organization" element={<PortalOrganization />} />
              <Route path="profile" element={<PortalProfile />} />
            </Route>
          </Route>
          
          {/* Admin Portal */}
          <Route element={<ProtectedRoute roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="properties" element={<AdminListings />} />
              <Route path="brokers" element={<AdminBrokers />} />
              <Route path="organizations" element={<AdminOrganizations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="listings" element={<AdminListings />} />
            </Route>
          </Route>
          
          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
