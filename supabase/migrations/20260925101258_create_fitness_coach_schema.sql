/*
# Fitness Coach Platform - Complete Database Schema

## Overview
Creates the full relational database for a premium fitness coaching website with CMS admin panel.

## New Tables
1. `website_settings` - Site-wide configuration (logo, colors, hero, CTA, SEO, social links, contact info). Single-row table.
2. `coach_profile` - Coach biography, story, certifications, achievements, experience, statistics. Single-row table.
3. `muscle_groups` - Anatomical muscle groups for the interactive training page.
4. `exercises` - Individual exercises linked to muscle groups, with video URL, thumbnail, difficulty, equipment.
5. `transformation_categories` - Categories for transformations.
6. `transformations` - Client before/after transformations with images, testimonials, stats.
7. `blog_categories` - Blog categories.
8. `blog_posts` - Full CMS blog posts with draft/publish, featured, SEO fields, tags.
9. `packages` - Coaching packages with pricing, duration, features (JSONB array), CTA.
10. `testimonials` - Client testimonials with optional rating and images.
11. `media_library` - Centralized media tracking.
12. `contact_submissions` - Contact form submissions from the public site.
13. `general_videos` - General video content organized by category.

## Security Model
- Public website reads all content as `anon` role -> SELECT policies use `TO anon, authenticated`.
- Only authenticated admin users can create/edit/delete content -> INSERT/UPDATE/DELETE policies use `TO authenticated`.
- Contact submissions: anyone can INSERT (public form), only authenticated admin can SELECT/UPDATE/DELETE.
- RLS enabled on every table.

## Storage
- Creates a `media` storage bucket for all uploads (images, videos, thumbnails).
- Public read, authenticated write.
*/

-- ============================================================
-- 1. WEBSITE SETTINGS (single-row config table)
-- ============================================================
CREATE TABLE IF NOT EXISTS website_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_name text NOT NULL DEFAULT 'ELITE COACH',
  logo_url text,
  favicon_url text,
  primary_color text DEFAULT '#0A0A0A',
  accent_color text DEFAULT '#C9A961',
  hero_title text NOT NULL DEFAULT 'STRONGER BODY. STRONGER YOU.',
  hero_subtitle text NOT NULL DEFAULT 'Personalized coaching designed to help you build strength, confidence, and sustainable results.',
  hero_image_url text,
  primary_cta_text text NOT NULL DEFAULT 'Start Your Transformation',
  primary_cta_link text DEFAULT '/contact',
  secondary_cta_text text NOT NULL DEFAULT 'Explore Coaching',
  secondary_cta_link text DEFAULT '/packages',
  footer_text text DEFAULT 'Helping clients build stronger bodies and stronger lives.',
  seo_title text DEFAULT 'Elite Fitness Coaching | Personal Training & Transformations',
  seo_description text DEFAULT 'Premium personal fitness coaching. Transformations, training videos, nutrition guidance, and 1:1 coaching programs.',
  social_instagram text,
  social_youtube text,
  social_facebook text,
  social_twitter text,
  social_tiktok text,
  contact_email text DEFAULT 'coach@elitecoach.com',
  contact_phone text,
  contact_whatsapp text,
  contact_location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON website_settings;
CREATE POLICY "public_read_settings" ON website_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_settings" ON website_settings;
CREATE POLICY "admin_insert_settings" ON website_settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_settings" ON website_settings;
CREATE POLICY "admin_update_settings" ON website_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_settings" ON website_settings;
CREATE POLICY "admin_delete_settings" ON website_settings FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 2. COACH PROFILE (single-row table)
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Coach Name',
  title text NOT NULL DEFAULT 'Elite Fitness Coach',
  profile_image_url text,
  biography text NOT NULL DEFAULT 'Biography goes here.',
  story text,
  philosophy text,
  certifications text[] DEFAULT '{}',
  achievements text[] DEFAULT '{}',
  experience text,
  statistics jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE coach_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_coach" ON coach_profile;
