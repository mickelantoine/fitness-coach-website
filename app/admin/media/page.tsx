'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, LoadingState, EmptyState, AdminButton, ConfirmDialog } from '@/components/admin/ui';
import { uploadFile } from '@/lib/admin-hooks';
import { Upload, Loader2, Copy } from 'lucide-react';
import type { MediaItem } from '@/lib/types';

export default function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('media_library').select('*').order('created_at', { ascending: false });
    setItems((data as MediaItem[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) {
        await supabase.from('media_library').insert({
          url,
          name: file.name,
          type: file.type.startsWith('video') ? 'video' : 'image',
          size_bytes: file.size,
        });
      }
    }
    toast({ title: 'Upload complete' });
    setUploading(false);
    fetchData();
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const item = items.find(i => i.id === deleteId);
    if (item) {
      const path = item.url.split('/media/')[1];
      if (path) {
        await supabase.storage.from('media').remove([path]);
      }
    }
    const { error } = await supabase.from('media_library').delete().eq('id', deleteId);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Deleted successfully' });
    fetchData();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: 'URL copied to clipboard' });
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Media Library" />

      <div className="mb-6">
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-border bg-card/50 py-12 transition-all hover:border-accent/50"
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-accent" />
          ) : (
            <>
              <Upload size={24} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Click to upload images or videos</span>
            </>
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/*,video/*" multiple onChange={handleUpload} className="hidden" />
      </div>

      {items.length === 0 ? (
        <EmptyState message="No media uploaded yet." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-sm border border-border bg-card/50">
              <div className="relative aspect-square bg-secondary">
                {item.type === 'image' ? (
                  <Image src={item.url} alt={item.name} fill className="object-cover" sizes="200px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <span className="text-xs">Video file</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-xs font-medium">{item.name}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => copyUrl(item.url)} className="text-xs text-accent hover:underline">
                    <span className="flex items-center gap-1"><Copy size={10} /> Copy URL</span>
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="text-xs text-destructive hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Media" message="Are you sure you want to delete this file?" />
    </div>
  );
}
