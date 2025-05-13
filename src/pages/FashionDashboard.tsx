
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Pencil, 
  Scissors, 
  TrendingUp, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import { useState } from "react";

export default function FashionDashboard() {
  const [searchTerm, setSearchTerm] = useState("");

  // Sample data - would come from real database in production
  const inventoryItems = [
    { id: 1, name: "Ankara Fabric", type: "Fabric", quantity: 15, unit: "yards", reorderPoint: 10 },
    { id: 2, name: "Lace Fabric", type: "Fabric", quantity: 8, unit: "yards", reorderPoint: 10 },
    { id: 3, name: "Gold Buttons", type: "Accessory", quantity: 120, unit: "pieces", reorderPoint: 50 },
    { id: 4, name: "Silver Zippers", type: "Accessory", quantity: 35, unit: "pieces", reorderPoint: 20 },
    { id: 5, name: "Embroidery Thread", type: "Thread", quantity: 42, unit: "spools", reorderPoint: 15 },
  ];

  const pendingOrders = [
    { id: "FO-1234", customer: "Ada Johnson", item: "Wedding Gown", dueDate: "2023-06-25", status: "In Progress" },
    { id: "FO-1235", customer: "TechCorp Ltd", item: "Corporate Uniforms (25 pieces)", dueDate: "2023-07-10", status: "Pattern Making" },
    { id: "FO-1236", customer: "Emmanuel Okon", item: "Traditional Attire", dueDate: "2023-06-18", status: "Cutting" },
  ];

  // Filter inventory items based on search term
  const filteredInventory = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Fashion Design Business</h2>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Design
          </Button>
          <Button variant="outline">
            <ShoppingBag className="mr-2 h-4 w-4" /> Create Order
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦428,500</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 due this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Inventory Items</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              Need reordering soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Inventory Management</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search inventory..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <div className="grid grid-cols-5 gap-4 p-4 font-medium border-b bg-muted/50 text-sm">
            <div>Item Name</div>
            <div>Type</div>
            <div>Quantity</div>
            <div>Status</div>
            <div className="text-right">Actions</div>
          </div>
          {filteredInventory.length > 0 ? (
            filteredInventory.map((item) => (
              <div key={item.id} className="grid grid-cols-5 gap-4 p-4 border-b text-sm items-center">
                <div className="font-medium">{item.name}</div>
                <div>{item.type}</div>
                <div>{item.quantity} {item.unit}</div>
                <div>
                  {item.quantity <= item.reorderPoint ? (
                    <Badge variant="destructive" className="font-normal">Low Stock</Badge>
                  ) : (
                    <Badge variant="secondary" className="font-normal">In Stock</Badge>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">No inventory items found</div>
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
                    <h4 className="font-medium">{order.item}</h4>
                    <Badge>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Order #{order.id} • Customer: {order.customer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">Due Date</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Scissors className="mr-2 h-4 w-4" /> Update Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Design Tools Integration Alert */}
      <Alert className="border-2 border-dashed border-primary/50">
        <AlertTitle className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Design Tools Integration
        </AlertTitle>
        <AlertDescription>
          Connect with your design software (Clo3D, Adobe Illustrator) to streamline your workflow.
          <Button variant="link" className="p-0 h-auto text-primary">Configure Integration</Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
