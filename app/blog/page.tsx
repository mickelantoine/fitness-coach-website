'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowRight, Calendar, Clock } from 'lucide-react';
import { PageWrapper } from '@/components/page-wrapper';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/animation';
import { getBlogPosts, getBlogCategories, getFeaturedBlogPost } from '@/lib/data';
import type { BlogPost, BlogCategory } from '@/lib/types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [featured, setFeatured] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    getBlogCategories().then(setCategories);
    getFeaturedBlogPost().then(setFeatured);
  }, []);

  useEffect(() => {
    getBlogPosts(activeCategory || undefined).then(setPosts);
    setVisibleCount(6);
  }, [activeCategory]);

  const filtered = search
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  const visiblePosts = filtered.filter((p) => !featured || p.id !== featured.id);
  const displayed = visiblePosts.slice(0, visibleCount);

  return (
    <PageWrapper>
      <section className="relative flex min-h-[40vh] items-end overflow-hidden pt-24">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card to-background" />
        <div className="relative z-10 container-wide pb-12">
          <FadeIn>
            <p className="eyebrow mb-4">Knowledge Hub</p>
            <h1 className="text-display font-serif text-balance">The Blog</h1>
            <p className="mt-4 max-w-xl text-subheading">
              Training tips, nutrition science, recovery strategies, and motivation to fuel your journey.
            </p>
          </FadeIn>
        </div>
      </section>

      {featured && (
        <section className="section-padding pb-0">
          <div className="container-wide">
            <FadeIn>
              <Link href={`/blog/${featured.slug}`} className="group grid gap-8 lg:grid-cols-2 lg:items-center">
                <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-card">
                  {featured.cover_image_url ? (
                    <Image
                      src={featured.cover_image_url}
                      alt={featured.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary">
                      <span className="font-serif text-6xl text-accent/20">Featured</span>
                    </div>
                  )}
                  <span className="absolute top-4 left-4 rounded-sm bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                    Featured
                  </span>
                </div>
                <div>
                  <div className="mb-3 flex items-center gap-3">
                    {featured.blog_categories && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {featured.blog_categories.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} /> {featured.reading_time} min read
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl font-bold transition-colors group-hover:text-accent md:text-4xl">
                    {featured.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {featured.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                    Read Article
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      <section className="section-padding">
        <div className="container-wide">
          <FadeIn className="mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={`rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                    !activeCategory
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
                      activeCategory === cat.slug
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
              <div className="relative md:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-sm border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                />
              </div>
            </div>
          </FadeIn>

          {displayed.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No articles found.</p>
            </div>
          ) : (
            <>
              <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {displayed.map((post) => (
                  <StaggerItem key={post.id}>
                    <BlogCard post={post} />
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {visibleCount < visiblePosts.length && (
                <div className="mt-12 text-center">
                  <button
                    onClick={() => setVisibleCount(visibleCount + 6)}
                    className="rounded-sm border border-accent/50 px-8 py-3 text-sm font-semibold text-accent transition-all hover:bg-accent hover:text-accent-foreground"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card/50 transition-all duration-300 hover:border-accent/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-serif text-4xl text-accent/20">A</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-3">
          {post.blog_categories && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
              {post.blog_categories.name}
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Clock size={10} /> {post.reading_time} min
          </span>
        </div>
        <h3 className="font-serif text-lg font-bold leading-snug transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-4">
          <span className="text-xs font-medium text-accent">Read more →</span>
        </div>
      </div>
    </Link>
  );
}
