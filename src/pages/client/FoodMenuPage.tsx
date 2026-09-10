import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenuItems } from "@/hooks/use-menu-items";
import { useCart } from "@/context/CartContext";
import { formatNGN } from "@/lib/site";
import { Search, ShoppingCart, ArrowRight, UtensilsCrossed } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FoodMenuPage = () => {
  const { menuItems, loading } = useMenuItems();
  const { addItem, updateQuantity, getQuantity, totalItems, subtotal } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    if (!menuItems.length) return [];
    return [...new Set(menuItems.map((item) => item.category))];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory && item.available;
    });
  }, [menuItems, searchTerm, selectedCategory]);

  const pretty = (s: string) => s.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  if (loading) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="space-y-3 p-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Seo
        title="Bole Menu"
        description="Explore the Vachoma Empire Bole menu — fire-roasted plantain, yam, sweet potatoes and smoked fish with signature palm-oil pepper sauce. Order online for pickup or delivery in Port Harcourt."
        path="/food-menu"
      />
      <div className="container py-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Bole kitchen</p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Our Menu</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Fire-roasted plantain, yam, sweet potatoes and smoked fish — served with our
            signature palm-oil pepper sauce.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search menu"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]" aria-label="Filter by category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {pretty(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {totalItems > 0 && (
          <Card className="mb-8 border-primary/30 bg-primary/10">
            <CardContent className="p-4">
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">
                    {totalItems} {totalItems === 1 ? "item" : "items"} · {formatNGN(subtotal)}
                  </span>
                </div>
                <Link to="/food-order">
                  <Button>
                    View Cart &amp; Checkout <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {categories.length > 0 && (
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
            <TabsList className="flex h-auto flex-wrap justify-start gap-1">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {pretty(category)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => {
            const qty = getQuantity(item.id);
            return (
              <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                {item.image_url ? (
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-muted">
                    <UtensilsCrossed className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg leading-snug">{item.name}</CardTitle>
                    <Badge variant="outline" className="ml-2 shrink-0">
                      {pretty(item.category)}
                    </Badge>
                  </div>
                  {item.description && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">{item.description}</p>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatNGN(item.price)}
                    </span>

                    {item.ingredients && item.ingredients.length > 0 && (
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">Ingredients:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.ingredients.slice(0, 3).map((ingredient, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                          {item.ingredients.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.ingredients.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {item.allergens && item.allergens.length > 0 && (
                      <div>
                        <p className="mb-1 text-xs text-muted-foreground">Allergens:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.allergens.map((allergen, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <div className="flex flex-1 items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, qty - 1)}
                            aria-label={`Remove one ${item.name}`}
                          >
                            −
                          </Button>
                          <span className="min-w-[2rem] text-center font-medium" aria-live="polite">
                            {qty}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.image_url })
                            }
                            aria-label={`Add one more ${item.name}`}
                          >
                            +
                          </Button>
                          <Link to="/food-order" className="ml-auto">
                            <Button size="sm">Checkout</Button>
                          </Link>
                        </div>
                      ) : (
                        <Button
                          className="flex-1"
                          onClick={() =>
                            addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.image_url })
                          }
                          disabled={!item.available}
                        >
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center">
            <h2 className="mb-2 text-lg font-medium">No dishes found</h2>
            <p className="mb-4 text-muted-foreground">
              {menuItems.length === 0
                ? "The menu is being updated — please check back shortly."
                : "Try adjusting your search terms or filters."}
            </p>
            {menuItems.length === 0 && (
              <Link to="/contact">
                <Button variant="outline">Ask Us What's Cooking</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default FoodMenuPage;
