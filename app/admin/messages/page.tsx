'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, LoadingState, EmptyState } from '@/components/admin/ui';
import type { ContactSubmission } from '@/lib/types';
import { Mail, Trash2, CheckCircle2 } from 'lucide-react';

export default function AdminMessages() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    setItems((data as ContactSubmission[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('contact_submissions').update({ status }).eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Updated successfully' });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Deleted successfully' });
    fetchData();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Messages" />

      {items.length === 0 ? (
        <EmptyState message="No messages yet." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className={`rounded-sm border bg-card/50 p-5 ${
                item.status === 'new' ? 'border-accent/30' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className={`rounded-sm px-2 py-0.5 text-[10px] uppercase ${
                      item.status === 'new' ? 'bg-accent/20 text-accent' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                    <a href={`mailto:${item.email}`} className="flex items-center gap-1 hover:text-accent">
                      <Mail size={12} /> {item.email}
                    </a>
                    {item.phone && <span>{item.phone}</span>}
                    <span>{new Date(item.created_at).toLocaleString()}</span>
                  </div>
                  <p className="mt-3 text-sm text-foreground/90">{item.message}</p>
                </div>
                <div className="flex flex-col gap-2">
                  {item.status === 'new' && (
                    <button
                      onClick={() => updateStatus(item.id, 'read')}
                      className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-accent"
                    >
                      <CheckCircle2 size={12} /> Mark read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
