
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Utensils, 
  Search, 
  Plus, 
  Edit, 
  Clock, 
  ShoppingCart, 
  Truck, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

export default function FoodDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - would be replaced by real data from database
  const menuItems = [
    { id: 1, name: "Classic Bole with Fish", category: "Main", price: 2500, available: true },
    { id: 2, name: "Special Bole with Yam", category: "Main", price: 3000, available: true },
    { id: 3, name: "Roasted Sweet Potatoes", category: "Side", price: 1500, available: true },
    { id: 4, name: "Palm Oil Gravy Sauce", category: "Sauce", price: 800, available: true },
    { id: 5, name: "Peppered Grilled Fish", category: "Protein", price: 2000, available: false },
  ];

  const pendingOrders = [
    { id: "BO-2345", customer: "Michael Obi", items: "2x Classic Bole with Fish", orderTime: "10:15 AM", status: "Preparing" },
    { id: "BO-2346", customer: "Chioma Eze", items: "1x Special Bole with Yam, 2x Palm Oil Gravy", orderTime: "10:32 AM", status: "Ready for Pickup" },
    { id: "BO-2347", customer: "Office Catering", items: "10x Classic Bole, 5x Sweet Potatoes", orderTime: "11:05 AM", status: "Out for Delivery" },
  ];

  const lowInventoryItems = [
    { name: "Fresh Plantains", quantity: "5 bunches", needed: "15 bunches" },
    { name: "Palm Oil", quantity: "2 liters", needed: "5 liters" },
  ];

  // Filter menu items based on search term
  const filteredMenu = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bole Food Business</h2>
        <div className="flex items-center gap-2">
          <Button>
            <ShoppingCart className="mr-2 h-4 w-4" /> New Order
          </Button>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Menu Item
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦42,750</div>
            <p className="text-xs text-muted-foreground">
              +8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              2 for delivery, 3 for pickup
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              En route to customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Ingredients</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Need urgent reordering
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Low Inventory Alert */}
      {lowInventoryItems.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Low Inventory Alert</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1">
              {lowInventoryItems.map((item, index) => (
                <li key={index}>{item.name} - Only {item.quantity} remaining (Need {item.needed})</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Menu Management Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Menu Management</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search menu..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="rounded-md border">
          <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/50 text-sm">
            <div>Item Name</div>
            <div>Category</div>
            <div>Price</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <div key={item.id} className="grid grid-cols-5 gap-4 p-4 border-b text-sm items-center">
                <div className="font-medium">{item.name}</div>
                <div>{item.category}</div>
                <div>₦{item.price.toLocaleString()}</div>
                <div>
                  {item.available ? (
                    <Badge variant="secondary" className="font-normal">Available</Badge>
                  ) : (
                    <Badge variant="destructive" className="font-normal">Unavailable</Badge>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" 
                    onClick={() => {}}>
                    {item.available ? "Mark Unavailable" : "Mark Available"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No menu items found</div>
          )}
        </div>
      </div>

      {/* Orders Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Pending Orders</h3>
          <Button variant="outline">
            View All Orders
          </Button>
        </div>
        
        <div className="grid gap-4">
          {pendingOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{order.items}</h4>
                    <Badge variant={
                      order.status === "Preparing" ? "default" :
                      order.status === "Ready for Pickup" ? "secondary" : 
                      "outline"
                    }>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Order #{order.id} • Customer: {order.customer} • Ordered at: {order.orderTime}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Clock className="mr-2 h-4 w-4" /> Update Status
                  </Button>
                  {order.status === "Ready for Pickup" && (
                    <Button size="sm">
                      Complete Order
                    </Button>
                  )}
                  {order.status === "Out for Delivery" && (
                    <Button size="sm">
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
