'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { PageWrapper } from '@/components/page-wrapper';
import { FadeIn } from '@/components/animation';
import { submitContactForm } from '@/lib/data';
import { useSettings } from '@/components/page-wrapper';

export default function ContactPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus('submitting');
    const success = await submitContactForm(form);
    setStatus(success ? 'success' : 'error');
    if (success) {
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <PageWrapper>
      <section className="relative flex min-h-[40vh] items-end overflow-hidden pt-24">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-card to-background" />
        <div className="relative z-10 container-wide pb-12">
          <FadeIn>
            <p className="eyebrow mb-4">Get in Touch</p>
            <h1 className="text-display font-serif text-balance">Contact</h1>
            <p className="mt-4 max-w-xl text-subheading">
              Ready to start your transformation? Send a message and let&apos;s talk.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <FadeIn>
            <div className="space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold">Let&apos;s Build Your Plan</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Whether you&apos;re looking to lose fat, build muscle, or completely transform your body, I&apos;m here to help. Fill out the form and I&apos;ll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-4">
                {settings?.contact_email && (
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="flex items-center gap-4 rounded-sm border border-border bg-card/50 p-4 transition-all hover:border-accent/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30">
                      <Mail size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                      <p className="text-sm font-medium text-foreground">{settings.contact_email}</p>
                    </div>
                  </a>
                )}

                {settings?.contact_phone && (
                  <a
                    href={`tel:${settings.contact_phone}`}
                    className="flex items-center gap-4 rounded-sm border border-border bg-card/50 p-4 transition-all hover:border-accent/40"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30">
                      <Phone size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium text-foreground">{settings.contact_phone}</p>
                    </div>
                  </a>
                )}

                {settings?.contact_location && (
                  <div className="flex items-center gap-4 rounded-sm border border-border bg-card/50 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/30">
                      <MapPin size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">Location</p>
                      <p className="text-sm font-medium text-foreground">{settings.contact_location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="rounded-sm border border-border bg-card/50 p-8"
            >
              {status === 'success' && (
                <div className="mb-6 flex items-center gap-3 rounded-sm border border-accent/30 bg-accent/10 p-4">
                  <CheckCircle2 size={20} className="text-accent" />
                  <p className="text-sm text-foreground">
                    Thank you! Your message has been sent. I&apos;ll be in touch soon.
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-6 rounded-sm border border-destructive/30 bg-destructive/10 p-4">
                  <p className="text-sm text-foreground">
                    Something went wrong. Please try again or email directly.
                  </p>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Phone (optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-accent focus:outline-none"
                    placeholder="Tell me about your goals..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-accent-foreground transition-all hover:bg-accent/90 disabled:opacity-50"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  <Send size={14} />
                </button>
              </div>
            </form>
          </FadeIn>
        </div>
      </section>
    </PageWrapper>
  );
}