CREATE POLICY "public_read_coach" ON coach_profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_coach" ON coach_profile;
CREATE POLICY "admin_insert_coach" ON coach_profile FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_coach" ON coach_profile;
CREATE POLICY "admin_update_coach" ON coach_profile FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_coach" ON coach_profile;
CREATE POLICY "admin_delete_coach" ON coach_profile FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 3. MUSCLE GROUPS
-- ============================================================
CREATE TABLE IF NOT EXISTS muscle_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE muscle_groups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_muscles" ON muscle_groups;
CREATE POLICY "public_read_muscles" ON muscle_groups FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_muscles" ON muscle_groups;
CREATE POLICY "admin_insert_muscles" ON muscle_groups FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_muscles" ON muscle_groups;
CREATE POLICY "admin_update_muscles" ON muscle_groups FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_muscles" ON muscle_groups;
CREATE POLICY "admin_delete_muscles" ON muscle_groups FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 4. EXERCISES (linked to muscle groups)
-- ============================================================
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  muscle_group_id uuid NOT NULL REFERENCES muscle_groups(id) ON DELETE CASCADE,
  description text,
  difficulty text NOT NULL DEFAULT 'Intermediate',
  equipment text,
  video_url text,
  thumbnail_url text,
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_exercises" ON exercises;
CREATE POLICY "public_read_exercises" ON exercises FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_exercises" ON exercises;
CREATE POLICY "admin_insert_exercises" ON exercises FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_exercises" ON exercises;
CREATE POLICY "admin_update_exercises" ON exercises FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_exercises" ON exercises;
CREATE POLICY "admin_delete_exercises" ON exercises FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group_id);

-- ============================================================
-- 5. TRANSFORMATION CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS transformation_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE transformation_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_trans_cats" ON transformation_categories;
CREATE POLICY "public_read_trans_cats" ON transformation_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_trans_cats" ON transformation_categories;
CREATE POLICY "admin_insert_trans_cats" ON transformation_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_trans_cats" ON transformation_categories;
CREATE POLICY "admin_update_trans_cats" ON transformation_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_trans_cats" ON transformation_categories;
CREATE POLICY "admin_delete_trans_cats" ON transformation_categories FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 6. TRANSFORMATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS transformations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  age int,
  duration text NOT NULL DEFAULT '12 weeks',
  goal text,
  testimonial text,
  before_image_url text,
  after_image_url text,
  weight_change text,
  body_fat_change text,
  coach_notes text,
  category_id uuid REFERENCES transformation_categories(id) ON DELETE SET NULL,
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_transformations" ON transformations;
CREATE POLICY "public_read_transformations" ON transformations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_transformations" ON transformations;
CREATE POLICY "admin_insert_transformations" ON transformations FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_transformations" ON transformations;
CREATE POLICY "admin_update_transformations" ON transformations FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_transformations" ON transformations;
CREATE POLICY "admin_delete_transformations" ON transformations FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_transformations_category ON transformations(category_id);

-- ============================================================
-- 7. BLOG CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_blog_cats" ON blog_categories;
CREATE POLICY "public_read_blog_cats" ON blog_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_blog_cats" ON blog_categories;
CREATE POLICY "admin_insert_blog_cats" ON blog_categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_blog_cats" ON blog_categories;
CREATE POLICY "admin_update_blog_cats" ON blog_categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_blog_cats" ON blog_categories;
CREATE POLICY "admin_delete_blog_cats" ON blog_categories FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 8. BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_image_url text,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  author text NOT NULL DEFAULT 'Coach',
  status text NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  tags text[] DEFAULT '{}',
  reading_time int DEFAULT 5,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_posts" ON blog_posts;
CREATE POLICY "public_read_published_posts" ON blog_posts FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "admin_read_all_posts" ON blog_posts;
CREATE POLICY "admin_read_all_posts" ON blog_posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_posts" ON blog_posts;
CREATE POLICY "admin_insert_posts" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_posts" ON blog_posts;
CREATE POLICY "admin_update_posts" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_posts" ON blog_posts;
CREATE POLICY "admin_delete_posts" ON blog_posts FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- ============================================================
-- 9. PACKAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  duration text,
  sessions text,
  training_type text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_text text NOT NULL DEFAULT 'Get Started',
  featured boolean NOT NULL DEFAULT false,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_packages" ON packages;
