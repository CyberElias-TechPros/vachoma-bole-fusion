
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FashionDesign {
  id: string;
  name: string;
  description: string;
  designer_id: string | null;
  design_images: string[];
  category: string;
  status: string;
  technical_specs: string | null;
  price: number;
  created_at: string;
  updated_at: string;
}

export function useFashionDesigns() {
  const [designs, setDesigns] = useState<FashionDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fashion_designs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDesigns(data || []);
    } catch (err) {
      console.error('Error fetching fashion designs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch designs');
      toast({
        title: "Error",
        description: "Failed to load fashion designs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const addDesign = async (design: Omit<FashionDesign, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('fashion_designs')
        .insert([design])
        .select()
        .single();

      if (error) throw error;
      
      setDesigns(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Fashion design added successfully",
      });
      return data;
    } catch (err) {
      console.error('Error adding fashion design:', err);
      toast({
        title: "Error",
        description: "Failed to add fashion design",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateDesign = async (id: string, updates: Partial<FashionDesign>) => {
    try {
      const { data, error } = await supabase
        .from('fashion_designs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setDesigns(prev => prev.map(design => design.id === id ? data : design));
      toast({
        title: "Success",
        description: "Fashion design updated successfully",
      });
      return data;
    } catch (err) {
      console.error('Error updating fashion design:', err);
      toast({
        title: "Error",
        description: "Failed to update fashion design",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteDesign = async (id: string) => {
    try {
      const { error } = await supabase
        .from('fashion_designs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setDesigns(prev => prev.filter(design => design.id !== id));
      toast({
        title: "Success",
        description: "Fashion design deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting fashion design:', err);
      toast({
        title: "Error",
        description: "Failed to delete fashion design",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    designs,
    loading,
    error,
    addDesign,
    updateDesign,
    deleteDesign,
    refetch: fetchDesigns,
  };
}
