'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageWrapper } from '@/components/page-wrapper';
import { FadeIn, TextReveal, StaggerContainer, StaggerItem } from '@/components/animation';
import { getPackages } from '@/lib/data';
import type { Package } from '@/lib/types';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    getPackages().then(setPackages);
  }, []);

  return (
    <PageWrapper>
      <section className="relative flex min-h-[50vh] items-end overflow-hidden pt-24">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card to-background" />
        <div className="relative z-10 container-wide pb-12">
          <TextReveal>
            <p className="eyebrow mb-4">Coaching Programs</p>
          </TextReveal>
          <div className="overflow-hidden">
            <motion.h1
              className="text-display font-serif text-balance"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              Packages
            </motion.h1>
          </div>
          <FadeIn delay={0.3}>
            <p className="mt-4 max-w-xl text-subheading">
              Choose the program that fits your goals. Every package is fully customizable to your needs.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide">
          {packages.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-muted-foreground">No packages available yet.</p>
            </div>
          ) : (
            <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <StaggerItem key={pkg.id}>
                  <div
                    className={`relative flex h-full flex-col rounded-sm border p-8 transition-all duration-300 hover:border-accent/50 ${
                      pkg.featured
                        ? 'border-accent/40 bg-gradient-to-b from-accent/5 to-transparent'
                        : 'border-border bg-card/50'
                    }`}
                  >
                    {pkg.featured && (
                      <span className="absolute -top-3 left-8 rounded-sm bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                        Most Popular
                      </span>
                    )}

                    <h3 className="font-serif text-2xl font-bold">{pkg.name}</h3>
                    {pkg.description && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
                    )}

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="font-serif text-5xl font-bold text-accent">
                        ${pkg.price}
                      </span>
                      {pkg.duration && (
                        <span className="text-sm text-muted-foreground">/ {pkg.duration}</span>
                      )}
                    </div>

                    <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                      {pkg.sessions && <p>Sessions: {pkg.sessions}</p>}
                      {pkg.training_type && <p>Type: {pkg.training_type}</p>}
                    </div>

                    <div className="my-6 h-px bg-border" />

                    <ul className="flex-1 space-y-3">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                          <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      className={`mt-8 inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ${
                        pkg.featured
                          ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                          : 'border border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      {pkg.cta_text}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      <section className="border-t border-white/5 section-padding">
        <div className="container-narrow text-center">
          <FadeIn>
            <h2 className="text-heading font-serif text-balance">
              Not Sure Which Program is Right?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-subheading">
              Book a free consultation and we&apos;ll find the perfect fit for your goals and lifestyle.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-8 py-4 text-sm font-semibold tracking-wide text-accent-foreground transition-all hover:bg-accent/90"
            >
              Book a Consultation
              <ArrowRight size={16} />
            </Link>
          </FadeIn>
        </div>
      </section>
    </PageWrapper>
  );
}