CREATE POLICY "public_read_packages" ON packages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_packages" ON packages;
CREATE POLICY "admin_insert_packages" ON packages FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_packages" ON packages;
CREATE POLICY "admin_update_packages" ON packages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_packages" ON packages;
CREATE POLICY "admin_delete_packages" ON packages FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 10. TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  profile_image_url text,
  testimonial text NOT NULL,
  transformation_image_url text,
  rating int DEFAULT 5,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_testimonials" ON testimonials;
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_testimonials" ON testimonials;
CREATE POLICY "admin_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_testimonials" ON testimonials;
CREATE POLICY "admin_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_testimonials" ON testimonials;
CREATE POLICY "admin_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 11. MEDIA LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS media_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'image',
  alt_text text,
  size_bytes bigint,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_media" ON media_library;
CREATE POLICY "public_read_media" ON media_library FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_media" ON media_library;
CREATE POLICY "admin_insert_media" ON media_library FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_media" ON media_library;
CREATE POLICY "admin_update_media" ON media_library FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_media" ON media_library;
CREATE POLICY "admin_delete_media" ON media_library FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 12. CONTACT SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_submissions" ON contact_submissions;
CREATE POLICY "public_insert_submissions" ON contact_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_submissions" ON contact_submissions;
CREATE POLICY "admin_read_submissions" ON contact_submissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_submissions" ON contact_submissions;
CREATE POLICY "admin_update_submissions" ON contact_submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_submissions" ON contact_submissions;
CREATE POLICY "admin_delete_submissions" ON contact_submissions FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 13. GENERAL VIDEOS
-- ============================================================
CREATE TABLE IF NOT EXISTS general_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  category text,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE general_videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_videos" ON general_videos;
CREATE POLICY "public_read_videos" ON general_videos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_videos" ON general_videos;
CREATE POLICY "admin_insert_videos" ON general_videos FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_videos" ON general_videos;
CREATE POLICY "admin_update_videos" ON general_videos FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_videos" ON general_videos;
CREATE POLICY "admin_delete_videos" ON general_videos FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_media_bucket" ON storage.objects;
CREATE POLICY "public_read_media_bucket" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_insert_media_bucket" ON storage.objects;
CREATE POLICY "auth_insert_media_bucket" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_update_media_bucket" ON storage.objects;
CREATE POLICY "auth_update_media_bucket" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "auth_delete_media_bucket" ON storage.objects;
CREATE POLICY "auth_delete_media_bucket" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'media');

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default website settings
INSERT INTO website_settings (brand_name, hero_title, hero_subtitle)
VALUES (
  'ALEX STONE',
  'STRONGER BODY. STRONGER YOU.',
  'Personalized coaching designed to help you build strength, confidence, and sustainable results.'
)
ON CONFLICT DO NOTHING;

-- Default coach profile
INSERT INTO coach_profile (name, title, biography, story, philosophy, certifications, achievements, experience, statistics)
VALUES (
  'Alex Stone',
  'Elite Fitness Coach & Transformation Specialist',
  'With over 15 years of experience in the fitness industry, Alex Stone has helped hundreds of clients achieve dramatic physical transformations. Her coaching philosophy blends evidence-based training science with personalized programming to deliver sustainable, life-changing results.',
  'Alex''s journey began as a competitive athlete, where she discovered her passion for understanding the human body''s potential. After earning her certifications in strength conditioning and nutrition coaching, she dedicated herself to helping others unlock their own transformation — not just physically, but mentally and emotionally.',
  'True transformation is not about quick fixes. It is about building a foundation of strength, consistency, and self-belief that lasts a lifetime. Every program I design is rooted in science, tailored to the individual, and built for sustainable progress.',
  ARRAY['NASM Certified Personal Trainer', 'Precision Nutrition Level 1 Coach', 'NSCA Strength & Conditioning Specialist', 'Functional Movement Systems (FMS) Certified'],
  ARRAY['15+ Years Coaching Experience', '500+ Client Transformations', 'Featured in Men''s Health & Women''s Health', 'Speaker at Fitness Industry Conferences'],
  '15 years of dedicated coaching experience, working with clients ranging from beginners to competitive athletes.',
  '[{"label": "Years of Experience", "value": 15}, {"label": "Clients Coached", "value": 500}, {"label": "Transformations", "value": 320}, {"label": "Certifications", "value": 4}]'::jsonb
)
ON CONFLICT DO NOTHING;

