import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input-with-icon";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export interface AppLayoutProps {
  children: React.ReactNode;
}

const TITLES: Record<string, string> = {
  "/dashboard": "Overview Dashboard",
  "/fashion": "Fashion Design Business",
  "/food": "Bole Food Business",
  "/customers": "Customers",
  "/reports": "Reports",
  "/settings": "Settings",
};

const initials = (name?: string | null) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U";

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { profile, signOut } = useAuth();
  const [search, setSearch] = useState("");

  const activePath = location.pathname;
  const title = TITLES[activePath] ?? "Vachoma Empire";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(search.trim() ? `/customers?q=${encodeURIComponent(search.trim())}` : "/customers");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
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
                  <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
                    VE
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Vachoma Empire</span>
                  <span className="text-xs text-muted-foreground">Business Management</span>
                </div>
              </div>
            </div>
            <div className="px-2 pt-2 pb-1">
              <form onSubmit={handleSearch} role="search">
                <Input
                  placeholder="Search customers…"
                  className="h-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startIcon={<Search className="h-4 w-4" />}
                  aria-label="Search customers"
                />
              </form>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activePath === "/dashboard"}
                    onClick={() => navigate("/dashboard")}
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
                    isActive={activePath === "/fashion"}
                    onClick={() => navigate("/fashion")}
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
                    isActive={activePath === "/food"}
                    onClick={() => navigate("/food")}
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
                  <SidebarMenuButton
                    isActive={activePath === "/customers"}
                    onClick={() => navigate("/customers")}
                  >
                    <Users />
                    <span>Customers</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activePath === "/reports"}
                    onClick={() => navigate("/reports")}
                  >
                    <FileText />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={activePath === "/settings"}
                    onClick={() => navigate("/settings")}
                  >
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
                  <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name || "User"} />
                  <AvatarFallback>{initials(profile?.full_name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email || ""}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Log out">
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
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            {profile && (
              <div className="flex items-center gap-2">
                <span className="hidden text-sm text-muted-foreground sm:inline">Welcome,</span>
                <span className="hidden text-sm font-medium sm:inline">{profile.full_name}</span>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar_url ?? undefined} alt={profile.full_name || "User"} />
                  <AvatarFallback>{initials(profile.full_name)}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <div className="container mx-auto p-4">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
