import { useState } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Seo } from "@/components/Seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenuItems } from "@/hooks/use-menu-items";
import { useFoodOrders } from "@/hooks/use-food-orders";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { siteConfig, formatNGN } from "@/lib/site";
import { ShoppingCart, Plus, Minus, Trash2, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

type OrderType = "dine-in" | "takeaway" | "delivery";

const FoodOrderPage = () => {
  const { menuItems, loading: menuLoading } = useMenuItems();
  const { createOrder } = useFoodOrders();
  const { items: cart, addItem, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [customerName, setCustomerName] = useState(profile?.full_name ?? "");
  const [customerPhone, setCustomerPhone] = useState(profile?.phone ?? "");
  const [customerEmail, setCustomerEmail] = useState(profile?.email ?? "");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<{ id: string; total: number } | null>(null);

  const deliveryFee = orderType === "delivery" ? siteConfig.food.deliveryFeeNGN : 0;
  const finalTotal = subtotal + deliveryFee;
  const totalQty = cart.reduce((n, i) => n + i.quantity, 0);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast({ title: "Your cart is empty", description: "Add some dishes first.", variant: "destructive" });
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({
        title: "Contact details needed",
        description: "Please fill in your name and phone number so we can confirm your order.",
        variant: "destructive",
      });
      return;
    }
    if (orderType === "delivery" && !deliveryAddress.trim()) {
      toast({
        title: "Delivery address needed",
        description: "Please provide your delivery address.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const notes = [
        orderNotes.trim(),
        customerEmail.trim() ? `Email: ${customerEmail.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const order = await createOrder({
        customer_id: user?.id,
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        order_type: orderType,
        delivery_address: orderType === "delivery" ? deliveryAddress.trim() : undefined,
        items: cart.map((item) => ({
          menu_item_id: item.id,
          menu_item_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          notes: item.notes,
        })),
        notes: notes || undefined,
      });

      setPlacedOrder({ id: order.id, total: order.total_amount + deliveryFee });
      clearCart();
      setDeliveryAddress("");
      setOrderNotes("");
    } catch (error) {
      console.error("Error placing order:", error);
      // createOrder already toasts the failure; nothing more to do here.
    } finally {
      setSubmitting(false);
    }
  };

  const availableMenuItems = menuItems.filter((item) => item.available);

  if (menuLoading) {
    return (
      <ClientLayout>
        <div className="container space-y-4 py-8">
          <Skeleton className="h-12 w-64" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (placedOrder) {
    return (
      <ClientLayout>
        <Seo title="Order Confirmed" description="Your Vachoma Empire food order has been received." path="/food-order" indexable={false} />
        <div className="container max-w-2xl py-16 text-center">
          <Card>
            <CardHeader>
              <CheckCircle2 className="mx-auto mb-2 h-12 w-12 text-primary" />
              <CardTitle className="text-2xl">Order received!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Thank you, {customerName.trim() || "friend"}. We'll call{" "}
                <strong>{customerPhone}</strong> shortly to confirm your{" "}
                {orderType === "delivery" ? "delivery" : orderType === "dine-in" ? "table" : "pickup"} order
                of <strong>{formatNGN(placedOrder.total)}</strong>
                {orderType === "delivery" ? " (delivery fee included)" : ""}.
              </p>
              <p className="text-xs text-muted-foreground">
                Order reference: <code className="rounded bg-muted px-1.5 py-0.5">{placedOrder.id.slice(0, 8).toUpperCase()}</code>
              </p>
              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <Link to="/food-menu">
                  <Button variant="outline" className="w-full sm:w-auto">Back to Menu</Button>
                </Link>
                <Button className="w-full sm:w-auto" onClick={() => setPlacedOrder(null)}>
                  Place Another Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <Seo
        title="Order Food Online"
        description="Order Vachoma Empire Bole online for dine-in, takeaway or delivery in Port Harcourt. Fresh roasted plantain, yam, fish and palm-oil pepper sauce."
        path="/food-order"
      />
      <div className="container py-8 md:py-12">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Bole kitchen</p>
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Place Your Food Order</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Pick your dishes, choose pickup or delivery, and we'll confirm by phone.
            Pay on pickup or delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Add Dishes</CardTitle>
              </CardHeader>
              <CardContent>
                {availableMenuItems.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="mb-4 text-muted-foreground">No menu items available at the moment.</p>
                    <Link to="/food-menu">
                      <Button variant="outline">View Full Menu</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {availableMenuItems.map((item) => (
                      <Card key={item.id} className="transition-shadow hover:shadow-md">
                        <CardContent className="p-4">
                          <div className="mb-3 flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">{item.name}</h3>
                              {item.description && (
                                <p className="line-clamp-2 text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                              <p className="mt-2 font-bold text-primary">{formatNGN(item.price)}</p>
                            </div>
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="ml-4 h-16 w-16 rounded object-cover"
                                loading="lazy"
                              />
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {item.category.replace(/-/g, " ")}
                            </Badge>
                            <Button
                              size="sm"
                              onClick={() =>
                                addItem({ id: item.id, name: item.name, price: item.price, imageUrl: item.image_url })
                              }
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-3 w-3" />
                              Add to Cart
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Order ({totalQty} {totalQty === 1 ? "item" : "items"})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="mb-3 text-muted-foreground">Your cart is empty</p>
                    <Link to="/food-menu">
                      <Button variant="outline" size="sm">Browse Menu</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-medium">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {formatNGN(item.price)} each
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease ${item.name}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase ${item.name}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{formatNGN(subtotal)}</span>
                      </div>
                      {orderType === "delivery" && (
                        <div className="flex justify-between">
                          <span>Delivery Fee:</span>
                          <span>{formatNGN(deliveryFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t pt-2 text-lg font-bold">
                        <span>Total:</span>
                        <span>{formatNGN(finalTotal)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Type</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={orderType} onValueChange={(value) => setOrderType(value as OrderType)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dine-in" id="dine-in" />
                    <Label htmlFor="dine-in" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Dine In
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="takeaway" id="takeaway" />
                    <Label htmlFor="takeaway">Takeaway / Pickup</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Delivery (+{formatNGN(siteConfig.food.deliveryFeeNGN)})
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customer-name">Name *</Label>
                  <Input
                    id="customer-name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Phone Number *</Label>
                  <Input
                    id="customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+234 xxx xxx xxxx"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <Label htmlFor="customer-email">Email (Optional)</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>
              </CardContent>
            </Card>

            {orderType === "delivery" && (
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Street, area, nearest landmark…"
                    rows={3}
                    aria-label="Delivery address"
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Special Instructions (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Extra spicy? No onions? Tell us here…"
                  rows={3}
                  aria-label="Special instructions"
                />
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmitOrder}
              disabled={cart.length === 0 || submitting}
            >
              {submitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
                  Placing Order...
                </>
              ) : (
                <>Place Order · {formatNGN(finalTotal)}</>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              We'll call you to confirm your order details. Payment is made on pickup or delivery.
            </p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default FoodOrderPage;
