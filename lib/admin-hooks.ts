'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAdminData<T>(
  table: string,
  select?: string,
  orderBy?: string,
  ascending: boolean = true
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase.from(table).select(select || '*');
    if (orderBy) query = query.order(orderBy, { ascending });
    const { data: result, error } = await query;
    if (error) {
      toast({ title: 'Error loading data', description: error.message, variant: 'destructive' });
    } else {
      setData((result as T[]) || []);
    }
    setLoading(false);
  }, [table, select, orderBy, ascending, toast]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const remove = async (id: string) => {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      toast({ title: 'Error deleting', description: error.message, variant: 'destructive' });
      return false;
    }
    toast({ title: 'Deleted successfully' });
    fetch();
    return true;
  };

  const upsert = async (record: Record<string, unknown>) => {
    const { data: result, error } = await supabase
      .from(table)
      .upsert(record)
      .select()
      .single();
    if (error) {
      toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
      return null;
    }
    toast({ title: 'Saved successfully' });
    fetch();
    return result;
  };

  return { data, loading, refetch: fetch, remove, upsert };
}

export async function uploadFile(file: File, folder: string = 'uploads'): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(fileName, file);
  if (error) return null;
  const { data } = supabase.storage.from('media').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function addToMediaLibrary(url: string, name: string, type: string, size?: number) {
  await supabase.from('media_library').insert({
    url,
    name,
    type,
    size_bytes: size || null,
  });
}