-- Muscle groups
INSERT INTO muscle_groups (name, slug, description, display_order) VALUES
  ('Chest', 'chest', 'Pectoral muscle group', 1),
  ('Shoulders', 'shoulders', 'Deltoid muscle group', 2),
  ('Biceps', 'biceps', 'Bicep brachii', 3),
  ('Triceps', 'triceps', 'Tricep brachii', 4),
  ('Forearms', 'forearms', 'Forearm muscles', 5),
  ('Abs', 'abs', 'Abdominal muscles', 6),
  ('Obliques', 'obliques', 'Oblique muscles', 7),
  ('Back', 'back', 'Latissimus dorsi and trapezius', 8),
  ('Glutes', 'glutes', 'Gluteal muscles', 9),
  ('Quadriceps', 'quadriceps', 'Quadricep muscles', 10),
  ('Hamstrings', 'hamstrings', 'Hamstring muscles', 11),
  ('Calves', 'calves', 'Calf muscles', 12)
ON CONFLICT (slug) DO NOTHING;

-- Transformation categories
INSERT INTO transformation_categories (name, slug) VALUES
  ('Fat Loss', 'fat-loss'),
  ('Muscle Gain', 'muscle-gain'),
  ('Body Recomposition', 'body-recomposition'),
  ('Strength', 'strength'),
  ('Lifestyle Transformation', 'lifestyle')
ON CONFLICT (slug) DO NOTHING;

-- Blog categories
INSERT INTO blog_categories (name, slug) VALUES
  ('Training', 'training'),
  ('Nutrition', 'nutrition'),
  ('Fat Loss', 'fat-loss'),
  ('Muscle Building', 'muscle-building'),
  ('Recovery', 'recovery'),
  ('Lifestyle', 'lifestyle'),
  ('Motivation', 'motivation')
ON CONFLICT (slug) DO NOTHING;

-- Packages
INSERT INTO packages (name, description, price, duration, sessions, training_type, features, cta_text, featured, display_order) VALUES
  (
    'Online Coaching',
    'Personalized online coaching program with weekly check-ins and custom programming.',
    199.00,
    'Monthly',
    'Unlimited messaging',
    'Online',
    '["Custom workout program", "Nutrition guidance", "Weekly video check-ins", "Progress tracking", "24/7 messaging support"]'::jsonb,
    'Get Started',
    false,
    1
  ),
  (
    'Transformation Program',
    'Complete 12-week transformation program designed for dramatic, sustainable results.',
    1499.00,
    '12 weeks',
    '12 sessions',
    'Hybrid',
    '["Full assessment & goal setting", "Custom training & nutrition plan", "Bi-weekly 1:1 sessions", "Progress photos & measurements", "Supplement guidance", "Lifetime access to resources"]'::jsonb,
    'Start Your Transformation',
    true,
    2
  ),
  (
    '1:1 Personal Training',
    'In-person personal training sessions with individualized programming and hands-on coaching.',
    120.00,
    'Per session',
    '1 session',
    'In-Person',
    '["1:1 in-person training", "Form correction & coaching", "Custom programming", "Nutrition basics", "Flexible scheduling"]'::jsonb,
    'Book a Session',
    false,
    3
  )
ON CONFLICT DO NOTHING;

