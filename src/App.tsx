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

// Client-facing pages
import HomePage from "./pages/client/HomePage";
import AboutPage from "./pages/client/AboutPage";
import ContactPage from "./pages/client/ContactPage";
import LoginPage from "./pages/client/LoginPage";
import SignupPage from "./pages/client/SignupPage";
import ClientDashboard from "./pages/client/ClientDashboard";
import ProfileSettings from "./pages/client/ProfileSettings";
import FoodMenuPage from "./pages/client/FoodMenuPage";
import FashionPortfolioPage from "./pages/client/FashionPortfolioPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Admin Login page */}
          <Route path="/admin" element={<Index />} />
          
          {/* Dashboard routes within the AppLayout */}
          <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/fashion" element={<AppLayout><FashionDashboard /></AppLayout>} />
          <Route path="/food" element={<AppLayout><FoodDashboard /></AppLayout>} />
          
          {/* Other potential admin routes */}
          <Route path="/customers" element={<AppLayout><div className="p-4">Customers page (To be implemented)</div></AppLayout>} />
          <Route path="/reports" element={<AppLayout><div className="p-4">Reports page (To be implemented)</div></AppLayout>} />
          <Route path="/settings" element={<AppLayout><div className="p-4">Settings page (To be implemented)</div></AppLayout>} />
          
          {/* Client-facing public pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/food-menu" element={<FoodMenuPage />} />
          <Route path="/fashion-portfolio" element={<FashionPortfolioPage />} />
          
          {/* Client authenticated pages */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/profile" element={<ProfileSettings />} />
          <Route path="/client/orders/:id" element={<ClientDashboard />} />
          <Route path="/client/fashion-orders" element={<ClientDashboard />} />
          <Route path="/client/food-orders" element={<ClientDashboard />} />
          
          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
