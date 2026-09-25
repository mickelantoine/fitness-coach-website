'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, AdminInput, AdminTextarea, AdminButton, AdminModal, ConfirmDialog, EmptyState, LoadingState } from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/image-upload';
import type { Testimonial } from '@/lib/types';

export default function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Testimonial | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('display_order');
    setItems((data as Testimonial[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (data: Record<string, unknown>) => {
    if (editItem) {
      const { error } = await supabase.from('testimonials').update(data).eq('id', editItem.id);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const { error } = await supabase.from('testimonials').insert(data);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    toast({ title: 'Saved successfully' });
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('testimonials').delete().eq('id', deleteId);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Deleted successfully' });
    fetchData();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Testimonials" action={() => { setEditItem(null); setModalOpen(true); }} actionLabel="+ Add Testimonial" />

      {items.length === 0 ? (
        <EmptyState message="No testimonials yet. Click 'Add Testimonial' to create one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-sm border border-border bg-card/50 p-5">
              <div className="flex items-center gap-3">
                {item.profile_image_url ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-secondary">
                    <Image src={item.profile_image_url} alt={item.client_name} fill className="object-cover" sizes="40px" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-accent">
                    {item.client_name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{item.client_name}</p>
                  <p className="text-xs text-accent">{'★'.repeat(item.rating)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{item.testimonial}</p>
              <div className="mt-4 flex gap-2">
                <AdminButton onClick={() => { setEditItem(item); setModalOpen(true); }} variant="secondary">Edit</AdminButton>
                <AdminButton onClick={() => setDeleteId(item.id)} variant="danger">Delete</AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Testimonial' : 'New Testimonial'}>
        <TestimonialForm item={editItem} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      </AdminModal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Testimonial" message="Are you sure you want to delete this testimonial?" />
    </div>
  );
}

function TestimonialForm({
  item, onSave, onCancel,
}: {
  item: Testimonial | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [clientName, setClientName] = useState(item?.client_name || '');
  const [testimonial, setTestimonial] = useState(item?.testimonial || '');
  const [profileImage, setProfileImage] = useState(item?.profile_image_url || '');
  const [transformationImage, setTransformationImage] = useState(item?.transformation_image_url || '');
  const [rating, setRating] = useState(item?.rating?.toString() || '5');
  const [displayOrder, setDisplayOrder] = useState(item?.display_order?.toString() || '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      client_name: clientName,
      testimonial,
      profile_image_url: profileImage || null,
      transformation_image_url: transformationImage || null,
      rating: parseInt(rating) || 5,
      display_order: parseInt(displayOrder) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminInput label="Client Name" value={clientName} onChange={setClientName} required />
      <AdminTextarea label="Testimonial" value={testimonial} onChange={setTestimonial} rows={4} />
      <ImageUpload label="Profile Image" value={profileImage} onChange={setProfileImage} aspectRatio="aspect-square" />
      <ImageUpload label="Transformation Image" value={transformationImage} onChange={setTransformationImage} />
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Rating (1-5)" type="number" value={rating} onChange={setRating} />
        <AdminInput label="Display Order" type="number" value={displayOrder} onChange={setDisplayOrder} />
      </div>
      <div className="flex gap-3 pt-4">
        <AdminButton type="submit">Save</AdminButton>
        <AdminButton onClick={onCancel} variant="secondary">Cancel</AdminButton>
      </div>
    </form>
  );
}
