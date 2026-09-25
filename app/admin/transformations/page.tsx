'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminButton, AdminModal, ConfirmDialog, EmptyState, LoadingState } from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/image-upload';
import type { Transformation, TransformationCategory } from '@/lib/types';

export default function AdminTransformations() {
  const [items, setItems] = useState<Transformation[]>([]);
  const [categories, setCategories] = useState<TransformationCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Transformation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [{ data: trans }, { data: cats }] = await Promise.all([
      supabase.from('transformations').select('*, transformation_categories(*)').order('display_order'),
      supabase.from('transformation_categories').select('*').order('name'),
    ]);
    setItems((trans as Transformation[]) || []);
    setCategories((cats as TransformationCategory[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const openEdit = (item: Transformation) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleSave = async (data: Record<string, unknown>) => {
    if (editItem) {
      const { error } = await supabase.from('transformations').update(data).eq('id', editItem.id);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const { error } = await supabase.from('transformations').insert(data);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    toast({ title: 'Saved successfully' });
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('transformations').delete().eq('id', deleteId);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Deleted successfully' });
    fetchData();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Transformations" action={openCreate} actionLabel="+ Add Transformation" />

      {items.length === 0 ? (
        <EmptyState message="No transformations yet. Click 'Add Transformation' to create one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-sm border border-border bg-card/50">
              <div className="relative aspect-[4/3] bg-secondary">
                {item.after_image_url ? (
                  <Image src={item.after_image_url} alt={item.client_name} fill className="object-cover" sizes="300px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
                )}
                {item.featured && (
                  <span className="absolute top-2 right-2 rounded-sm bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">Featured</span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{item.client_name}</h3>
                <p className="text-xs text-muted-foreground">{item.duration} · {item.goal || 'No goal set'}</p>
                {item.transformation_categories && (
                  <span className="mt-2 inline-block rounded-sm bg-secondary px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {item.transformation_categories.name}
                  </span>
                )}
                <div className="mt-4 flex gap-2">
                  <AdminButton onClick={() => openEdit(item)} variant="secondary">Edit</AdminButton>
                  <AdminButton onClick={() => setDeleteId(item.id)} variant="danger">Delete</AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Transformation' : 'New Transformation'}>
        <TransformationForm
          item={editItem}
          categories={categories}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </AdminModal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Transformation"
        message="Are you sure you want to delete this transformation? This cannot be undone."
      />
    </div>
  );
}

function TransformationForm({
  item,
  categories,
  onSave,
  onCancel,
}: {
  item: Transformation | null;
  categories: TransformationCategory[];
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [clientName, setClientName] = useState(item?.client_name || '');
  const [age, setAge] = useState(item?.age?.toString() || '');
  const [duration, setDuration] = useState(item?.duration || '12 weeks');
  const [goal, setGoal] = useState(item?.goal || '');
  const [testimonial, setTestimonial] = useState(item?.testimonial || '');
  const [beforeImage, setBeforeImage] = useState(item?.before_image_url || '');
  const [afterImage, setAfterImage] = useState(item?.after_image_url || '');
  const [weightChange, setWeightChange] = useState(item?.weight_change || '');
  const [bodyFatChange, setBodyFatChange] = useState(item?.body_fat_change || '');
  const [coachNotes, setCoachNotes] = useState(item?.coach_notes || '');
  const [categoryId, setCategoryId] = useState(item?.category_id || '');
  const [featured, setFeatured] = useState(item?.featured || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      client_name: clientName,
      age: age ? parseInt(age) : null,
      duration,
      goal,
      testimonial,
      before_image_url: beforeImage || null,
      after_image_url: afterImage || null,
      weight_change: weightChange || null,
      body_fat_change: bodyFatChange || null,
      coach_notes: coachNotes || null,
      category_id: categoryId || null,
      featured,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminInput label="Client Name" value={clientName} onChange={setClientName} required />
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Age" type="number" value={age} onChange={setAge} />
        <AdminInput label="Duration" value={duration} onChange={setDuration} />
      </div>
      <AdminInput label="Goal" value={goal} onChange={setGoal} />
      <AdminTextarea label="Testimonial" value={testimonial} onChange={setTestimonial} rows={3} />
      <ImageUpload label="Before Image" value={beforeImage} onChange={setBeforeImage} aspectRatio="aspect-[3/4]" />
      <ImageUpload label="After Image" value={afterImage} onChange={setAfterImage} aspectRatio="aspect-[3/4]" />
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Weight Change" value={weightChange} onChange={setWeightChange} />
        <AdminInput label="Body Fat Change" value={bodyFatChange} onChange={setBodyFatChange} />
      </div>
      <AdminTextarea label="Coach Notes" value={coachNotes} onChange={setCoachNotes} rows={2} />
      <AdminSelect label="Category" value={categoryId} onChange={setCategoryId} options={categories.map(c => ({ value: c.id, label: c.name }))} />
      <AdminToggle label="Featured" checked={featured} onChange={setFeatured} />
      <div className="flex gap-3 pt-4">
        <AdminButton type="submit">Save</AdminButton>
        <AdminButton onClick={onCancel} variant="secondary">Cancel</AdminButton>
      </div>
    </form>
  );
}
