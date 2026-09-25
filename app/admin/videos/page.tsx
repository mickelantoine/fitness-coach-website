'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, AdminInput, AdminTextarea, AdminButton, AdminModal, ConfirmDialog, EmptyState, LoadingState } from '@/components/admin/ui';
import { ImageUpload, VideoUrlInput } from '@/components/admin/image-upload';
import type { GeneralVideo } from '@/lib/types';

export default function AdminVideos() {
  const [items, setItems] = useState<GeneralVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<GeneralVideo | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('general_videos').select('*').order('display_order');
    setItems((data as GeneralVideo[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (data: Record<string, unknown>) => {
    if (editItem) {
      const { error } = await supabase.from('general_videos').update(data).eq('id', editItem.id);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const { error } = await supabase.from('general_videos').insert(data);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    toast({ title: 'Saved successfully' });
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('general_videos').delete().eq('id', deleteId);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Deleted successfully' });
    fetchData();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Video Content" action={() => { setEditItem(null); setModalOpen(true); }} actionLabel="+ Add Video" />

      {items.length === 0 ? (
        <EmptyState message="No videos yet. Click 'Add Video' to create one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-sm border border-border bg-card/50">
              <div className="relative aspect-video bg-secondary">
                {item.thumbnail_url ? (
                  <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" sizes="300px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">No thumbnail</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.category || 'Uncategorized'}</p>
                <div className="mt-3 flex gap-2">
                  <AdminButton onClick={() => { setEditItem(item); setModalOpen(true); }} variant="secondary">Edit</AdminButton>
                  <AdminButton onClick={() => setDeleteId(item.id)} variant="danger">Delete</AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Video' : 'New Video'}>
        <VideoForm item={editItem} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      </AdminModal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Video" message="Are you sure you want to delete this video?" />
    </div>
  );
}

function VideoForm({
  item, onSave, onCancel,
}: {
  item: GeneralVideo | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [videoUrl, setVideoUrl] = useState(item?.video_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(item?.thumbnail_url || '');
  const [category, setCategory] = useState(item?.category || '');
  const [displayOrder, setDisplayOrder] = useState(item?.display_order?.toString() || '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description: description || null,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl || null,
      category: category || null,
      display_order: parseInt(displayOrder) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminInput label="Title" value={title} onChange={setTitle} required />
      <AdminTextarea label="Description" value={description} onChange={setDescription} rows={3} />
      <VideoUrlInput label="Video URL" value={videoUrl} onChange={setVideoUrl} />
      <ImageUpload label="Thumbnail" value={thumbnailUrl} onChange={setThumbnailUrl} />
      <AdminInput label="Category" value={category} onChange={setCategory} placeholder="e.g. Warm-Up, Mobility" />
      <AdminInput label="Display Order" type="number" value={displayOrder} onChange={setDisplayOrder} />
      <div className="flex gap-3 pt-4">
        <AdminButton type="submit">Save</AdminButton>
        <AdminButton onClick={onCancel} variant="secondary">Cancel</AdminButton>
      </div>
    </form>
  );
}
