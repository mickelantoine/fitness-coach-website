'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminButton, AdminModal, ConfirmDialog, EmptyState, LoadingState } from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/image-upload';
import type { BlogPost, BlogCategory } from '@/lib/types';

export default function AdminBlog() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<BlogPost | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [{ data: posts }, { data: cats }] = await Promise.all([
      supabase.from('blog_posts').select('*, blog_categories(*)').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*').order('name'),
    ]);
    setItems((posts as BlogPost[]) || []);
    setCategories((cats as BlogCategory[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (data: Record<string, unknown>) => {
    if (editItem) {
      const { error } = await supabase.from('blog_posts').update(data).eq('id', editItem.id);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      const { error } = await supabase.from('blog_posts').insert(data);
      if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
    toast({ title: 'Saved successfully' });
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', deleteId);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    toast({ title: 'Deleted successfully' });
    fetchData();
  };

  if (loading) return <LoadingState />;

  return (
    <div>
      <PageHeader title="Blog Posts" action={() => { setEditItem(null); setModalOpen(true); }} actionLabel="+ New Post" />

      {items.length === 0 ? (
        <EmptyState message="No blog posts yet. Click 'New Post' to create one." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-sm border border-border bg-card/50 p-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-sm bg-secondary">
                {item.cover_image_url ? (
                  <Image src={item.cover_image_url} alt={item.title} fill className="object-cover" sizes="96px" />
                ) : null}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  {item.blog_categories && <span>{item.blog_categories.name}</span>}
                  <span className={`rounded-sm px-2 py-0.5 ${item.status === 'published' ? 'bg-accent/20 text-accent' : 'bg-secondary'}`}>
                    {item.status}
                  </span>
                  {item.featured && <span className="text-accent">Featured</span>}
                  <span>{item.reading_time} min</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditItem(item); setModalOpen(true); }} className="text-xs text-accent hover:underline">Edit</button>
                <button onClick={() => setDeleteId(item.id)} className="text-xs text-destructive hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminModal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Post' : 'New Post'}>
        <BlogForm item={editItem} categories={categories} onSave={handleSave} onCancel={() => setModalOpen(false)} />
      </AdminModal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Post" message="Are you sure you want to delete this blog post?" />
    </div>
  );
}

function BlogForm({
  item, categories, onSave, onCancel,
}: {
  item: BlogPost | null;
  categories: BlogCategory[];
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(item?.title || '');
  const [slug, setSlug] = useState(item?.slug || '');
  const [excerpt, setExcerpt] = useState(item?.excerpt || '');
  const [content, setContent] = useState(item?.content || '');
  const [coverImage, setCoverImage] = useState(item?.cover_image_url || '');
  const [categoryId, setCategoryId] = useState(item?.category_id || '');
  const [author, setAuthor] = useState(item?.author || 'Alex Stone');
  const [status, setStatus] = useState(item?.status || 'draft');
  const [featured, setFeatured] = useState(item?.featured || false);
  const [tagsInput, setTagsInput] = useState((item?.tags || []).join(', '));
  const [readingTime, setReadingTime] = useState(item?.reading_time?.toString() || '5');
  const [seoTitle, setSeoTitle] = useState(item?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(item?.seo_description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const data: Record<string, unknown> = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      excerpt: excerpt || null,
      content,
      cover_image_url: coverImage || null,
      category_id: categoryId || null,
      author,
      status,
      featured,
      tags,
      reading_time: parseInt(readingTime) || 5,
      seo_title: seoTitle || null,
      seo_description: seoDescription || null,
    };
    if (status === 'published' && !item?.published_at) {
      data.published_at = new Date().toISOString();
    }
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AdminInput label="Title" value={title} onChange={setTitle} required />
      <AdminInput label="Slug (URL)" value={slug} onChange={setSlug} placeholder="auto-generated from title" />
      <AdminTextarea label="Excerpt" value={excerpt} onChange={setExcerpt} rows={2} />
      <AdminTextarea label="Content (Markdown supported)" value={content} onChange={setContent} rows={10} />
      <ImageUpload label="Cover Image" value={coverImage} onChange={setCoverImage} />
      <AdminSelect label="Category" value={categoryId} onChange={setCategoryId} options={categories.map(c => ({ value: c.id, label: c.name }))} />
      <AdminInput label="Author" value={author} onChange={setAuthor} />
      <AdminInput label="Tags (comma separated)" value={tagsInput} onChange={setTagsInput} />
      <div className="grid grid-cols-2 gap-4">
        <AdminSelect label="Status" value={status} onChange={setStatus} options={[
          { value: 'draft', label: 'Draft' },
          { value: 'published', label: 'Published' },
        ]} />
        <AdminInput label="Reading Time (min)" type="number" value={readingTime} onChange={setReadingTime} />
      </div>
      <AdminToggle label="Featured Post" checked={featured} onChange={setFeatured} />
      <AdminInput label="SEO Title" value={seoTitle} onChange={setSeoTitle} />
      <AdminTextarea label="SEO Description" value={seoDescription} onChange={setSeoDescription} rows={2} />
      <div className="flex gap-3 pt-4">
        <AdminButton type="submit">Save</AdminButton>
        <AdminButton onClick={onCancel} variant="secondary">Cancel</AdminButton>
      </div>
    </form>
  );
}
