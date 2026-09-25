'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminButton, AdminModal, ConfirmDialog, EmptyState, LoadingState } from '@/components/admin/ui';
import { ImageUpload, VideoUrlInput } from '@/components/admin/image-upload';
import type { Exercise, MuscleGroup } from '@/lib/types';

export default function AdminExercises() {
  const [items, setItems] = useState<Exercise[]>([]);
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Exercise | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [{ data: ex }, { data: mg }] = await Promise.all([
      supabase.from('exercises').select('*, muscle_groups(*)').order('display_order'),
      supabase.from('muscle_groups').select('*').order('display_order'),
    ]);
    setItems((ex as Exercise[]) || []);
    setMuscleGroups((mg as MuscleGroup[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (data: Record<string, unknown>) => {
    if (editItem) {
      const { error } = await supabase.from('exercises').update(data).eq('id', editItem.id);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const { error } = await supabase.from('exercises').insert(data);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    toast({ title: 'Saved successfully' });
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('exercises').delete().eq('id', deleteId);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Deleted successfully' });
    fetchData();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Exercises" action={() => { setEditItem(null); setModalOpen(true); }} actionLabel="+ Add Exercise" />

      {items.length === 0 ? (
        <EmptyState message="No exercises yet. Click 'Add Exercise' to create one." />
      ) : (
        <div className="overflow-hidden rounded-sm border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Exercise</th>
                <th className="px-4 py-3 text-left font-semibold">Muscle Group</th>
                <th className="px-4 py-3 text-left font-semibold">Difficulty</th>
                <th className="px-4 py-3 text-left font-semibold">Featured</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {item.thumbnail_url ? (
                        <div className="relative h-10 w-14 overflow-hidden rounded-sm bg-secondary">
                          <Image src={item.thumbnail_url} alt={item.name} fill className="object-cover" sizes="56px" />
                        </div>
                      ) : null}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.muscle_groups?.name || '-'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.difficulty}</td>
                  <td className="px-4 py-3">{item.featured ? <span className="text-accent">Yes</span> : <span className="text-muted-foreground">No</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-xs text-accent hover:underline">Edit</button>
                      <button onClick={() => setDeleteId(item.id)} className="text-xs text-destructive hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Exercise' : 'New Exercise'}>
        <ExerciseForm item={editItem} muscleGroups={muscleGroups} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      </AdminModal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Exercise" message="Are you sure you want to delete this exercise?" />
    </div>
  );
}

function ExerciseForm({
  item, muscleGroups, onSave, onCancel,
}: {
  item: Exercise | null;
  muscleGroups: MuscleGroup[];
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(item?.name || '');
  const [muscleGroupId, setMuscleGroupId] = useState(item?.muscle_group_id || '');
  const [description, setDescription] = useState(item?.description || '');
  const [difficulty, setDifficulty] = useState(item?.difficulty || 'Intermediate');
  const [equipment, setEquipment] = useState(item?.equipment || '');
  const [videoUrl, setVideoUrl] = useState(item?.video_url || '');
  const [thumbnailUrl, setThumbnailUrl] = useState(item?.thumbnail_url || '');
  const [featured, setFeatured] = useState(item?.featured || false);
  const [displayOrder, setDisplayOrder] = useState(item?.display_order?.toString() || '0');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      muscle_group_id: muscleGroupId,
      description: description || null,
      difficulty,
      equipment: equipment || null,
      video_url: videoUrl || null,
      thumbnail_url: thumbnailUrl || null,
      featured,
      display_order: parseInt(displayOrder) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminInput label="Exercise Name" value={name} onChange={setName} required />
      <AdminSelect label="Muscle Group" value={muscleGroupId} onChange={setMuscleGroupId} options={muscleGroups.map(mg => ({ value: mg.id, label: mg.name }))} required />
      <AdminTextarea label="Description" value={description} onChange={setDescription} rows={3} />
      <AdminSelect label="Difficulty" value={difficulty} onChange={setDifficulty} options={[
        { value: 'Beginner', label: 'Beginner' },
        { value: 'Intermediate', label: 'Intermediate' },
        { value: 'Advanced', label: 'Advanced' },
      ]} />
      <AdminInput label="Equipment" value={equipment} onChange={setEquipment} placeholder="e.g. Barbell, Dumbbells" />
      <ImageUpload label="Thumbnail" value={thumbnailUrl} onChange={setThumbnailUrl} />
      <VideoUrlInput label="Video URL" value={videoUrl} onChange={setVideoUrl} />
      <AdminInput label="Display Order" type="number" value={displayOrder} onChange={setDisplayOrder} />
      <AdminToggle label="Featured" checked={featured} onChange={setFeatured} />
      <div className="flex gap-3 pt-4">
        <AdminButton type="submit">Save</AdminButton>
        <AdminButton onClick={onCancel} variant="secondary">Cancel</AdminButton>
      </div>
    </form>
  );
}
