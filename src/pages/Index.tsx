import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShoppingBag, Utensils, ShieldAlert } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Seo } from "@/components/Seo";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Staff entrance (/admin). Authenticates against Supabase and only admits
 * users whose profile role is admin, manager or staff. Everyone else is
 * signed straight back out with an explanatory message.
 */
const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signOut, isAuthenticated, isStaff, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in as staff? Skip the form.
  useEffect(() => {
    if (!authLoading && isAuthenticated && isStaff) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, isAuthenticated, isStaff, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const { success, error: signInError } = await signIn(email, password);
      if (!success) throw signInError;

      // The auth listener + profile fetch resolve asynchronously; poll briefly
      // for the profile role before deciding where this user may go.
      const role = await waitForStaffCheck();
      if (role !== "staff") {
        await signOut();
        setError(
          role === "customer"
            ? "This account is a customer account. Staff access requires an admin, manager or staff role."
            : "We couldn't verify your staff role. Please contact an administrator."
        );
        return;
      }

      toast({
        title: "Login successful",
        description: "Welcome to the Vachoma Empire management system.",
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);
      setError(err instanceof Error ? err.message : "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Staff Login"
        description="Staff sign-in for the Vachoma Empire business management system."
        path="/admin"
        indexable={false}
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10">
        <header className="container mx-auto p-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-2">
              <span className="text-white font-bold text-lg">VE</span>
            </div>
            <span className="text-xl font-bold">Vachoma Empire</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to website
          </Link>
        </header>

        <main className="flex-1 container mx-auto px-4 grid place-items-center">
          <div className="w-full max-w-5xl grid gap-8 md:grid-cols-2 items-center py-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">Staff only</p>
                <h1 className="text-4xl font-bold tracking-tight">Business Management System</h1>
                <p className="text-xl text-muted-foreground">
                  Manage fashion designs, custom orders, the Bole menu and food orders from one place.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Fashion Design</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Design portfolio, collections, custom-order requests and customers.
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold">Bole Food</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Menu management, order processing and specials for the food business.
                  </p>
                </div>
              </div>
            </div>

            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Staff login</CardTitle>
                <CardDescription>
                  Sign in with your staff account to open the dashboard.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <ShieldAlert className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="username"
                      placeholder="staff@vachomaempire.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      "Log in"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Customer? <Link to="/login" className="text-primary hover:underline">Sign in here</Link> instead.
                  </p>
                </CardFooter>
              </form>
            </Card>
          </div>
        </main>

        <footer className="container mx-auto p-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Vachoma Empire. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

/**
 * After sign-in, the profile row loads asynchronously via the auth context.
 * Poll the Supabase session/profile directly for a few seconds so we can
 * route staff vs customers correctly without guessing.
 */
async function waitForStaffCheck(): Promise<"staff" | "customer" | "unknown"> {
  const deadline = Date.now() + 8000;

  while (Date.now() < deadline) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return "unknown";

    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      return data.role === "admin" || data.role === "manager" || data.role === "staff"
        ? "staff"
        : "customer";
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  return "unknown";
}

export default Index;
