'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/page-wrapper';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem } from '@/components/animation';
import { getTransformations, getTransformationCategories } from '@/lib/data';
import type { Transformation, TransformationCategory } from '@/lib/types';
import { TransformationCard } from '@/components/transformation-card';

export default function TransformationsPage() {
  const [transformations, setTransformations] = useState<Transformation[]>([]);
  const [categories, setCategories] = useState<TransformationCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    getTransformationCategories().then(setCategories);
  }, []);

  useEffect(() => {
    getTransformations(activeCategory || undefined).then(setTransformations);
  }, [activeCategory]);

  return (
    <PageWrapper>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden pt-24">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card to-background" />
        <div className="relative z-10 container-wide pb-12">
          <TextReveal>
            <p className="eyebrow mb-4">Real Results</p>
          </TextReveal>
          <div className="overflow-hidden">
            <motion.h1
              className="text-display font-serif text-balance"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Transformations
            </motion.h1>
          </div>
          <FadeIn delay={0.3}>
            <p className="mt-4 max-w-xl text-subheading">
              Real clients. Real results. Hover over any card to see the journey from before to after.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          <FadeIn className="mb-10">
            <div className="flex flex-wrap gap-3">
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
          </FadeIn>

          {transformations.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No transformations yet. Check back soon.</p>
            </div>
          ) : (
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {transformations.map((t) => (
                <StaggerItem key={t.id}>
                  <TransformationCard transformation={t} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>
    </PageWrapper>
  );
}
