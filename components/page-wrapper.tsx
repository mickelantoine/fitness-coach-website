'use client';

import { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/public-layout';
import type { WebsiteSettings } from '@/lib/types';
import { getWebsiteSettings } from '@/lib/data';

export function useSettings() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWebsiteSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return <PublicLayout settings={settings}>{children}</PublicLayout>;
}
