import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFashionDesigns } from "@/hooks/use-fashion-designs";
import type { FashionDesign } from "@/hooks/use-fashion-designs";
import { FashionDesignForm } from "@/components/admin/FashionDesignForm";
import type { FashionDesignPayload } from "@/components/admin/FashionDesignForm";
import { Plus, Shirt, Palette, Layers, DollarSign, Edit2, Trash2, Eye } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatNGN } from "@/lib/site";

interface CustomOrderRow {
  id: string;
  name: string;
  email: string;
  order_type: string;
  other_order_type: string | null;
  budget: number;
  timeline: string;
  status: string | null;
}

interface CollectionRow {
  id: string;
  name: string;
  description: string;
  season: string | null;
  is_active: boolean | null;
  release_date: string | null;
}

const FashionDashboard = () => {
  const { designs, loading: designsLoading, addDesign, updateDesign, deleteDesign } = useFashionDesigns();
  const { toast } = useToast();
  const [showDesignForm, setShowDesignForm] = useState(false);
  const [editingDesign, setEditingDesign] = useState<FashionDesign | null>(null);
  const [customOrders, setCustomOrders] = useState<CustomOrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [collectionCounts, setCollectionCounts] = useState<Record<string, number>>({});
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCustomOrders();
    fetchCollections();
  }, []);

  const fetchCustomOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_order_submissions')
        .select('id,name,email,order_type,other_order_type,budget,timeline,status')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCustomOrders(data || []);
    } catch (error) {
      console.error('Error fetching custom orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('fashion_collections')
        .select('id,name,description,season,is_active,release_date')
        .order('release_date', { ascending: false, nullsFirst: false });
      if (error) throw error;
      setCollections(data ?? []);

      if (data && data.length > 0) {
        const { data: links, error: linksError } = await supabase
          .from('collection_designs')
          .select('collection_id')
          .in('collection_id', data.map((c) => c.id));
        if (linksError) throw linksError;
        const counts: Record<string, number> = {};
        (links ?? []).forEach((l) => {
          counts[l.collection_id] = (counts[l.collection_id] ?? 0) + 1;
        });
        setCollectionCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setCollectionsLoading(false);
    }
  };

  const totalDesigns = designs.length;
  const approvedDesigns = designs.filter((design) => design.status === 'approved').length;
  const totalCustomOrders = customOrders.length;
  const pendingOrders = customOrders.filter((order) => !order.status || order.status === 'submitted').length;
  const avgPrice = designs.length > 0 ? designs.reduce((sum, design) => sum + design.price, 0) / designs.length : 0;
  const activeCollections = collections.filter((c) => c.is_active).length;

  const handleAddDesign = async (data: FashionDesignPayload) => {
    await addDesign({ ...data, designer_id: null, technical_specs: data.technical_specs ?? null });
    setShowDesignForm(false);
  };

  const handleEditDesign = async (data: FashionDesignPayload) => {
    if (editingDesign) {
      await updateDesign(editingDesign.id, data);
      setEditingDesign(null);
    }
  };

  const handleDeleteDesign = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDesign(deleteTarget);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const toggleCollectionActive = async (collection: CollectionRow) => {
    try {
      const { error } = await supabase
        .from('fashion_collections')
        .update({ is_active: !collection.is_active })
        .eq('id', collection.id);
      if (error) throw error;
      setCollections((prev) =>
        prev.map((c) => (c.id === collection.id ? { ...c, is_active: !c.is_active } : c))
      );
      toast({ title: collection.is_active ? "Collection hidden" : "Collection published" });
    } catch (error) {
      console.error('Error updating collection:', error);
      toast({ title: "Error", description: "Failed to update collection.", variant: "destructive" });
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('custom_order_submissions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;

      setCustomOrders((prev) => prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast({ title: "Status updated" });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  };

  const pretty = (s: string) => s.replace(/-/g, ' ');

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              of {totalCustomOrders} total custom orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNGN(avgPrice)}</div>
            <p className="text-xs text-muted-foreground">
              Per design
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Collections</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCollections}</div>
            <p className="text-xs text-muted-foreground">
              of {collections.length} total collections
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
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : designs.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-4 text-muted-foreground">No designs yet. Add your first design to build the portfolio.</p>
                  <Button onClick={() => setShowDesignForm(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Design
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
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
                              {pretty(design.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatNGN(design.price)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                design.status === 'approved' ? 'default' :
                                  design.status === 'draft' ? 'secondary' :
                                    'outline'
                              }
                            >
                              {pretty(design.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => design.design_images?.[0] && window.open(design.design_images[0], '_blank', 'noopener,noreferrer')}
                                disabled={!design.design_images?.[0]}
                                aria-label={`Preview ${design.name}`}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingDesign(design)}
                                aria-label={`Edit ${design.name}`}
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setDeleteTarget(design.id)}
                                aria-label={`Delete ${design.name}`}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : customOrders.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">
                  No custom order requests yet. New requests from the website will appear here.
                </p>
              ) : (
                <div className="overflow-x-auto">
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
                          <TableCell>{formatNGN(order.budget)}</TableCell>
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
                              {order.status ?? 'submitted'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <select
                              value={order.status ?? 'submitted'}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="rounded border border-input bg-background px-2 py-1 text-sm"
                              aria-label={`Status for order by ${order.name}`}
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fashion Collections</CardTitle>
              <CardDescription>
                Themed collections shown on the website. Toggle visibility without deleting anything.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {collectionsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
                </div>
              ) : collections.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="mb-2 font-medium">No collections yet</p>
                  <p className="mx-auto max-w-md text-sm text-muted-foreground">
                    Create collections in the <code>fashion_collections</code> table and link
                    designs via <code>collection_designs</code> — they'll appear on the
                    Collections page automatically once marked active.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Season</TableHead>
                        <TableHead>Designs</TableHead>
                        <TableHead>Visibility</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {collections.map((collection) => (
                        <TableRow key={collection.id}>
                          <TableCell className="font-medium">
                            <div>{collection.name}</div>
                            <div className="line-clamp-1 max-w-xs text-xs text-muted-foreground">
                              {collection.description}
                            </div>
                          </TableCell>
                          <TableCell>{collection.season ?? "—"}</TableCell>
                          <TableCell>{collectionCounts[collection.id] ?? 0}</TableCell>
                          <TableCell>
                            <Badge variant={collection.is_active ? "default" : "secondary"}>
                              {collection.is_active ? "Published" : "Hidden"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleCollectionActive(collection)}
                            >
                              {collection.is_active ? "Hide" : "Publish"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    <span className="font-bold">{formatNGN(avgPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custom Requests:</span>
                    <span className="font-bold">{totalCustomOrders}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Categories</CardTitle>
              </CardHeader>
              <CardContent>
                {designs.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">No designs yet.</p>
                ) : (
                  <div className="space-y-2">
                    {Array.from(new Set(designs.map((d) => d.category))).slice(0, 5).map((category, index) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{index + 1}. {pretty(category)}</span>
                        <Badge variant="outline">
                          {designs.filter((d) => d.category === category).length}
                        </Badge>
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

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this design?</AlertDialogTitle>
            <AlertDialogDescription>
              The design will be removed from the portfolio and any collections immediately.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDesign} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FashionDashboard;
