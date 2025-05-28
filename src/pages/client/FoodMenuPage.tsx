
import { useState, useMemo } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenuItems } from "@/hooks/use-menu-items";
import { Search, ShoppingCart, Star, Clock, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const FoodMenuPage = () => {
  const { menuItems, loading } = useMenuItems();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<Array<{ id: string; quantity: number }>>([]);

  const categories = useMemo(() => {
    if (!menuItems.length) return [];
    const uniqueCategories = [...new Set(menuItems.map(item => item.category))];
    return uniqueCategories;
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory && item.available;
    });
  }, [menuItems, searchTerm, selectedCategory]);

  const addToCart = (itemId: string) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      if (existingItem) {
        return prev.map(item => 
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: itemId, quantity: 1 }];
    });
  };

  const getCartItemCount = (itemId: string) => {
    return cart.find(item => item.id === itemId)?.quantity || 0;
  };

  const getTotalCartItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="space-y-6">
            <Skeleton className="h-12 w-64" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4 space-y-3">
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
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Menu</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our delicious selection of traditional and modern Nigerian dishes, 
            prepared with the finest ingredients and authentic flavors.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for dishes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cart Summary */}
        {getTotalCartItems() > 0 && (
          <Card className="mb-8 bg-primary/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">{getTotalCartItems()} items in cart</span>
                </div>
                <Button>View Cart & Checkout</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Categories */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.slice(0, 5).map(category => (
              <TabsTrigger key={category} value={category}>
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {item.image_url && (
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={item.image_url} 
                    alt={item.name}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                  {!item.available && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="secondary">Unavailable</Badge>
                    </div>
                  )}
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{item.name}</CardTitle>
                  <Badge variant="outline" className="ml-2">
                    {item.category.replace('-', ' ')}
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.description}
                  </p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {/* Price and Rating */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ₦{item.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">4.5</span>
                    </div>
                  </div>

                  {/* Ingredients */}
                  {item.ingredients && item.ingredients.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Ingredients:</p>
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

                  {/* Allergens */}
                  {item.allergens && item.allergens.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Allergens:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.allergens.map((allergen, index) => (
                          <Badge key={index} variant="destructive" className="text-xs">
                            {allergen}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {getCartItemCount(item.id) > 0 ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setCart(prev => 
                            prev.map(cartItem => 
                              cartItem.id === item.id 
                                ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
                                : cartItem
                            ).filter(cartItem => cartItem.quantity > 0)
                          )}
                        >
                          -
                        </Button>
                        <span className="min-w-[2rem] text-center">{getCartItemCount(item.id)}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => addToCart(item.id)}
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="flex-1" 
                        onClick={() => addToCart(item.id)}
                        disabled={!item.available}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>15-20 min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>Serves 1-2</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </ClientLayout>
  );
};

export default FoodMenuPage;
