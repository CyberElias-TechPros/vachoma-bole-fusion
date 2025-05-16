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
import FashionCollectionsPage from "./pages/client/FashionCollectionsPage";
import FashionCustomOrdersPage from "./pages/client/FashionCustomOrdersPage";
import FoodOrderPage from "./pages/client/FoodOrderPage";
import FoodSpecialsPage from "./pages/client/FoodSpecialsPage";
import Unauthorized from "./pages/client/Unauthorized";

// Context Providers
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Admin Login page */}
            <Route path="/admin" element={<Index />} />
            
            {/* Dashboard routes within the AppLayout - Protected for admin users */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin", "manager"]}>
                  <AppLayout><Dashboard /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/fashion"
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
                  <AppLayout><FashionDashboard /></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/food"
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
                  <AppLayout><FoodDashboard /></AppLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Other potential admin routes */}
            <Route
              path="/customers"
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
                  <AppLayout><div className="p-4">Customers page (To be implemented)</div></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={["admin", "manager"]}>
                  <AppLayout><div className="p-4">Reports page (To be implemented)</div></AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AppLayout><div className="p-4">Settings page (To be implemented)</div></AppLayout>
                </ProtectedRoute>
              }
            />
            
            {/* Client-facing public pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/food-menu" element={<FoodMenuPage />} />
            <Route path="/fashion-portfolio" element={<FashionPortfolioPage />} />
            <Route path="/fashion-collections" element={<FashionCollectionsPage />} />
            <Route path="/fashion-custom-orders" element={<FashionCustomOrdersPage />} />
            <Route path="/food-order" element={<FoodOrderPage />} />
            <Route path="/food-specials" element={<FoodSpecialsPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Client authenticated pages */}
            <Route
              path="/client/dashboard"
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/profile"
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/orders/:id"
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/fashion-orders"
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/food-orders"
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Catch-all route for 404 errors */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
