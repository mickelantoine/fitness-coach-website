'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, AdminInput, AdminTextarea, AdminToggle, AdminButton, AdminModal, ConfirmDialog, EmptyState, LoadingState } from '@/components/admin/ui';
import type { Package } from '@/lib/types';

export default function AdminPackages() {
  const [items, setItems] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Package | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('packages').select('*').order('display_order');
    setItems((data as Package[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (data: Record<string, unknown>) => {
    if (editItem) {
      const { error } = await supabase.from('packages').update(data).eq('id', editItem.id);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const { error } = await supabase.from('packages').insert(data);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    toast({ title: 'Saved successfully' });
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('packages').delete().eq('id', deleteId);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Deleted successfully' });
    fetchData();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Packages" action={() => { setEditItem(null); setModalOpen(true); }} actionLabel="+ Add Package" />

      {items.length === 0 ? (
        <EmptyState message="No packages yet. Click 'Add Package' to create one." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className={`rounded-sm border p-5 ${item.featured ? 'border-accent/40 bg-accent/5' : 'border-border bg-card/50'}`}>
              <div className="flex items-start justify-between">
                <h3 className="font-serif text-lg font-bold">{item.name}</h3>
                {item.featured && <span className="rounded-sm bg-accent px-2 py-0.5 text-[10px] font-bold uppercase text-accent-foreground">Popular</span>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
              <p className="mt-3 font-serif text-2xl font-bold text-accent">${item.price}</p>
              {item.duration && <p className="text-xs text-muted-foreground">{item.duration}</p>}
              <div className="mt-4 flex gap-2">
                <AdminButton onClick={() => { setEditItem(item); setModalOpen(true); }} variant="secondary">Edit</AdminButton>
                <AdminButton onClick={() => setDeleteId(item.id)} variant="danger">Delete</AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Package' : 'New Package'}>
        <PackageForm item={editItem} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      </AdminModal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Package" message="Are you sure you want to delete this package?" />
    </div>
  );
}

function PackageForm({
  item, onSave, onCancel,
}: {
  item: Package | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [price, setPrice] = useState(item?.price?.toString() || '0');
  const [duration, setDuration] = useState(item?.duration || '');
  const [sessions, setSessions] = useState(item?.sessions || '');
  const [trainingType, setTrainingType] = useState(item?.training_type || '');
  const [featuresInput, setFeaturesInput] = useState((item?.features || []).join('\n'));
  const [ctaText, setCtaText] = useState(item?.cta_text || 'Get Started');
  const [featured, setFeatured] = useState(item?.featured || false);
  const [displayOrder, setDisplayOrder] = useState(item?.display_order?.toString() || '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const features = featuresInput.split('\n').map(f => f.trim()).filter(Boolean);
    onSave({
      name,
      description: description || null,
      price: parseFloat(price) || 0,
      duration: duration || null,
      sessions: sessions || null,
      training_type: trainingType || null,
      features,
      cta_text: ctaText,
      featured,
      display_order: parseInt(displayOrder) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminInput label="Package Name" value={name} onChange={setName} required />
      <AdminTextarea label="Description" value={description} onChange={setDescription} rows={2} />
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="Price ($)" type="number" value={price} onChange={setPrice} required />
        <AdminInput label="Duration" value={duration} onChange={setDuration} placeholder="e.g. 12 weeks" />
        <AdminInput label="Sessions" value={sessions} onChange={setSessions} placeholder="e.g. 12 sessions" />
        <AdminInput label="Training Type" value={trainingType} onChange={setTrainingType} placeholder="e.g. Online" />
      </div>
      <AdminTextarea label="Features (one per line)" value={featuresInput} onChange={setFeaturesInput} rows={6} />
      <div className="grid grid-cols-2 gap-4">
        <AdminInput label="CTA Text" value={ctaText} onChange={setCtaText} />
        <AdminInput label="Display Order" type="number" value={displayOrder} onChange={setDisplayOrder} />
      </div>
      <AdminToggle label="Featured (Most Popular)" checked={featured} onChange={setFeatured} />
      <div className="flex gap-3 pt-4">
        <AdminButton type="submit">Save</AdminButton>
        <AdminButton onClick={onCancel} variant="secondary">Cancel</AdminButton>
      </div>
    </form>
  );
}
