import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Utensils, Users, ClipboardList, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatNGN } from "@/lib/site";

interface OverviewStats {
  foodRevenue: number;
  foodOrders: number;
  activeFoodOrders: number;
  fashionOrders: number;
  pendingCustomRequests: number;
  totalCustomers: number;
  menuItems: number;
  designs: number;
}

interface RecentOrder {
  id: string;
  label: string;
  detail: string;
  amount: number;
  status: string;
  date: string | null;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OverviewStats>({
    foodRevenue: 0,
    foodOrders: 0,
    activeFoodOrders: 0,
    fashionOrders: 0,
    pendingCustomRequests: 0,
    totalCustomers: 0,
    menuItems: 0,
    designs: 0,
  });
  const [recentFood, setRecentFood] = useState<RecentOrder[]>([]);
  const [recentCustom, setRecentCustom] = useState<RecentOrder[]>([]);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const [food, fashion, custom, customers, menu, designs] = await Promise.all([
          supabase.from("food_orders").select("id,customer_name,total_amount,status,created_at").order("created_at", { ascending: false }),
          supabase.from("fashion_orders").select("id,total_amount,status"),
          supabase.from("custom_order_submissions").select("id,name,order_type,budget,status,created_at").order("created_at", { ascending: false }).limit(5),
          supabase.from("customers").select("id", { count: "exact", head: true }),
          supabase.from("menu_items").select("id", { count: "exact", head: true }),
          supabase.from("fashion_designs").select("id", { count: "exact", head: true }),
        ]);

        const foodRows = food.data ?? [];
        const fashionRows = (fashion.data ?? []) as Array<{ total_amount: number | null; status: string | null }>;
        const customRows = custom.data ?? [];

        setStats({
          foodRevenue: foodRows.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total_amount, 0),
          foodOrders: foodRows.length,
          activeFoodOrders: foodRows.filter((o) => ["pending", "preparing", "ready-for-pickup", "out-for-delivery"].includes(o.status)).length,
          fashionOrders: fashionRows.length,
          pendingCustomRequests: customRows.filter((o) => o.status === "submitted" || !o.status).length,
          totalCustomers: customers.count ?? 0,
          menuItems: menu.count ?? 0,
          designs: designs.count ?? 0,
        });

        setRecentFood(
          foodRows.slice(0, 5).map((o) => ({
            id: o.id,
            label: o.customer_name,
            detail: "Food order",
            amount: o.total_amount,
            status: o.status,
            date: o.created_at,
          }))
        );
        setRecentCustom(
          customRows.map((o) => ({
            id: o.id,
            label: o.name,
            detail: o.order_type,
            amount: o.budget,
            status: o.status ?? "submitted",
            date: o.created_at,
          }))
        );
      } catch (err) {
        console.error("Error loading dashboard overview:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Overview</h1>
          <p className="text-muted-foreground">Fashion and food performance at a glance.</p>
        </div>
        <Link to="/reports">
          <Button variant="outline">View Reports <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Revenue</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNGN(stats.foodRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.foodOrders} orders · {stats.activeFoodOrders} in progress
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
              {stats.designs} designs in portfolio · {stats.pendingCustomRequests} custom requests pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              <Link to="/customers" className="text-primary hover:underline">Manage customers</Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catalogue</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.menuItems + stats.designs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.menuItems} menu items · {stats.designs} fashion designs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latest food orders</CardTitle>
            </div>
            <Link to="/food">
              <Button variant="ghost" size="sm">Open food dashboard</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentFood.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No food orders yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentFood.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{o.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {o.date ? new Date(o.date).toLocaleString() : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-medium">{formatNGN(o.amount)}</span>
                      <Badge variant="secondary">{o.status.replace(/-/g, " ")}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Latest custom fashion requests</CardTitle>
            </div>
            <Link to="/fashion">
              <Button variant="ghost" size="sm">Open fashion dashboard</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentCustom.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No custom requests yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentCustom.map((o) => (
                  <li key={o.id} className="flex items-center justify-between gap-3 border-b pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{o.label}</p>
                      <p className="text-xs capitalize text-muted-foreground">{o.detail}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-sm font-medium">{formatNGN(o.amount)}</span>
                      <Badge variant="secondary">{o.status.replace(/-/g, " ")}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
