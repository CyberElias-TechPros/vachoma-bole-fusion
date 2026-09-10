
import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMenuItems } from "@/hooks/use-menu-items";
import type { MenuItem } from "@/hooks/use-menu-items";
import { useFoodOrders } from "@/hooks/use-food-orders";
import { MenuItemForm } from "@/components/admin/MenuItemForm";
import type { MenuItemPayload } from "@/components/admin/MenuItemForm";
import { Plus, Utensils, ShoppingCart, TrendingUp, DollarSign, Edit2, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatNGN } from "@/lib/site";

const FoodDashboard = () => {
  const { menuItems, loading: menuLoading, addMenuItem, updateMenuItem, deleteMenuItem } = useMenuItems();
  const { orders, loading: ordersLoading, updateOrderStatus } = useFoodOrders();
  const [showMenuItemForm, setShowMenuItemForm] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalMenuItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.available).length;
  const totalOrders = orders.length;
  const activeOrders = orders.filter(order => ['pending', 'preparing', 'ready-for-pickup', 'out-for-delivery'].includes(order.status)).length;
  const billableOrders = useMemo(
    () => orders.filter(order => order.status !== 'cancelled'),
    [orders]
  );
  const totalRevenue = billableOrders.reduce((sum, order) => sum + order.total_amount, 0);

  const { todayRevenue, weekRevenue } = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfWeek = startOfToday - 6 * 24 * 60 * 60 * 1000;
    let today = 0;
    let week = 0;
    billableOrders.forEach((order) => {
      const t = new Date(order.created_at).getTime();
      if (Number.isNaN(t)) return;
      if (t >= startOfToday) today += order.total_amount;
      if (t >= startOfWeek) week += order.total_amount;
    });
    return { todayRevenue: today, weekRevenue: week };
  }, [billableOrders]);

  const popularItems = useMemo(() => {
    const counts = new Map<string, { name: string; qty: number }>();
    orders.forEach((order) => {
      (order.food_order_items ?? []).forEach((line) => {
        const key = line.menu_item_id || line.menu_item_name;
        const prev = counts.get(key) ?? { name: line.menu_item_name, qty: 0 };
        prev.qty += line.quantity;
        counts.set(key, prev);
      });
    });
    return [...counts.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  const handleAddMenuItem = async (data: MenuItemPayload) => {
    await addMenuItem({
      ...data,
      description: data.description ?? null,
      image_url: data.image_url ?? null,
      nutritional_info: null,
    });
    setShowMenuItemForm(false);
  };

  const handleEditMenuItem = async (data: MenuItemPayload) => {
    if (editingMenuItem) {
      await updateMenuItem(editingMenuItem.id, data);
      setEditingMenuItem(null);
    }
  };

  const handleDeleteMenuItem = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMenuItem(deleteTarget);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Food Business Dashboard</h1>
          <p className="text-muted-foreground">Manage your food menu, orders, and operations</p>
        </div>
        <Button onClick={() => setShowMenuItemForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMenuItems}</div>
            <p className="text-xs text-muted-foreground">
              {availableItems} available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders}</div>
            <p className="text-xs text-muted-foreground">
              of {totalOrders} total orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From all orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₦{totalOrders > 0 ? Math.round(totalRevenue / totalOrders).toLocaleString() : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Per order
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="menu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="menu">Menu Management</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="menu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
              <CardDescription>
                Manage your food menu items, prices, and availability
              </CardDescription>
            </CardHeader>
            <CardContent>
              {menuLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {menuItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.category.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>₦{item.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={item.available ? "default" : "secondary"}>
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingMenuItem(item)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDeleteTarget(item.id)}
                              aria-label={`Delete ${item.name}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                View and manage food orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 10).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.customer_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {order.order_type.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>₦{order.total_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              order.status === 'delivered' ? 'default' :
                              order.status === 'cancelled' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {order.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className="rounded border border-input bg-background px-2 py-1 text-sm"
                            aria-label={`Status for order by ${order.customer_name}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="preparing">Preparing</option>
                            <option value="ready-for-pickup">Ready for Pickup</option>
                            <option value="out-for-delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Today's Revenue:</span>
                    <span className="font-bold">{formatNGN(todayRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last 7 Days:</span>
                    <span className="font-bold">{formatNGN(weekRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>All Time:</span>
                    <span className="font-bold">{formatNGN(totalRevenue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Items</CardTitle>
              </CardHeader>
              <CardContent>
                {popularItems.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No ordered items yet — bestsellers will appear here.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {popularItems.map((item, index) => (
                      <div key={item.name} className="flex justify-between items-center">
                        <span className="text-sm">{index + 1}. {item.name}</span>
                        <Badge variant="outline">×{item.qty} ordered</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <MenuItemForm
        open={showMenuItemForm}
        onClose={() => setShowMenuItemForm(false)}
        onSubmit={handleAddMenuItem}
      />

      <MenuItemForm
        open={!!editingMenuItem}
        onClose={() => setEditingMenuItem(null)}
        onSubmit={handleEditMenuItem}
        initialData={editingMenuItem}
        isEditing={true}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this menu item?</AlertDialogTitle>
            <AlertDialogDescription>
              The item will disappear from the menu immediately. Past orders that
              included it are kept for records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMenuItem} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FoodDashboard;
