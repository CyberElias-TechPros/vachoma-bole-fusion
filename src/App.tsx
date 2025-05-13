import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import FashionDashboard from "./pages/FashionDashboard";
import FoodDashboard from "./pages/FoodDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing/Login page */}
          <Route path="/" element={<Index />} />
          
          {/* Dashboard routes within the AppLayout */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/fashion" element={<AppLayout><FashionDashboard /></AppLayout>} />
          <Route path="/food" element={<AppLayout><FoodDashboard /></AppLayout>} />
          
          {/* Other potential routes */}
          <Route path="/customers" element={<AppLayout><div className="p-4">Customers page (To be implemented)</div></AppLayout>} />
          <Route path="/reports" element={<AppLayout><div className="p-4">Reports page (To be implemented)</div></AppLayout>} />
          <Route path="/settings" element={<AppLayout><div className="p-4">Settings page (To be implemented)</div></AppLayout>} />
          
          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