-- Sample testimonials
INSERT INTO testimonials (client_name, testimonial, rating, display_order) VALUES
  ('Sarah M.', 'Working with Alex completely changed my relationship with fitness. I lost 30 pounds and gained strength I never knew I had. The personalized approach made all the difference.', 5, 1),
  ('James T.', 'I went from struggling to do a single pull-up to completing 15 in a set. Alex''s programming is science-backed and incredibly effective. Best investment I''ve made in myself.', 5, 2),
  ('Maria L.', 'After years of yo-yo dieting, Alex helped me build sustainable habits. I''m in the best shape of my life at 42 and finally enjoy working out.', 5, 3)
ON CONFLICT DO NOTHING;

-- Sample blog posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, status, featured, tags, reading_time, published_at, seo_title, seo_description) VALUES
  (
    'The Science of Progressive Overload: Why It Works',
    'science-of-progressive-overload',
    'Progressive overload is the single most important principle for building muscle and strength. Here is why it works and how to apply it.',
    '# The Science of Progressive Overload

Progressive overload is the foundation of all strength and muscle building. The principle is simple: to make progress, you must gradually increase the demands on your muscles over time.

## What Is Progressive Overload?

Progressive overload means systematically increasing one or more training variables — weight, reps, sets, or frequency — to continually challenge your muscles. Without this progression, your body adapts and progress stalls.

## How to Apply It

1. **Increase weight** — Add 2.5-5 lbs to your lifts each week
2. **Increase reps** — Add 1-2 reps per set
3. **Increase sets** — Add an extra working set
4. **Decrease rest** — Shorten rest periods between sets

## Why It Works

Your body responds to stress by adapting. When you lift heavier weights, your muscle fibers experience micro-tears. During recovery, your body repairs these fibers stronger than before. This is the fundamental mechanism of muscle growth.

## Common Mistakes

- Increasing weight too fast and sacrificing form
- Not tracking progress systematically
- Ignoring deload weeks
- Focusing only on one variable

Start small, track everything, and be patient. Progressive overload is a marathon, not a sprint.',
    'Alex Stone',
    'published',
    true,
    ARRAY['training', 'strength', 'muscle-building'],
    6,
    now(),
    'The Science of Progressive Overload | Alex Stone Fitness',
    'Learn the science behind progressive overload and how to apply it for maximum muscle and strength gains.'
  ),
  (
    'Nutrition Fundamentals: Building a Sustainable Diet',
    'nutrition-fundamentals',
    'No transformation is complete without solid nutrition. Here are the fundamental principles I teach every client.',
    '# Nutrition Fundamentals

Nutrition is the other half of the transformation equation. You cannot out-train a bad diet, but you also do not need to eat chicken and broccoli for every meal.

## The 80/20 Rule

Aim to eat whole, nutrient-dense foods 80% of the time. The remaining 20% gives you flexibility for social events, treats, and life. This approach is sustainable long-term.

## Protein: The King of Macros

Protein is essential for muscle repair and growth. Aim for 0.8-1g per pound of body weight. Good sources include:

- Lean meats (chicken, turkey, beef)
- Fish and seafood
- Eggs
- Greek yogurt
- Plant-based options (tofu, tempeh, legumes)

## Hydration

Water impacts everything from performance to recovery. Drink at least 80-100 oz per day, more on training days.

## Meal Timing

While total daily intake matters most, timing can optimize performance. Eat a balanced meal 1-2 hours before training and consume protein within 2 hours after.

Remember: consistency beats perfection. Build habits you can maintain for years, not days.',
    'Alex Stone',
    'published',
    false,
    ARRAY['nutrition', 'fat-loss', 'lifestyle'],
    5,
    now(),
    'Nutrition Fundamentals | Alex Stone Fitness',
    'The core nutrition principles every client needs to know for sustainable transformation.'
  ),
  (
    'Recovery: The Missing Piece in Your Training',
    'recovery-missing-piece',
    'Most people train hard but recover poorly. Here is how to optimize recovery for better results.',
    '# Recovery: The Missing Piece

Training breaks your body down. Recovery is when you build back stronger. Yet most people focus entirely on the training side and neglect recovery.

## Sleep: The Ultimate Performance Enhancer

7-9 hours of quality sleep is non-negotiable. During deep sleep, your body releases growth hormone, repairs muscle tissue, and consolidates motor learning.

## Active Recovery

Light movement on rest days — walking, stretching, or easy cycling — increases blood flow and speeds recovery without adding stress.

## Deload Weeks

Every 4-6 weeks, reduce training volume by 40-60% for one week. This gives your body a chance to fully recover and supercompensate.

## Stress Management

Physical stress from training and mental stress from life share the same recovery resources. Manage both for optimal results.

Recovery is not laziness — it is strategy. Train hard, recover harder.',
    'Alex Stone',
    'published',
    false,
    ARRAY['recovery', 'lifestyle'],
    4,
    now(),
    'Recovery: The Missing Piece | Alex Stone Fitness',
    'Why recovery is the key to unlocking your training results.'
  )
