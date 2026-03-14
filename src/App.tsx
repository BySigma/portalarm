import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TenantProvider } from "@/contexts/TenantContext";
import { TenantGuard, AdminGuard } from "@/components/guards/RouteGuards";

import Dashboard from "@/pages/Dashboard";
import Conversations from "@/pages/Conversations";
import Leads from "@/pages/Leads";
import Reports from "@/pages/Reports";
import MyAI from "@/pages/MyAI";
import Access from "@/pages/Access";
import AdminClients from "@/pages/AdminClients";
import AdminPackages from "@/pages/AdminPackages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TenantProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Integrador routes */}
            <Route path="/dashboard" element={<TenantGuard><Dashboard /></TenantGuard>} />
            <Route path="/conversations" element={<TenantGuard><Conversations /></TenantGuard>} />
            <Route path="/leads" element={<TenantGuard><Leads /></TenantGuard>} />
            <Route path="/reports" element={<TenantGuard><Reports /></TenantGuard>} />
            <Route path="/my-ai" element={<TenantGuard><MyAI /></TenantGuard>} />
            <Route path="/access" element={<TenantGuard><Access /></TenantGuard>} />
            <Route path="/help" element={<TenantGuard><Dashboard /></TenantGuard>} />

            {/* Admin routes */}
            <Route path="/admin" element={<Navigate to="/admin/clients" replace />} />
            <Route path="/admin/clients" element={<TenantGuard><AdminGuard><AdminClients /></AdminGuard></TenantGuard>} />
            <Route path="/admin/packages" element={<TenantGuard><AdminGuard><AdminPackages /></AdminGuard></TenantGuard>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </TenantProvider>
  </QueryClientProvider>
);

export default App;
