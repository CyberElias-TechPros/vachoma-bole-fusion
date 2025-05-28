
import { useState, useEffect } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  ShoppingBag, 
  Utensils, 
  Calendar, 
  Star, 
  Eye, 
  Package,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

const ClientDashboard = () => {
  const { profile, user } = useAuth();
  const [customOrders, setCustomOrders] = useState<any[]>([]);
  const [foodOrders, setFoodOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch custom fashion orders
      const { data: customData, error: customError } = await supabase
        .from('custom_order_submissions')
        .select('*')
        .eq('email', user?.email)
        .order('created_at', { ascending: false });

      if (customError) throw customError;
      setCustomOrders(customData || []);

      // Fetch food orders (if customer has placed any with their profile)
      const { data: foodData, error: foodError } = await supabase
        .from('food_orders')
        .select(`
          *,
          food_order_items (*)
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (foodError && foodError.code !== 'PGRST116') {
        console.error('Error fetching food orders:', foodError);
      }
      setFoodOrders(foodData || []);

    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'rejected':
      case 'cancelled':
        return 'destructive';
      case 'in-progress':
      case 'preparing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      case 'in-progress':
      case 'preparing':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <ClientLayout>
        <div className="container py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {profile?.full_name || 'Valued Customer'}!
          </h1>
          <p className="text-muted-foreground">
            Manage your orders, track deliveries, and explore our services.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fashion Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {customOrders.filter(order => ['submitted', 'accepted', 'in-progress'].includes(order.status)).length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Food Orders</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{foodOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                {foodOrders.filter(order => ['pending', 'preparing', 'ready-for-pickup'].includes(order.status)).length} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦{(
                  customOrders.reduce((sum, order) => sum + order.budget, 0) +
                  foodOrders.reduce((sum, order) => sum + order.total_amount, 0)
                ).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fashion">Fashion Orders</TabsTrigger>
            <TabsTrigger value="food">Food Orders</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest orders and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...customOrders, ...foodOrders]
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5)
                    .map((order, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium">
                              {'order_type' in order ? 'Custom Fashion Order' : 'Food Order'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {'order_type' in order 
                                ? `${order.order_type} - ₦${order.budget.toLocaleString()}`
                                : `${order.customer_name} - ₦${order.total_amount.toLocaleString()}`
                              }
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(order.status)}>
                            {order.status.replace('-', ' ')}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                
                {customOrders.length === 0 && foodOrders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <div className="flex gap-4 justify-center">
                      <Link to="/fashion-custom-orders">
                        <Button>Order Custom Fashion</Button>
                      </Link>
                      <Link to="/food-order">
                        <Button variant="outline">Order Food</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Explore our services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Link to="/fashion-custom-orders">
                    <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                      <ShoppingBag className="h-6 w-6" />
                      <span>Custom Fashion</span>
                    </Button>
                  </Link>
                  <Link to="/fashion-portfolio">
                    <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                      <Eye className="h-6 w-6" />
                      <span>View Portfolio</span>
                    </Button>
                  </Link>
                  <Link to="/food-order">
                    <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                      <Utensils className="h-6 w-6" />
                      <span>Order Food</span>
                    </Button>
                  </Link>
                  <Link to="/food-menu">
                    <Button className="w-full h-20 flex flex-col gap-2" variant="outline">
                      <Calendar className="h-6 w-6" />
                      <span>View Menu</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fashion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fashion Orders</CardTitle>
                <CardDescription>Track your custom fashion orders</CardDescription>
              </CardHeader>
              <CardContent>
                {customOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No fashion orders yet</p>
                    <Link to="/fashion-custom-orders">
                      <Button>Start Custom Order</Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Type</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Timeline</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {order.order_type === 'other' && order.other_order_type 
                                  ? order.other_order_type 
                                  : order.order_type}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {order.description}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>₦{order.budget.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.timeline}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(order.status)}>
                              {order.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="food" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Food Orders</CardTitle>
                <CardDescription>Track your food orders</CardDescription>
              </CardHeader>
              <CardContent>
                {foodOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No food orders yet</p>
                    <Link to="/food-order">
                      <Button>Place Food Order</Button>
                    </Link>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Details</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {foodOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.food_order_items?.length || 0} items
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {order.order_type.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>₦{order.total_amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(order.status)}>
                              {order.status.replace('-', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-muted-foreground">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{profile?.email || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-muted-foreground">{profile?.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Badge variant="outline">{profile?.role || 'customer'}</Badge>
                  </div>
                </div>
                <div className="pt-4">
                  <Link to="/client/profile">
                    <Button>Edit Profile</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
