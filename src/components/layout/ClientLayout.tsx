import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ShoppingBag, Utensils, Menu, X, ShoppingCart, LayoutDashboard, UserRound, LogOut, Phone, Mail, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { siteConfig } from "@/lib/site";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const initials = (name?: string | null) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "VE";

export function ClientLayout({ children }: ClientLayoutProps) {
  const { isAuthenticated, profile, signOut, isStaff } = useAuth();
  const { totalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({ title: "Signed out", description: "You have been signed out." });
      navigate("/");
    } catch {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    }
  };

  const mobileLinks = [
    { to: "/", label: "Home" },
    { to: "/fashion-portfolio", label: "Fashion Portfolio" },
    { to: "/fashion-collections", label: "Collections" },
    { to: "/fashion-custom-orders", label: "Custom Orders" },
    { to: "/food-menu", label: "Bole Menu" },
    { to: "/food-order", label: "Order Food" },
    { to: "/food-specials", label: "Special Offers" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only-focusable z-50 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto flex h-16 items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2" aria-label="Vachoma Empire home">
            <div className="rounded-full bg-primary p-2" aria-hidden="true">
              <span className="text-sm font-bold text-white">VE</span>
            </div>
            <span className="hidden font-bold sm:inline-block">Vachoma Empire</span>
          </Link>

          {/* Desktop navigation */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/" className={cn(navigationMenuTriggerStyle(), location.pathname === "/" && "text-primary")}>
                    Home
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Fashion</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/fashion-portfolio"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <ShoppingBag className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">Fashion Portfolio</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore our latest designs and fashion collections
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/fashion-custom-orders"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Custom Orders</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Request a custom design tailored to your needs
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/fashion-collections"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Collections</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Browse our seasonal and themed collections
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Food</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/food-menu"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Utensils className="h-6 w-6" />
                          <div className="mb-2 mt-4 text-lg font-medium">Bole Menu</div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Explore our delicious Bole dishes and place an order
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/food-order"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Order Now</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Place an order for pickup or delivery
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/food-specials"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Special Offers</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Check out our special deals and promotions
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/about" className={cn(navigationMenuTriggerStyle(), location.pathname === "/about" && "text-primary")}>
                    About
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/contact" className={cn(navigationMenuTriggerStyle(), location.pathname === "/contact" && "text-primary")}>
                    Contact
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-2">
            <Link to="/food-order" aria-label={`Food cart, ${totalItems} items`}>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[11px]">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="Account menu">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? "Account"} />
                      <AvatarFallback>{initials(profile?.full_name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium leading-none">{profile?.full_name ?? "My account"}</p>
                    <p className="mt-1 text-xs leading-none text-muted-foreground">{profile?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {isStaff ? (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex w-full items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Staff Dashboard
                      </Link>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem asChild>
                      <Link to="/client/dashboard" className="flex w-full items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" /> My Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/client/profile" className="flex w-full items-center gap-2">
                      <UserRound className="h-4 w-4" /> Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2">
                    <LogOut className="h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login">
                  <Button variant="outline" size="sm">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile navigation panel */}
        {mobileOpen && (
          <nav className="border-t bg-background lg:hidden" aria-label="Mobile">
            <ul className="container mx-auto space-y-1 py-4">
              {mobileLinks.map((link) => (
                <li key={link.to + link.label}>
                  <NavLink
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                        isActive && "bg-accent text-accent-foreground"
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
              {!isAuthenticated && (
                <li className="flex gap-2 px-3 pt-2 sm:hidden">
                  <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button size="sm" className="w-full">Sign up</Button>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}
      </header>

      <main id="main-content" className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-background">
        <div className="container mx-auto py-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary p-2" aria-hidden="true">
                  <span className="text-sm font-bold text-white">VE</span>
                </div>
                <h2 className="text-lg font-semibold">Vachoma Empire</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{siteConfig.tagline}.</p>
            </div>
            <nav aria-label="Footer">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">Explore</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/fashion-portfolio" className="hover:text-foreground">Fashion Portfolio</Link></li>
                <li><Link to="/fashion-custom-orders" className="hover:text-foreground">Custom Orders</Link></li>
                <li><Link to="/food-menu" className="hover:text-foreground">Bole Menu</Link></li>
                <li><Link to="/food-specials" className="hover:text-foreground">Special Offers</Link></li>
                <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
              </ul>
            </nav>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">Contact</h2>
              <address className="space-y-2 text-sm not-italic text-muted-foreground">
                <p className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {siteConfig.contact.address}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" />
                  <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-foreground">
                    {siteConfig.contact.email}
                  </a>
                </p>
                {siteConfig.contact.phoneDisplay && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a href={`tel:${siteConfig.contact.phoneDisplay}`} className="hover:text-foreground">
                      {siteConfig.contact.phoneDisplay}
                    </a>
                  </p>
                )}
              </address>
            </div>
            <div>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider">Hours</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {siteConfig.contact.hours.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0" /> {h}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-4 text-sm">
                <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">Instagram</a>
                <a href={siteConfig.social.facebook} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">Facebook</a>
                <a href={siteConfig.social.tiktok} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">TikTok</a>
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t pt-4 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
            <p>© {new Date().getFullYear()} Vachoma Empire. All rights reserved.</p>
            <Link to="/admin" className="hover:text-foreground">Staff login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
