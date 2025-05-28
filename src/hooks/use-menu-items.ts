
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  price: number;
  available: boolean;
  image_url: string | null;
  ingredients: string[] | null;
  allergens: string[] | null;
  nutritional_info: any;
  created_at: string;
  updated_at: string;
}

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const addMenuItem = async (item: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      
      setMenuItems(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Menu item added successfully",
      });
      return data;
    } catch (err) {
      console.error('Error adding menu item:', err);
      toast({
        title: "Error",
        description: "Failed to add menu item",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setMenuItems(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: "Success",
        description: "Menu item updated successfully",
      });
      return data;
    } catch (err) {
      console.error('Error updating menu item:', err);
      toast({
        title: "Error",
        description: "Failed to update menu item",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setMenuItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Menu item deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting menu item:', err);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    menuItems,
    loading,
    error,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    refetch: fetchMenuItems,
  };
}
