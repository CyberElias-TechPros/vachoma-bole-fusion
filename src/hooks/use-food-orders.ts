
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FoodOrder {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_phone: string | null;
  total_amount: number;
  status: string;
  payment_status: string;
  order_type: string;
  delivery_address: string | null;
  delivery_fee: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  food_order_items?: FoodOrderItem[];
}

interface FoodOrderItem {
  id: string;
  order_id: string;
  menu_item_id: string;
  menu_item_name: string;
  quantity: number;
  unit_price: number;
  notes: string | null;
}

export function useFoodOrders() {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('food_orders')
        .select(`
          *,
          food_order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching food orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      toast({
        title: "Error",
        description: "Failed to load food orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const createOrder = async (orderData: {
    customer_name: string;
    customer_phone?: string;
    order_type: string;
    delivery_address?: string;
    items: Array<{
      menu_item_id: string;
      menu_item_name: string;
      quantity: number;
      unit_price: number;
      notes?: string;
    }>;
    notes?: string;
  }) => {
    try {
      const total_amount = orderData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
      
      const { data: order, error: orderError } = await supabase
        .from('food_orders')
        .insert([{
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          total_amount,
          status: 'pending',
          payment_status: 'pending',
          order_type: orderData.order_type,
          delivery_address: orderData.delivery_address,
          notes: orderData.notes,
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        menu_item_name: item.menu_item_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        notes: item.notes,
      }));

      const { error: itemsError } = await supabase
        .from('food_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await fetchOrders();
      toast({
        title: "Success",
        description: "Food order created successfully",
      });
      
      return order;
    } catch (err) {
      console.error('Error creating food order:', err);
      toast({
        title: "Error",
        description: "Failed to create food order",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('food_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      return data;
    } catch (err) {
      console.error('Error updating order status:', err);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrderStatus,
    refetch: fetchOrders,
  };
}
