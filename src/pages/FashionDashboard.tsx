
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFashionDesigns } from "@/hooks/use-fashion-designs";
import { FashionDesignForm } from "@/components/admin/FashionDesignForm";
import { Plus, Shirt, Palette, TrendingUp, DollarSign, Edit2, Trash2, Eye } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState as useStateHook } from "react";

const FashionDashboard = () => {
  const { designs, loading: designsLoading, addDesign, updateDesign, deleteDesign } = useFashionDesigns();
  const [showDesignForm, setShowDesignForm] = useState(false);
  const [editingDesign, setEditingDesign] = useState<any>(null);
  const [customOrders, setCustomOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    fetchCustomOrders();
  }, []);

  const fetchCustomOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_order_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomOrders(data || []);
    } catch (error) {
      console.error('Error fetching custom orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const totalDesigns = designs.length;
  const approvedDesigns = designs.filter(design => design.status === 'approved').length;
  const totalCustomOrders = customOrders.length;
  const pendingOrders = customOrders.filter(order => order.status === 'submitted').length;
  const avgPrice = designs.length > 0 ? designs.reduce((sum, design) => sum + design.price, 0) / designs.length : 0;

  const handleAddDesign = async (data: any) => {
    await addDesign(data);
    setShowDesignForm(false);
  };

  const handleEditDesign = async (data: any) => {
    if (editingDesign) {
      await updateDesign(editingDesign.id, data);
      setEditingDesign(null);
    }
  };

  const handleDeleteDesign = async (id: string) => {
    if (confirm('Are you sure you want to delete this design?')) {
      await deleteDesign(id);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('custom_order_submissions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      
      setCustomOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Fashion Design Dashboard</h1>
          <p className="text-muted-foreground">Manage your fashion designs, custom orders, and portfolio</p>
        </div>
        <Button onClick={() => setShowDesignForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Design
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Designs</CardTitle>
            <Shirt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDesigns}</div>
            <p className="text-xs text-muted-foreground">
              {approvedDesigns} approved
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custom Orders</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              of {totalCustomOrders} total orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{Math.round(avgPrice).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Per design
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Views</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="designs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="designs">Designs</TabsTrigger>
          <TabsTrigger value="custom-orders">Custom Orders</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="designs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fashion Designs</CardTitle>
              <CardDescription>
                Manage your fashion design portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {designsLoading ? (
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
                    {designs.map((design) => (
                      <TableRow key={design.id}>
                        <TableCell className="font-medium">{design.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {design.category.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>₦{design.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              design.status === 'approved' ? 'default' :
                              design.status === 'draft' ? 'secondary' :
                              'outline'
                            }
                          >
                            {design.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => window.open(design.design_images[0], '_blank')}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingDesign(design)}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteDesign(design.id)}
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

        <TabsContent value="custom-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom Order Requests</CardTitle>
              <CardDescription>
                Manage custom fashion order requests from clients
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
                      <TableHead>Client</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{order.name}</div>
                            <div className="text-xs text-muted-foreground">{order.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {order.order_type === 'other' && order.other_order_type 
                              ? order.other_order_type 
                              : order.order_type}
                          </Badge>
                        </TableCell>
                        <TableCell>₦{order.budget.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {order.timeline}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              order.status === 'completed' ? 'default' :
                              order.status === 'rejected' ? 'destructive' :
                              'secondary'
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="submitted">Submitted</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="accepted">Accepted</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="rejected">Rejected</option>
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

        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fashion Collections</CardTitle>
              <CardDescription>
                Organize your designs into themed collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Collections feature coming soon</p>
                <Button variant="outline">Create Collection</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Design Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Designs:</span>
                    <span className="font-bold">{totalDesigns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved:</span>
                    <span className="font-bold">{approvedDesigns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Price:</span>
                    <span className="font-bold">₦{Math.round(avgPrice).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(designs.map(d => d.category))).slice(0, 5).map((category, index) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm">{index + 1}. {category.replace('-', ' ')}</span>
                      <Badge variant="outline">
                        {designs.filter(d => d.category === category).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Forms */}
      <FashionDesignForm
        open={showDesignForm}
        onClose={() => setShowDesignForm(false)}
        onSubmit={handleAddDesign}
      />

      <FashionDesignForm
        open={!!editingDesign}
        onClose={() => setEditingDesign(null)}
        onSubmit={handleEditDesign}
        initialData={editingDesign}
        isEditing={true}
      />
    </div>
  );
};

export default FashionDashboard;
