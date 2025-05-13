
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  ShoppingBag, 
  Utensils, 
  Users, 
  FileText, 
  Settings, 
  Menu, 
  LogOut, 
  Search 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

type BusinessType = "fashion" | "food" | "overview";

export interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeBusiness, setActiveBusiness] = useState<BusinessType>("overview");

  const switchBusiness = (business: BusinessType) => {
    setActiveBusiness(business);
    toast({
      title: `Switched to ${business === "overview" ? "Overview" : business === "fashion" ? "Fashion Design" : "Bole Food"} Dashboard`,
      description: `You are now viewing the ${business === "overview" ? "Overview" : business === "fashion" ? "Fashion Design" : "Bole Food"} section`,
    });
    
    // Navigate to the appropriate dashboard based on the selected business
    if (business === "overview") {
      navigate("/dashboard");
    } else if (business === "fashion") {
      navigate("/fashion");
    } else if (business === "food") {
      navigate("/food");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center p-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/logo.png" alt="Vachoma Empire" />
                  <AvatarFallback>VE</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Vachoma Empire</span>
                  <span className="text-xs text-muted-foreground">Business Management</span>
                </div>
              </div>
            </div>
            <div className="px-2 pt-2 pb-1">
              <Input 
                placeholder="Search..." 
                className="h-8"
                startIcon={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeBusiness === "overview"}
                    onClick={() => switchBusiness("overview")}
                  >
                    <Home />
                    <span>Overview Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Fashion Design Business</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeBusiness === "fashion"}
                    onClick={() => switchBusiness("fashion")}
                  >
                    <ShoppingBag />
                    <span>Fashion Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Bole Food Business</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeBusiness === "food"}
                    onClick={() => switchBusiness("food")}
                  >
                    <Utensils />
                    <span>Food Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator />

            <SidebarGroup>
              <SidebarGroupLabel>Management</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/customers")}>
                    <Users />
                    <span>Customers</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/reports")}>
                    <FileText />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => navigate("/settings")}>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="Admin User" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@vachomaempire.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => toast({ title: "Logged out", description: "You have been logged out of the system" })}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
            <SidebarTrigger>
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">
                {activeBusiness === "overview" ? "Overview Dashboard" : 
                 activeBusiness === "fashion" ? "Fashion Design Business" : 
                 "Bole Food Business"}
              </h1>
            </div>
          </div>
          <div className="container mx-auto p-4">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
