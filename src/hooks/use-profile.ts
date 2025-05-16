
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useSupabaseAuth } from './use-supabase-auth';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useSupabaseAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data as Profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error instanceof Error ? error : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setProfile(data as Profile);
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user || !profile) {
      return { success: false, error: new Error('User not authenticated') };
    }

    try {
      setLoading(true);
      
      // Create a unique file path within the user's folder
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      
      // Upload the image to storage
      const { error: uploadError } = await supabase
        .storage
        .from('profile-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase
        .storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Update the user's profile with the new avatar URL
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(data as Profile);
      return { success: true, data };
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadAvatar,
    isAdmin: profile?.role === 'admin',
    isStaff: profile?.role === 'admin' || profile?.role === 'manager' || profile?.role === 'staff',
  };
}
