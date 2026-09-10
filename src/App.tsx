import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";

// Route-level code splitting: each page becomes its own chunk so the initial
// download stays small. Layouts, context and UI primitives stay in the main chunk.
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const FashionDashboard = lazy(() => import("./pages/FashionDashboard"));
const FoodDashboard = lazy(() => import("./pages/FoodDashboard"));
const Customers = lazy(() => import("./pages/Customers"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Client-facing pages
const HomePage = lazy(() => import("./pages/client/HomePage"));
const AboutPage = lazy(() => import("./pages/client/AboutPage"));
const ContactPage = lazy(() => import("./pages/client/ContactPage"));
const LoginPage = lazy(() => import("./pages/client/LoginPage"));
const SignupPage = lazy(() => import("./pages/client/SignupPage"));
const ForgotPasswordPage = lazy(() => import("./pages/client/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/client/ResetPasswordPage"));
const ClientDashboard = lazy(() => import("./pages/client/ClientDashboard"));
const ProfileSettings = lazy(() => import("./pages/client/ProfileSettings"));
const FoodMenuPage = lazy(() => import("./pages/client/FoodMenuPage"));
const FashionPortfolioPage = lazy(() => import("./pages/client/FashionPortfolioPage"));
const FashionCollectionsPage = lazy(() => import("./pages/client/FashionCollectionsPage"));
const FashionCustomOrdersPage = lazy(() => import("./pages/client/FashionCustomOrdersPage"));
const FoodOrderPage = lazy(() => import("./pages/client/FoodOrderPage"));
const FoodSpecialsPage = lazy(() => import("./pages/client/FoodSpecialsPage"));
const Unauthorized = lazy(() => import("./pages/client/Unauthorized"));

// Context Providers
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center gap-2 text-muted-foreground">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span>Loading…</span>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Staff entrance */}
                <Route path="/admin" element={<Index />} />

                {/* Staff dashboards */}
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
                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
                      <AppLayout><Customers /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reports"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager"]}>
                      <AppLayout><Reports /></AppLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={["admin", "manager", "staff"]}>
                      <AppLayout><Settings /></AppLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Client-facing public pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