ON CONFLICT (slug) DO NOTHING;

-- Sample exercises for chest
INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Bench Press', id, 'Compound chest exercise targeting pectorals, shoulders, and triceps.', 'Intermediate', 'Barbell, Bench', 1 FROM muscle_groups WHERE slug = 'chest'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Incline Dumbbell Press', id, 'Upper chest focused press with dumbbells on an incline bench.', 'Beginner', 'Dumbbells, Incline Bench', 2 FROM muscle_groups WHERE slug = 'chest'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Cable Fly', id, 'Isolation exercise for chest using cable machine.', 'Beginner', 'Cable Machine', 3 FROM muscle_groups WHERE slug = 'chest'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Push-Up', id, 'Bodyweight chest exercise that can be done anywhere.', 'Beginner', 'Bodyweight', 4 FROM muscle_groups WHERE slug = 'chest'
ON CONFLICT DO NOTHING;

-- Sample exercises for back
INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Pull-Up', id, 'Bodyweight back exercise targeting lats and upper back.', 'Advanced', 'Pull-Up Bar', 1 FROM muscle_groups WHERE slug = 'back'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Bent-Over Row', id, 'Compound back exercise with barbell for lats and rhomboids.', 'Intermediate', 'Barbell', 2 FROM muscle_groups WHERE slug = 'back'
ON CONFLICT DO NOTHING;

-- Sample exercises for biceps
INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Barbell Curl', id, 'Classic bicep isolation exercise with barbell.', 'Beginner', 'Barbell', 1 FROM muscle_groups WHERE slug = 'biceps'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Hammer Curl', id, 'Bicep and forearm exercise with neutral grip.', 'Beginner', 'Dumbbells', 2 FROM muscle_groups WHERE slug = 'biceps'
ON CONFLICT DO NOTHING;

-- Sample exercises for shoulders
INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Overhead Press', id, 'Compound shoulder press targeting all deltoid heads.', 'Intermediate', 'Barbell', 1 FROM muscle_groups WHERE slug = 'shoulders'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Lateral Raise', id, 'Isolation exercise for lateral deltoid head.', 'Beginner', 'Dumbbells', 2 FROM muscle_groups WHERE slug = 'shoulders'
ON CONFLICT DO NOTHING;

-- Sample exercises for legs
INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Barbell Squat', id, 'King of leg exercises targeting quadriceps, glutes, and hamstrings.', 'Intermediate', 'Barbell', 1 FROM muscle_groups WHERE slug = 'quadriceps'
ON CONFLICT DO NOTHING;

INSERT INTO exercises (name, muscle_group_id, description, difficulty, equipment, display_order)
SELECT 'Romanian Deadlift', id, 'Hamstring-focused deadlift variation.', 'Intermediate', 'Barbell', 1 FROM muscle_groups WHERE slug = 'hamstrings'
ON CONFLICT DO NOTHING;

-- General videos
INSERT INTO general_videos (title, description, video_url, category, display_order) VALUES
  ('Full Body Warm-Up Routine', '5-minute dynamic warm-up to prepare your body for training.', '', 'Warm-Up', 1),
  ('Mobility for Lifters', 'Key mobility drills to improve your squat, press, and deadlift.', '', 'Mobility', 2),
  ('Nutrition Q&A', 'Answering the most common nutrition questions from clients.', '', 'Education', 3)
ON CONFLICT DO NOTHING;