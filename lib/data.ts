import { supabase } from './supabase/client';
import type {
  WebsiteSettings,
  CoachProfile,
  MuscleGroup,
  Exercise,
  Transformation,
  TransformationCategory,
  BlogPost,
  BlogCategory,
  Package,
  Testimonial,
  GeneralVideo,
} from './types';

export async function getWebsiteSettings(): Promise<WebsiteSettings | null> {
  const { data } = await supabase
    .from('website_settings')
    .select('*')
    .limit(1)
    .maybeSingle();
  return data as WebsiteSettings | null;
}

export async function getCoachProfile(): Promise<CoachProfile | null> {
  const { data } = await supabase
    .from('coach_profile')
    .select('*')
    .limit(1)
    .maybeSingle();
  return data as CoachProfile | null;
}

export async function getMuscleGroups(): Promise<MuscleGroup[]> {
  const { data } = await supabase
    .from('muscle_groups')
    .select('*')
    .order('display_order', { ascending: true });
  return data as MuscleGroup[] || [];
}

export async function getExercisesByMuscleGroup(muscleGroupId: string): Promise<Exercise[]> {
  const { data } = await supabase
    .from('exercises')
    .select('*, muscle_groups(*)')
    .eq('muscle_group_id', muscleGroupId)
    .order('display_order', { ascending: true });
  return data as Exercise[] || [];
}

export async function getAllExercises(): Promise<Exercise[]> {
  const { data } = await supabase
    .from('exercises')
    .select('*, muscle_groups(*)')
    .order('display_order', { ascending: true });
  return data as Exercise[] || [];
}

export async function getTransformationCategories(): Promise<TransformationCategory[]> {
  const { data } = await supabase
    .from('transformation_categories')
    .select('*')
    .order('name');
  return data as TransformationCategory[] || [];
}

export async function getTransformations(categorySlug?: string): Promise<Transformation[]> {
  let query = supabase
    .from('transformations')
    .select('*, transformation_categories(*)')
    .order('display_order', { ascending: true });

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('transformation_categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  const { data } = await query;
  return data as Transformation[] || [];
}

export async function getFeaturedTransformations(): Promise<Transformation[]> {
  const { data } = await supabase
    .from('transformations')
    .select('*, transformation_categories(*)')
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .limit(6);
  return data as Transformation[] || [];
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  const { data } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');
  return data as BlogCategory[] || [];
}

export async function getBlogPosts(categorySlug?: string): Promise<BlogPost[]> {
  let query = supabase
    .from('blog_posts')
    .select('*, blog_categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (categorySlug) {
    const { data: cat } = await supabase
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .maybeSingle();
    if (cat) {
      query = query.eq('category_id', cat.id);
    }
  }

  const { data } = await query;
  return data as BlogPost[] || [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  return data as BlogPost | null;
}

export async function getFeaturedBlogPost(): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(*)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return data as BlogPost | null;
}

export async function getPackages(): Promise<Package[]> {
  const { data } = await supabase
    .from('packages')
    .select('*')
    .order('display_order', { ascending: true });
  return data as Package[] || [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });
  return data as Testimonial[] || [];
}

export async function getGeneralVideos(): Promise<GeneralVideo[]> {
  const { data } = await supabase
    .from('general_videos')
    .select('*')
    .order('display_order', { ascending: true });
  return data as GeneralVideo[] || [];
}

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<boolean> {
  const { error } = await supabase
    .from('contact_submissions')
    .insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      message: formData.message,
    });
  return !error;
}
