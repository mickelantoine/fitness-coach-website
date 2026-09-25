'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ArrowRight, Star, Quote, Dumbbell, TrendingUp, Award } from 'lucide-react';
import { PageWrapper } from '@/components/page-wrapper';
import {
  Parallax,
  ParallaxLayer,
  FadeIn,
  TextReveal,
  ImageReveal,
  StaggerContainer,
  StaggerItem,
  MouseParallax,
  MagneticButton,
  TiltCard,
} from '@/components/animation';
import { TransformationCard } from '@/components/transformation-card';
import {
  getCoachProfile,
  getFeaturedTransformations,
  getPackages,
  getTestimonials,
  getFeaturedBlogPost,
} from '@/lib/data';
import type {
  CoachProfile,
  Transformation,
  Package,
  Testimonial,
  BlogPost,
} from '@/lib/types';

const HERO_IMAGE = 'https://images.pexels.com/photos/4753884/pexels-photo-4753884.jpeg?auto=compress&cs=tinysrgb&w=1600';
const COACH_IMAGE = 'https://images.pexels.com/photos/14055666/pexels-photo-14055666.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function Home() {
  return (
    <PageWrapper>
      <HeroSection />
      <CoachStorySection />
      <StatsSection />
      <TransformationsPreview />
      <PackagesPreview />
      <TestimonialsSection />
      <BlogPreview />
      <CTASection />
    </PageWrapper>
  );
}

