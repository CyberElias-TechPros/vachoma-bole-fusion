
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Utensils } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - in a real app, this would authenticate against a backend
    setTimeout(() => {
      setIsLoading(false);
      if (email && password) {
        toast({
          title: "Login successful",
          description: "Welcome to Vachoma Empire Management System",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "Please enter your email and password",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10">
      <header className="container mx-auto p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-2">
            <span className="text-white font-bold text-lg">VE</span>
          </div>
          <h1 className="text-xl font-bold">Vachoma Empire</h1>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 grid place-items-center">
        <div className="w-full max-w-5xl grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Vachoma Empire</h1>
              <h2 className="text-3xl font-semibold">Business Management System</h2>
              <p className="text-xl text-muted-foreground">
                Manage your fashion design and Bole food businesses efficiently from one platform
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Fashion Design</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Design tracking, inventory management, and customer orders for your fashion business
                </p>
              </div>
              
              <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Bole Food</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Menu management, order processing, and ingredient tracking for your food business
                </p>
              </div>
            </div>
          </div>
          
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Access your Vachoma Empire management dashboard
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@vachomaempire.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button type="button" variant="link" className="p-0 h-auto text-xs">
                      Forgot password?
                    </Button>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log in"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      
      <footer className="container mx-auto p-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Vachoma Empire. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
