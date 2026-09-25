'use client';

import Link from 'next/link';
import { Instagram, Youtube, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import type { WebsiteSettings } from '@/lib/types';

export function Footer({ settings }: { settings: WebsiteSettings | null }) {
  const brand = settings?.brand_name || 'ALEX STONE';
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 bg-background">
      <div className="container-wide py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl font-bold tracking-wider">{brand}</h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {settings?.footer_text ||
                'Helping clients build stronger bodies and stronger lives.'}
            </p>
            <div className="mt-6 flex gap-4">
              {settings?.social_instagram && (
                <a href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-accent" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              )}
              {settings?.social_youtube && (
                <a href={settings.social_youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-accent" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              )}
              {settings?.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-accent" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              )}
              {settings?.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground transition-colors hover:text-accent" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Explore</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="transition-colors hover:text-foreground">Home</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-foreground">About</Link></li>
              <li><Link href="/transformations" className="transition-colors hover:text-foreground">Transformations</Link></li>
              <li><Link href="/training" className="transition-colors hover:text-foreground">Training</Link></li>
              <li><Link href="/packages" className="transition-colors hover:text-foreground">Packages</Link></li>
              <li><Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {settings?.contact_email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-accent" />
                  <a href={`mailto:${settings.contact_email}`} className="transition-colors hover:text-foreground">{settings.contact_email}</a>
                </li>
              )}
              {settings?.contact_phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-accent" />
                  <a href={`tel:${settings.contact_phone}`} className="transition-colors hover:text-foreground">{settings.contact_phone}</a>
                </li>
              )}
              {settings?.contact_location && (
                <li className="flex items-center gap-2">
                  <MapPin size={14} className="text-accent" />
                  <span>{settings.contact_location}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">© {year} {brand}. All rights reserved.</p>
          <Link href="/admin" className="text-xs text-muted-foreground/50 transition-colors hover:text-accent">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
