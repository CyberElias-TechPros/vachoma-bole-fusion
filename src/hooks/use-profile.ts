import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  created_at: string;
  updated_at: string;
}

/**
 * Loads and manages the `profiles` row for the given auth user.
 *
 * The user is passed in (rather than subscribing to auth state internally)
 * so the whole app shares exactly one Supabase auth subscription owned by
 * `useSupabaseAuth` in the AuthProvider.
 */
export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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

    if (!file.type.startsWith('image/')) {
      return { success: false, error: new Error('Please choose an image file') };
    }

    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: new Error('Image must be smaller than 2MB') };
    }

    try {
      setLoading(true);

      const safeName = file.name.replace(/[^\w.-]+/g, '-');
      const filePath = `${user.id}/${Date.now()}-${safeName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('profile-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase
        .storage
        .from('profile-images')
        .getPublicUrl(filePath);

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
    refetch: fetchProfile,
    isAdmin: profile?.role === 'admin',
    isStaff: profile?.role === 'admin' || profile?.role === 'manager' || profile?.role === 'staff',
  };
}
