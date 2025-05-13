
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Utensils, TrendingUp, Users, AlertCircle } from "lucide-react";

export default function Dashboard() {
  // These would be populated with real data from your backend in a production environment
  const stats = {
    fashionSales: 428500,
    fashionOrders: 124,
    foodSales: 315750,
    foodOrders: 287,
    totalCustomers: 432,
    growthRate: 18.5,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Vachoma Empire Dashboard</h2>
        <Badge variant="outline" className="px-3 py-1">
          <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
          {stats.growthRate}% Growth
        </Badge>
      </div>
      
      <Alert className="bg-yellow-50 dark:bg-yellow-900/20">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Upcoming Events</AlertTitle>
        <AlertDescription>
          Fashion showcase on June 15th and Food festival participation on June 22nd
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fashion Revenue</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.fashionSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fashion Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fashionOrders}</div>
            <p className="text-xs text-muted-foreground">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Revenue</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.foodSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Orders</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.foodOrders}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Business Performance</CardTitle>
            <CardDescription>Monthly performance comparison between businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
              {/* In a real app, this would be a chart component using Recharts */}
              <p className="text-muted-foreground">Performance chart will appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Customer Overview</CardTitle>
            <CardDescription>Total customers: {stats.totalCustomers}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Fashion Customers</span>
                    <span className="text-sm font-semibold">65%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary rounded-full h-2" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Food Customers</span>
                    <span className="text-sm font-semibold">45%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-secondary rounded-full h-2" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Shared Customers</span>
                    <span className="text-sm font-semibold">10%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 rounded-full h-2" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">New Customers This Month</p>
                  <p className="text-2xl font-bold">42</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Customer Retention</p>
                  <p className="text-2xl font-bold">87%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Fashion Activities</CardTitle>
            <CardDescription>Latest orders and inventory updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">New Custom Design Order</p>
                  <p className="text-sm text-muted-foreground">Wedding gown design for Ada Johnson</p>
                </div>
                <Badge>New Order</Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Fabric Inventory Alert</p>
                  <p className="text-sm text-muted-foreground">Ankara fabric running low (2m remaining)</p>
                </div>
                <Badge variant="destructive">Low Stock</Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Design Approved</p>
                  <p className="text-sm text-muted-foreground">Corporate uniform design for TechCorp</p>
                </div>
                <Badge variant="secondary">Approved</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Food Activities</CardTitle>
            <CardDescription>Latest orders and inventory updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Large Catering Order</p>
                  <p className="text-sm text-muted-foreground">Corporate event for Oil & Gas company</p>
                </div>
                <Badge>New Order</Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Ingredient Alert</p>
                  <p className="text-sm text-muted-foreground">Fresh plantains need reordering</p>
                </div>
                <Badge variant="destructive">Reorder</Badge>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">Menu Update</p>
                  <p className="text-sm text-muted-foreground">New fish recipe added to menu</p>
                </div>
                <Badge variant="secondary">Updated</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
