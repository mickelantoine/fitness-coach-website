'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Award, CheckCircle2, Dumbbell, Target } from 'lucide-react';
import { PageWrapper } from '@/components/page-wrapper';
import { FadeIn, TextReveal, ImageReveal, Parallax, ParallaxLayer, StaggerContainer, StaggerItem, MouseParallax } from '@/components/animation';
import { getCoachProfile } from '@/lib/data';
import type { CoachProfile } from '@/lib/types';

const COACH_IMAGE = 'https://images.pexels.com/photos/14055666/pexels-photo-14055666.jpeg?auto=compress&cs=tinysrgb&w=1200';
const COACH_IMAGE_2 = 'https://images.pexels.com/photos/14593311/pexels-photo-14593311.jpeg?auto=compress&cs=tinysrgb&w=1200';

export default function AboutPage() {
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

  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, reduceMotion ? 0 : 80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, reduceMotion ? 1 : 1.08]);

  return (
    <PageWrapper>
      {/* Hero with scroll parallax + mouse parallax */}
      <section className="relative flex min-h-[70vh] items-center overflow-hidden pt-24">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 z-0">
          <MouseParallax strength={20} className="absolute inset-0">
            <Image
              src={COACH_IMAGE_2}
              alt="Coach"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </MouseParallax>
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
        </motion.div>
        <div className="relative z-10 container-wide">
          <TextReveal>
            <p className="eyebrow mb-4">About the Coach</p>
          </TextReveal>
          <div className="overflow-hidden">
            <motion.h1
              className="text-display font-serif text-balance"
              initial={{ y: reduceMotion ? 0 : '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {coach?.name || 'Alex Stone'}
            </motion.h1>
          </div>
          <FadeIn delay={0.3}>
            <p className="mt-4 max-w-xl text-subheading">{coach?.title || 'Elite Fitness Coach'}</p>
          </FadeIn>
        </div>
      </section>

      <section className="relative overflow-hidden section-padding">
        <ParallaxLayer yOff={50} className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/4 right-0 h-96 w-96 rounded-full bg-accent/3 blur-3xl" />
        </ParallaxLayer>

        <div className="container-wide grid gap-16 lg:grid-cols-2 lg:items-start">
          <Parallax offset={20}>
            <ImageReveal className="relative aspect-[3/4] overflow-hidden rounded-sm">
              <Image
                src={COACH_IMAGE}
                alt={coach?.name || 'Coach'}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </ImageReveal>
          </Parallax>

          <div>
            <TextReveal>
              <h2 className="text-heading font-serif">The Story</h2>
            </TextReveal>
            <FadeIn delay={0.05}>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                {coach?.story || coach?.biography ||
                  'With over 15 years of experience in the fitness industry, helping hundreds of clients achieve dramatic physical transformations.'}
              </p>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="group mt-8 rounded-sm border border-accent/20 bg-accent/5 p-6 transition-all hover:border-accent/40 hover:bg-accent/8">
                <h3 className="mb-3 flex items-center gap-2 font-serif text-lg font-bold">
                  <Target size={18} className="text-accent transition-transform group-hover:rotate-12" />
                  Coaching Philosophy
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  {coach?.philosophy || 'True transformation is about building a foundation of strength, consistency, and self-belief that lasts a lifetime.'}
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.25}>
              <h3 className="mt-10 font-serif text-xl font-bold">Certifications</h3>
              <div className="mt-4 space-y-3">
                {(coach?.certifications || []).map((cert, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 transition-transform hover:translate-x-1"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <Award size={16} className="text-accent" />
                    <span className="text-sm text-foreground">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.35}>
              <h3 className="mt-10 font-serif text-xl font-bold">Achievements</h3>
              <div className="mt-4 space-y-3">
                {(coach?.achievements || []).map((ach, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 transition-transform hover:translate-x-1"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                  >
                    <CheckCircle2 size={16} className="text-accent" />
                    <span className="text-sm text-foreground">{ach}</span>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 bg-card/30 section-padding">
        <MouseParallax strength={15} className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/3 h-64 w-64 rounded-full bg-accent/3 blur-3xl" />
        </MouseParallax>
        <StaggerContainer className="container-wide grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StaggerItem key={i} className="text-center">
              <motion.div
                className="font-serif text-4xl font-bold text-accent md:text-6xl"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {stat.value}+
              </motion.div>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {stat.label}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="section-padding">
        <div className="container-narrow text-center">
          <FadeIn>
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Dumbbell size={32} className="mx-auto text-accent" />
            </motion.div>
            <h2 className="mt-6 text-heading font-serif text-balance">
              Experience That Matters
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {coach?.experience ||
                '15 years of dedicated coaching experience, working with clients ranging from beginners to competitive athletes. Every program is crafted with precision, backed by science, and tailored to your unique goals.'}
            </p>
          </FadeIn>
        </div>
      </section>
    </PageWrapper>
  );
}
