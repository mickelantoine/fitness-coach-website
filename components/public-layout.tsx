'use client';

import { Navbar } from './navbar';
import { Footer } from './footer';
import { CursorSpotlight, ScrollProgress } from './animation';
import type { WebsiteSettings } from '@/lib/types';

export function PublicLayout({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: WebsiteSettings | null;
}) {
  return (
    <>
      <ScrollProgress />
      <CursorSpotlight />
      <Navbar brandName={settings?.brand_name} />
      <main className="min-h-screen">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
