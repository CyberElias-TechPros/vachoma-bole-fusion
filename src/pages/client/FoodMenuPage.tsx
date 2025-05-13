
import { useState } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, ShoppingCart } from "lucide-react";

// Define menu item interface
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
}

// Sample menu data
const menuItems: MenuItem[] = [
  {
    id: "item-1",
    name: "Classic Bole with Fish",
    description: "Roasted plantain served with fresh grilled fish and our signature spicy sauce",
    price: 1500,
    category: "classics"
  },
  {
    id: "item-2",
    name: "Roasted Sweet Potatoes",
    description: "Perfectly roasted sweet potatoes with our special palm oil gravy sauce",
    price: 1200,
    category: "classics"
  },
  {
    id: "item-3",
    name: "Roasted Yam with Sauce",
    description: "Tender roasted yam pieces served with our special palm oil gravy sauce",
    price: 1300,
    category: "classics"
  },
  {
    id: "item-4",
    name: "Super Combo",
    description: "A delicious combination of bole, fish, sweet potatoes and yam with extra sauce",
    price: 2500,
    category: "combos"
  },
  {
    id: "item-5",
    name: "Family Pack",
    description: "Large serving of bole, fish, and sides - enough for 3-4 people",
    price: 4500,
    category: "combos"
  },
  {
    id: "item-6",
    name: "Extra Spicy Sauce",
    description: "Our signature palm oil gravy sauce with extra heat",
    price: 500,
    category: "extras"
  },
  {
    id: "item-7",
    name: "Soft Drink",
    description: "Selection of chilled soft drinks",
    price: 300,
    category: "extras"
  }
];

// Interface for cart items
interface CartItem {
  item: MenuItem;
  quantity: number;
}

const FoodMenuPage = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.item.id === item.id);
      
      if (existingItem) {
        return currentCart.map(cartItem => 
          cartItem.item.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...currentCart, { item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Item added",
      description: `${item.name} added to your cart`,
    });
  };
  
  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.item.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return currentCart.map(cartItem => 
          cartItem.item.id === itemId 
            ? { ...cartItem, quantity: cartItem.quantity - 1 } 
            : cartItem
        );
      } else {
        return currentCart.filter(cartItem => cartItem.item.id !== itemId);
      }
    });
  };
  
  // Calculate total quantity of items in cart
  const cartQuantity = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Calculate total price of items in cart
  const cartTotal = cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  
  // Filter menu items by category
  const classicItems = menuItems.filter(item => item.category === "classics");
  const comboItems = menuItems.filter(item => item.category === "combos");
  const extraItems = menuItems.filter(item => item.category === "extras");

  return (
    <ClientLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold">Bole Food Menu</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our delicious selection of traditional Bole dishes and place your order online
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Tabs defaultValue="classics">
              <TabsList className="mb-6">
                <TabsTrigger value="classics">Classics</TabsTrigger>
                <TabsTrigger value="combos">Combo Deals</TabsTrigger>
                <TabsTrigger value="extras">Extras</TabsTrigger>
              </TabsList>
              
              <TabsContent value="classics" className="space-y-6">
                <h2 className="text-2xl font-semibold">Classic Dishes</h2>
                <div className="grid gap-4">
                  {classicItems.map(item => (
                    <Card key={item.id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="aspect-video w-full bg-muted md:h-auto md:w-1/3"></div>
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex justify-between">
                            <h3 className="font-semibold">{item.name}</h3>
                            <span className="font-medium">₦{item.price.toLocaleString()}</span>
                          </div>
                          <p className="flex-1 text-sm text-muted-foreground">{item.description}</p>
                          <div className="mt-4">
                            <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="combos" className="space-y-6">
                <h2 className="text-2xl font-semibold">Combo Deals</h2>
                <div className="grid gap-4">
                  {comboItems.map(item => (
                    <Card key={item.id}>
                      <div className="flex flex-col md:flex-row">
                        <div className="aspect-video w-full bg-muted md:h-auto md:w-1/3"></div>
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex justify-between">
                            <h3 className="font-semibold">{item.name}</h3>
                            <span className="font-medium">₦{item.price.toLocaleString()}</span>
                          </div>
                          <p className="flex-1 text-sm text-muted-foreground">{item.description}</p>
                          <div className="mt-4">
                            <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="extras" className="space-y-6">
                <h2 className="text-2xl font-semibold">Extras</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {extraItems.map(item => (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="aspect-video bg-muted"></div>
                      <CardContent className="p-4">
                        <div className="flex justify-between">
                          <h3 className="font-semibold">{item.name}</h3>
                          <span className="font-medium">₦{item.price.toLocaleString()}</span>
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button onClick={() => addToCart(item)}>Add to Cart</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Your Cart</h3>
                  <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                    {cartQuantity} items
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="px-4">
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((cartItem) => (
                      <div key={cartItem.item.id} className="flex items-center justify-between border-b pb-3">
                        <div className="flex-1">
                          <p className="font-medium">{cartItem.item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ₦{cartItem.item.price.toLocaleString()} x {cartItem.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => removeFromCart(cartItem.item.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center">{cartItem.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => addToCart(cartItem.item)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between border-t pt-4">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">₦{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <ShoppingCart className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Your cart is empty</p>
                    <p className="text-xs text-muted-foreground">Add items to get started</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="p-4">
                <Button className="w-full" disabled={cart.length === 0}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="mb-2 font-semibold">Delivery Information</h3>
                <p className="text-sm text-muted-foreground">
                  We deliver throughout Port Harcourt city.
                </p>
                <p className="text-sm text-muted-foreground">
                  Delivery fee: ₦500 - ₦1,500 depending on location.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Estimated delivery time: 45-60 minutes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default FoodMenuPage;