function HeroSection() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, reduceMotion ? 0 : 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, reduceMotion ? 1 : 0.5]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, reduceMotion ? 1 : 1.1]);

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      {/* Background image with scroll parallax + mouse parallax */}
      <motion.div style={{ y, opacity, scale }} className="absolute inset-0 z-0">
        <MouseParallax strength={25} className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Fitness training"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </MouseParallax>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/65 to-background" />
        <div className="absolute inset-0 hero-grain opacity-30" />
      </motion.div>

      {/* Floating accent shapes with mouse parallax */}
      <MouseParallax strength={40} className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute top-1/4 right-10 h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
      </MouseParallax>
      <MouseParallax strength={-30} className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute bottom-1/4 left-10 h-48 w-48 rounded-full bg-accent/3 blur-3xl" />
      </MouseParallax>

      <div className="relative z-10 container-wide">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.p
            className="eyebrow mb-6"
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.25em' }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Elite Fitness Coaching
          </motion.p>

          <div className="overflow-hidden">
            <motion.h1
              className="text-display font-serif text-balance"
              initial={{ y: reduceMotion ? 0 : '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              STRONGER BODY.
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              className="text-display font-serif text-balance"
              initial={{ y: reduceMotion ? 0 : '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="gold-gradient">STRONGER YOU.</span>
            </motion.h1>
          </div>

          <motion.p
            className="mt-8 max-w-xl text-subheading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Personalized coaching designed to help you build strength, confidence, and sustainable results.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            <MagneticButton
              href="/contact"
              strength={0.25}
              className="group inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold tracking-wide text-accent-foreground transition-all duration-300 hover:bg-accent/90"
            >
              Start Your Transformation
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <MagneticButton
              href="/packages"
              strength={0.2}
              className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/20 px-8 py-4 text-sm font-semibold tracking-wide text-foreground transition-all duration-300 hover:border-accent hover:text-accent"
            >
              Explore Coaching
            </MagneticButton>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={reduceMotion ? {} : { y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-12 w-px bg-gradient-to-b from-transparent to-accent/50" />
      </motion.div>
    </section>
  );
}

function CoachStorySection() {
  const [coach, setCoach] = useState<CoachProfile | null>(null);

  useEffect(() => {
    getCoachProfile().then(setCoach);
  }, []);

  return (
    <section className="relative overflow-hidden section-padding">
      {/* Background accent glow with parallax */}
      <ParallaxLayer yOff={60} className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-accent/3 blur-3xl" />
      </ParallaxLayer>

      <div className="container-wide grid gap-16 lg:grid-cols-2 lg:items-center">
        <Parallax offset={30}>
          <ImageReveal className="relative aspect-[3/4] overflow-hidden rounded-sm">
            <Image
              src={COACH_IMAGE}
              alt={coach?.name || 'Coach'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
          </ImageReveal>
        </Parallax>

        <div>
          <TextReveal>
            <p className="eyebrow mb-4">Meet Your Coach</p>
          </TextReveal>
          <TextReveal delay={0.05}>
            <h2 className="text-heading font-serif text-balance">
              {coach?.name || 'Alex Stone'}
            </h2>
          </TextReveal>
          <FadeIn delay={0.1}>
            <p className="mt-2 text-lg text-accent">{coach?.title || 'Elite Fitness Coach'}</p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {coach?.biography ||
                'With over 15 years of experience in the fitness industry, helping hundreds of clients achieve dramatic physical transformations through evidence-based training science and personalized programming.'}
            </p>
          </FadeIn>

          <StaggerContainer delay={0.2} className="mt-8 space-y-4">
            {coach?.certifications?.slice(0, 3).map((cert, i) => (
              <StaggerItem key={i}>
                <div className="flex items-center gap-3 transition-transform hover:translate-x-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent/30">
                    <Award size={14} className="text-accent" />
                  </div>
                  <span className="text-sm text-foreground">{cert}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <FadeIn delay={0.4}>
            <Link
              href="/about"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-accent link-underline"
            >
              Read Full Story
              <ArrowRight size={14} />
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const [coach, setCoach] = useState<CoachProfile | null>(null);

  useEffect(() => {
    getCoachProfile().then(setCoach);
  }, []);

  const stats = coach?.statistics || [
    { label: 'Years of Experience', value: 15 },
    { label: 'Clients Coached', value: 500 },
    { label: 'Transformations', value: 320 },
    { label: 'Certifications', value: 4 },
  ];

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-card/30 section-padding">
      <StaggerContainer className="container-wide grid grid-cols-2 gap-8 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StaggerItem key={i} className="text-center">
            <Counter value={stat.value} />
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              {stat.label}
            </p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}

function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const [ref, setRef] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [ref, value]);

  return (
    <div ref={() => setRef(true)} className="font-serif text-4xl font-bold text-accent md:text-6xl">
      {count}+
    </div>
  );
}

function TransformationsPreview() {
  const [transformations, setTransformations] = useState<Transformation[]>([]);

  useEffect(() => {
    getFeaturedTransformations().then(setTransformations);
  }, []);

  if (transformations.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-wide">
        <TextReveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-4">Real Results</p>
              <h2 className="text-heading font-serif">Client Transformations</h2>
            </div>
            <Link href="/transformations" className="inline-flex items-center gap-2 text-sm font-semibold text-accent link-underline">
              View All
              <ArrowRight size={14} />
            </Link>
          </div>
        </TextReveal>

        <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transformations.slice(0, 3).map((t) => (
            <StaggerItem key={t.id}>
              <TransformationCard transformation={t} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function PackagesPreview() {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  if (packages.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-card/20 section-padding">
      <ParallaxLayer yOff={40} className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-accent/3 blur-3xl" />
      </ParallaxLayer>

      <div className="container-wide">
        <TextReveal className="mb-12 text-center">
          <p className="eyebrow mb-4">Coaching Programs</p>
          <h2 className="text-heading font-serif">Choose Your Path</h2>
        </TextReveal>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {packages.slice(0, 3).map((pkg) => (
            <StaggerItem key={pkg.id}>
              <TiltCard maxTilt={5} className="h-full">
                <div
                  className={`group relative h-full rounded-sm border p-8 transition-all duration-300 hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/5 ${
                    pkg.featured ? 'border-accent/40 bg-accent/5' : 'border-border bg-card/50'
                  }`}
                >
                  {pkg.featured && (
                    <motion.span
                      className="absolute -top-3 left-8 rounded-sm bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground"
                      initial={{ opacity: 0, y: -5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      Most Popular
                    </motion.span>
                  )}
                  <h3 className="font-serif text-xl font-bold">{pkg.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{pkg.description}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-serif text-4xl font-bold text-accent">
                      ${pkg.price}
                    </span>
                    {pkg.duration && (
                      <span className="text-sm text-muted-foreground">/ {pkg.duration}</span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-2">
                    {pkg.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1 text-accent">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/packages"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent link-underline"
                  >
                    {pkg.cta_text}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getTestimonials().then(setTestimonials);
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-wide">
        <TextReveal className="mb-12 text-center">
          <p className="eyebrow mb-4">Client Voices</p>
          <h2 className="text-heading font-serif">What Clients Say</h2>
        </TextReveal>

        <StaggerContainer className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <div className="group h-full rounded-sm border border-border bg-card/50 p-8 transition-all duration-300 hover:border-accent/30 hover:-translate-y-1">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <Quote size={28} className="text-accent/40 transition-transform group-hover:scale-110" />
                </motion.div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.testimonial}&rdquo;
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{t.client_name}</p>
                    <div className="mt-1 flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} size={12} className="fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function BlogPreview() {
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    getFeaturedBlogPost().then(setPost);
  }, []);

  if (!post) return null;

  return (
    <section className="border-t border-white/5 section-padding">
      <div className="container-wide">
        <TextReveal>
          <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-4">Latest Insights</p>
              <h2 className="text-heading font-serif">From the Blog</h2>
            </div>
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-accent link-underline">
              All Articles
              <ArrowRight size={14} />
            </Link>
          </div>
        </TextReveal>

        <FadeIn delay={0.1}>
          <Link href={`/blog/${post.slug}`} className="group grid gap-8 lg:grid-cols-2 lg:items-center">
            <ImageReveal className="relative aspect-[16/10] overflow-hidden rounded-sm bg-card">
              {post.cover_image_url ? (
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Dumbbell size={48} className="text-accent/20" />
                </div>
              )}
            </ImageReveal>
            <div>
              <div className="mb-3 flex items-center gap-3">
                {post.blog_categories && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {post.blog_categories.name}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">{post.reading_time} min read</span>
              </div>
              <h3 className="font-serif text-2xl font-bold transition-colors group-hover:text-accent md:text-3xl">
                {post.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {post.excerpt}
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
  );
}

function CTASection() {
  return (
    <section className="relative overflow-hidden section-padding">
      <div className="container-wide">
        <Parallax offset={20}>
          <div className="relative overflow-hidden rounded-sm border border-accent/20 bg-gradient-to-br from-card to-background p-12 text-center md:p-20">
            <div className="absolute inset-0 hero-grain opacity-20" />
            <MouseParallax strength={15} className="pointer-events-none absolute inset-0">
              <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/5 blur-3xl" />
            </MouseParallax>
            <div className="relative z-10">
              <FadeIn>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="mx-auto mb-6"
                >
                  <TrendingUp size={32} className="text-accent" />
                </motion.div>
                <h2 className="text-heading font-serif text-balance">
                  Ready to Build Your <span className="gold-gradient">Strongest Self?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-subheading">
                  Take the first step. Book a consultation and let&apos;s build your personalized transformation plan.
                </p>
                <MagneticButton
                  href="/contact"
                  strength={0.2}
                  className="mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold tracking-wide text-accent-foreground transition-all duration-300 hover:bg-accent/90"
                >
                  Book a Consultation
                  <ArrowRight size={16} />
                </MagneticButton>
              </FadeIn>
            </div>
          </div>
        </Parallax>
      </div>
    </section>
  );
}
