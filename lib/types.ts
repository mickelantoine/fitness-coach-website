export interface WebsiteSettings {
  id: string;
  brand_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  accent_color: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image_url: string | null;
  primary_cta_text: string;
  primary_cta_link: string;
  secondary_cta_text: string;
  secondary_cta_link: string;
  footer_text: string;
  seo_title: string;
  seo_description: string;
  social_instagram: string | null;
  social_youtube: string | null;
  social_facebook: string | null;
  social_twitter: string | null;
  social_tiktok: string | null;
  contact_email: string;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  contact_location: string | null;
}

export interface CoachStatistic {
  label: string;
  value: number;
}

export interface CoachProfile {
  id: string;
  name: string;
  title: string;
  profile_image_url: string | null;
  biography: string;
  story: string | null;
  philosophy: string | null;
  certifications: string[];
  achievements: string[];
  experience: string | null;
  statistics: CoachStatistic[];
}

export interface MuscleGroup {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_group_id: string;
  description: string | null;
  difficulty: string;
  equipment: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  featured: boolean;
  display_order: number;
  muscle_groups?: MuscleGroup;
}

export interface TransformationCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Transformation {
  id: string;
  client_name: string;
  age: number | null;
  duration: string;
  goal: string | null;
  testimonial: string | null;
  before_image_url: string | null;
  after_image_url: string | null;
  weight_change: string | null;
  body_fat_change: string | null;
  coach_notes: string | null;
  category_id: string | null;
  featured: boolean;
  display_order: number;
  transformation_categories?: TransformationCategory;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  author: string;
  status: string;
  featured: boolean;
  tags: string[];
  reading_time: number;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  blog_categories?: BlogCategory;
}

export interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: string | null;
  sessions: string | null;
  training_type: string | null;
  features: string[];
  cta_text: string;
  featured: boolean;
  display_order: number;
}

export interface Testimonial {
  id: string;
  client_name: string;
  profile_image_url: string | null;
  testimonial: string;
  transformation_image_url: string | null;
  rating: number;
  display_order: number;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  type: string;
  alt_text: string | null;
  size_bytes: number | null;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
}

export interface GeneralVideo {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  thumbnail_url: string | null;
  category: string | null;
  display_order: number;
}
