'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Dumbbell, FileText, Package, Video, Image as ImageIcon, Mail, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { LoadingState } from '@/components/admin/ui';

interface DashboardStats {
  transformations: number;
  exercises: number;
  blogPosts: number;
  packages: number;
  testimonials: number;
  videos: number;
  media: number;
  messages: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<{ id: string; name: string; email: string; created_at: string }[]>([]);

  useEffect(() => {
    async function load() {
      const [trans, ex, blog, pkg, test, vid, med, msg] = await Promise.all([
        supabase.from('transformations').select('*', { count: 'exact', head: true }),
        supabase.from('exercises').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('packages').select('*', { count: 'exact', head: true }),
        supabase.from('testimonials').select('*', { count: 'exact', head: true }),
        supabase.from('general_videos').select('*', { count: 'exact', head: true }),
        supabase.from('media_library').select('*', { count: 'exact', head: true }),
        supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        transformations: trans.count || 0,
        exercises: ex.count || 0,
        blogPosts: blog.count || 0,
        packages: pkg.count || 0,
        testimonials: test.count || 0,
        videos: vid.count || 0,
        media: med.count || 0,
        messages: msg.count || 0,
      });

      const { data: messages } = await supabase
        .from('contact_submissions')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentMessages(messages || []);
    }
    load();
  }, []);

  if (!stats) return <LoadingState />;

  const cards = [
    { label: 'Transformations', value: stats.transformations, icon: Users, href: '/admin/transformations' },
    { label: 'Exercises', value: stats.exercises, icon: Dumbbell, href: '/admin/exercises' },
    { label: 'Blog Posts', value: stats.blogPosts, icon: FileText, href: '/admin/blog' },
    { label: 'Packages', value: stats.packages, icon: Package, href: '/admin/packages' },
    { label: 'Testimonials', value: stats.testimonials, icon: Users, href: '/admin/testimonials' },
    { label: 'Video Content', value: stats.videos, icon: Video, href: '/admin/videos' },
    { label: 'Media Files', value: stats.media, icon: ImageIcon, href: '/admin/media' },
    { label: 'Messages', value: stats.messages, icon: Mail, href: '/admin/messages' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your website content</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-sm border border-border bg-card/50 p-5 transition-all hover:border-accent/40"
            >
              <div className="flex items-center justify-between">
                <Icon size={20} className="text-accent" />
                <span className="font-serif text-3xl font-bold">{card.value}</span>
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {card.label}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 rounded-sm border border-border bg-card/50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-accent" />
          <h2 className="font-serif text-lg font-bold">Recent Messages</h2>
        </div>
        {recentMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <Link
                key={msg.id}
                href="/admin/messages"
                className="flex items-center justify-between rounded-sm border border-border bg-background/50 p-3 transition-all hover:border-accent/40"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{msg.name}</p>
                  <p className="text-xs text-muted-foreground">{msg.email}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
