'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowLeft, Share2, ArrowRight } from 'lucide-react';
import { PageWrapper } from '@/components/page-wrapper';
import { FadeIn } from '@/components/animation';
import { getBlogPostBySlug, getBlogPosts } from '@/lib/data';
import type { BlogPost } from '@/lib/types';

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogPostBySlug(params.slug).then((p) => {
      setPost(p);
      setLoading(false);
      if (p) {
        getBlogPosts().then((all) => {
          setRelated(
            all
              .filter((a) => a.id !== p.id && a.category_id === p.category_id)
              .slice(0, 3)
          );
        });
      }
    });
  }, [params.slug]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      </PageWrapper>
    );
  }

  if (!post) {
    return (
      <PageWrapper>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <h1 className="font-serif text-4xl font-bold">Article Not Found</h1>
          <Link href="/blog" className="text-accent link-underline">
            Back to Blog
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <article>
        <section className="relative flex min-h-[60vh] items-end overflow-hidden pt-24">
          {post.cover_image_url && (
            <div className="absolute inset-0 z-0">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
            </div>
          )}
          <div className="relative z-10 container-wide pb-12">
            <FadeIn>
              <Link
                href="/blog"
                className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                <ArrowLeft size={14} /> Back to Blog
              </Link>
              <div className="mb-4 flex items-center gap-4">
                {post.blog_categories && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {post.blog_categories.name}
                  </span>
                )}
                {post.published_at && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={12} /> {post.reading_time} min read
                </span>
              </div>
              <h1 className="max-w-3xl text-display font-serif text-balance">{post.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground">By {post.author}</p>
            </FadeIn>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-narrow">
            <FadeIn>
              {post.excerpt && (
                <p className="mb-8 text-xl leading-relaxed text-foreground/90 font-light">
                  {post.excerpt}
                </p>
              )}
              <div className="prose-content">
                <MarkdownContent content={post.content} />
              </div>
            </FadeIn>

            <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
              <div className="flex gap-2">
                {post.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="rounded-sm bg-secondary px-3 py-1 text-xs text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: post.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent"
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-white/5 section-padding">
            <div className="container-wide">
              <h2 className="mb-8 font-serif text-2xl font-bold">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className="group overflow-hidden rounded-sm border border-border bg-card/50 transition-all hover:border-accent/40"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                      {r.cover_image_url ? (
                        <Image
                          src={r.cover_image_url}
                          alt={r.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-serif text-base font-bold transition-colors group-hover:text-accent">
                        {r.title}
                      </h3>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs text-accent">
                        Read <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </PageWrapper>
  );
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-4 space-y-2">
          {listItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-base text-foreground/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  function formatInline(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
  }

  lines.forEach((line, i) => {
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={i} className="mt-8 mb-4 font-serif text-2xl font-bold text-foreground">
          {line.slice(2)}
        </h2>
      );
    } else if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={i} className="mt-6 mb-3 font-serif text-xl font-bold text-foreground">
          {line.slice(3)}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      listItems.push(line.slice(2));
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p
          key={i}
          className="my-3 text-base leading-relaxed text-foreground/85"
          dangerouslySetInnerHTML={{ __html: formatInline(line) }}
        />
      );
    }
  });
  flushList();

  return <>{elements}</>;
}
