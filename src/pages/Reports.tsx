import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatNGN } from "@/lib/site";
import { TrendingUp, ShoppingBag, Utensils, Wallet } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface RevenuePoint {
  month: string;
  food: number;
  fashion: number;
}

export default function Reports() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [foodOrders, setFoodOrders] = useState<Array<{ total_amount: number; status: string; created_at: string | null; payment_status: string }>>([]);
  const [fashionOrders, setFashionOrders] = useState<Array<{ total_amount: number; status: string; created_at: string | null }>>([]);
  const [customSubmissions, setCustomSubmissions] = useState<Array<{ status: string | null; budget: number }>>([]);
  const [transactions, setTransactions] = useState<Array<{ id: string; type: string; amount: number; business_type: string; description: string; date: string; payment_method: string }>>([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [food, fashion, custom, txns] = await Promise.all([
          supabase.from("food_orders").select("total_amount,status,created_at,payment_status"),
          supabase.from("fashion_orders").select("*"),
          supabase.from("custom_order_submissions").select("status,budget"),
          supabase.from("transactions").select("id,type,amount,business_type,description,date,payment_method").order("date", { ascending: false }).limit(25),
        ]);

        // Degrade gracefully per query: one failing table must not blank the
        // whole report. Each failed source logs and contributes empty data.
        if (food.error) console.error("Reports: food_orders query failed:", food.error);
        if (fashion.error) console.error("Reports: fashion_orders query failed:", fashion.error);
        if (custom.error) console.error("Reports: custom_order_submissions query failed:", custom.error);
        if (txns.error) console.error("Reports: transactions query failed:", txns.error);

        setFoodOrders(food.data ?? []);
        setFashionOrders(
          (fashion.data ?? []).map((o) => ({
            total_amount: Number(o.total_amount ?? 0),
            status: String(o.status ?? "unknown"),
            created_at: (o.created_at as string | null) ?? null,
          }))
        );
        setCustomSubmissions(custom.data ?? []);
        setTransactions(txns.data ?? []);
      } catch (err) {
        console.error("Error loading reports:", err);
        toast({ title: "Error", description: "Failed to load report data.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const foodRevenue = useMemo(
    () => foodOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total_amount, 0),
    [foodOrders]
  );
  const fashionRevenue = useMemo(
    () => fashionOrders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total_amount, 0),
    [fashionOrders]
  );
  const pendingFood = foodOrders.filter((o) => ["pending", "preparing"].includes(o.status)).length;
  const pendingCustom = customSubmissions.filter((o) => o.status === "submitted" || !o.status).length;
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const monthly: RevenuePoint[] = useMemo(() => {
    const buckets = new Map<string, RevenuePoint>();
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets.set(key, {
        month: d.toLocaleDateString("en-US", { month: "short" }),
        food: 0,
        fashion: 0,
      });
    }
    const add = (createdAt: string | null, amount: number, kind: "food" | "fashion") => {
      if (!createdAt) return;
      const d = new Date(createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const bucket = buckets.get(key);
      if (bucket) bucket[kind] += amount;
    };
    foodOrders.forEach((o) => o.status !== "cancelled" && add(o.created_at, o.total_amount, "food"));
    fashionOrders.forEach((o) => o.status !== "cancelled" && add(o.created_at, o.total_amount, "fashion"));
    return [...buckets.values()];
  }, [foodOrders, fashionOrders]);

  const foodByStatus = useMemo(() => {
    const map = new Map<string, number>();
    foodOrders.forEach((o) => map.set(o.status, (map.get(o.status) ?? 0) + 1));
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [foodOrders]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Revenue, orders and transactions across both businesses.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Food Revenue</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNGN(foodRevenue)}</div>
            <p className="text-xs text-muted-foreground">{foodOrders.length} orders · {pendingFood} in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fashion Revenue</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNGN(fashionRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {fashionOrders.length} orders · {pendingCustom} custom requests awaiting review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recorded Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNGN(income)}</div>
            <p className="text-xs text-muted-foreground">From transactions ledger</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recorded Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNGN(expenses)}</div>
            <p className="text-xs text-muted-foreground">From transactions ledger</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue — last 6 months</CardTitle>
          <CardDescription>Completed (non-cancelled) orders by business.</CardDescription>
        </CardHeader>
        <CardContent>
          {monthly.every((m) => m.food === 0 && m.fashion === 0) ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No revenue recorded in the last 6 months yet.
            </p>
          ) : (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `₦${v >= 1000 ? `${Math.round(v / 1000)}k` : v}`} />
                  <Tooltip formatter={(value: number) => formatNGN(value)} />
                  <Bar dataKey="food" name="Food" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fashion" name="Fashion" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Food orders by status</CardTitle>
            <CardDescription>All-time distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            {foodByStatus.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No food orders yet.</p>
            ) : (
              <ul className="space-y-3">
                {foodByStatus.map(([status, count]) => (
                  <li key={status} className="flex items-center justify-between">
                    <Badge variant="outline">{status.replace(/-/g, " ")}</Badge>
                    <span className="font-bold">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent transactions</CardTitle>
            <CardDescription>Latest ledger entries across both businesses.</CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No transactions recorded yet.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(t.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="line-clamp-1">{t.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {t.business_type} · {t.payment_method}
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${t.type === "income" ? "text-green-500" : "text-red-400"}`}>
                          {t.type === "income" ? "+" : "−"}{formatNGN(t.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
