
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientLayout } from "@/components/layout/ClientLayout";

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: { name: string; quantity: number }[];
  type: "fashion" | "food";
}

// Sample data for demonstration
const sampleOrders: Order[] = [
  {
    id: "ORD-123456",
    date: "2025-04-30",
    status: "delivered",
    total: 25000,
    items: [{ name: "Traditional Attire", quantity: 1 }],
    type: "fashion"
  },
  {
    id: "ORD-123457",
    date: "2025-05-05",
    status: "in-progress",
    total: 35000,
    items: [{ name: "Wedding Outfit", quantity: 1 }],
    type: "fashion"
  },
  {
    id: "ORD-123458",
    date: "2025-05-10",
    status: "pending",
    total: 3500,
    items: [
      { name: "Bole with Fish", quantity: 2 },
      { name: "Roasted Yam", quantity: 1 }
    ],
    type: "food"
  }
];

const ClientDashboard = () => {
  const [orders] = useState<Order[]>(sampleOrders);
  
  // Filter orders by type
  const fashionOrders = orders.filter((order) => order.type === "fashion");
  const foodOrders = orders.filter((order) => order.type === "food");
  
  return (
    <ClientLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your orders and account details.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>John Doe</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>john.doe@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>+234 123 456 7890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span>January 2025</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/client/profile" className="w-full">
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fashion Orders</CardTitle>
              <CardDescription>Your fashion design orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-3xl font-bold">{fashionOrders.length}</div>
              <div className="mt-2 text-center text-sm text-muted-foreground">Total Orders</div>
            </CardContent>
            <CardFooter>
              <Link to="/client/fashion-orders" className="w-full">
                <Button variant="outline" className="w-full">View All Fashion Orders</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Food Orders</CardTitle>
              <CardDescription>Your Bole food orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-3xl font-bold">{foodOrders.length}</div>
              <div className="mt-2 text-center text-sm text-muted-foreground">Total Orders</div>
            </CardContent>
            <CardFooter>
              <Link to="/client/food-orders" className="w-full">
                <Button variant="outline" className="w-full">View All Food Orders</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8">
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="fashion">Fashion Orders</TabsTrigger>
              <TabsTrigger value="food">Food Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Your latest orders across all services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <div key={order.id} className="rounded-lg border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-semibold">Order #{order.id}</span>
                              <div className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-amber-100 text-amber-800'}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="font-medium">
                              ₦{order.total.toLocaleString()}
                            </div>
                            <div className="w-full">
                              <div className="text-xs text-muted-foreground">
                                {order.items.map((item, i) => (
                                  <span key={i}>
                                    {item.quantity}x {item.name}
                                    {i < order.items.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Link to={`/client/orders/${order.id}`}>
                              <Button variant="link" size="sm" className="h-auto p-0">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You have no orders yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="fashion">
              <Card>
                <CardHeader>
                  <CardTitle>Fashion Orders</CardTitle>
                  <CardDescription>Your fashion design orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fashionOrders.length > 0 ? (
                      fashionOrders.map((order) => (
                        <div key={order.id} className="rounded-lg border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-semibold">Order #{order.id}</span>
                              <div className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-amber-100 text-amber-800'}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="font-medium">
                              ₦{order.total.toLocaleString()}
                            </div>
                            <div className="w-full">
                              <div className="text-xs text-muted-foreground">
                                {order.items.map((item, i) => (
                                  <span key={i}>
                                    {item.quantity}x {item.name}
                                    {i < order.items.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Link to={`/client/orders/${order.id}`}>
                              <Button variant="link" size="sm" className="h-auto p-0">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You have no fashion orders yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="food">
              <Card>
                <CardHeader>
                  <CardTitle>Food Orders</CardTitle>
                  <CardDescription>Your Bole food orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {foodOrders.length > 0 ? (
                      foodOrders.map((order) => (
                        <div key={order.id} className="rounded-lg border p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-semibold">Order #{order.id}</span>
                              <div className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString()}
                              </div>
                            </div>
                            <div>
                              <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                  order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                  'bg-amber-100 text-amber-800'}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </div>
                            <div className="font-medium">
                              ₦{order.total.toLocaleString()}
                            </div>
                            <div className="w-full">
                              <div className="text-xs text-muted-foreground">
                                {order.items.map((item, i) => (
                                  <span key={i}>
                                    {item.quantity}x {item.name}
                                    {i < order.items.length - 1 ? ', ' : ''}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2">
                            <Link to={`/client/orders/${order.id}`}>
                              <Button variant="link" size="sm" className="h-auto p-0">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">You have no food orders yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
