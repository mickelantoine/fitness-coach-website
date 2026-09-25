'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, AdminInput, AdminTextarea, AdminButton, LoadingState } from '@/components/admin/ui';
import type { WebsiteSettings } from '@/lib/types';

export default function AdminSettings() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from('website_settings').select('*').limit(1).maybeSingle().then(({ data }) => {
      setSettings(data as WebsiteSettings);
      setLoading(false);
    });
  }, []);

  const update = (field: keyof WebsiteSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from('website_settings')
      .update({
        brand_name: settings.brand_name,
        logo_url: settings.logo_url,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        hero_image_url: settings.hero_image_url,
        primary_cta_text: settings.primary_cta_text,
        primary_cta_link: settings.primary_cta_link,
        secondary_cta_text: settings.secondary_cta_text,
        secondary_cta_link: settings.secondary_cta_link,
        footer_text: settings.footer_text,
        seo_title: settings.seo_title,
        seo_description: settings.seo_description,
        social_instagram: settings.social_instagram,
        social_youtube: settings.social_youtube,
        social_facebook: settings.social_facebook,
        social_twitter: settings.social_twitter,
        social_tiktok: settings.social_tiktok,
        contact_email: settings.contact_email,
        contact_phone: settings.contact_phone,
        contact_whatsapp: settings.contact_whatsapp,
        contact_location: settings.contact_location,
        accent_color: settings.accent_color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settings.id);
    if (error) {
      toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Settings saved successfully' });
    }
    setSaving(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Website Settings" />
      {settings && (
        <div className="space-y-6">
          <div className="rounded-sm border border-border bg-card/50 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">Branding</h2>
            <div className="space-y-4">
              <AdminInput label="Brand Name" value={settings.brand_name} onChange={(v) => update('brand_name', v)} required />
              <AdminInput label="Logo URL" value={settings.logo_url || ''} onChange={(v) => update('logo_url', v)} />
              <AdminInput label="Accent Color" value={settings.accent_color} onChange={(v) => update('accent_color', v)} />
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card/50 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">Hero Section</h2>
            <div className="space-y-4">
              <AdminInput label="Hero Title" value={settings.hero_title} onChange={(v) => update('hero_title', v)} required />
              <AdminTextarea label="Hero Subtitle" value={settings.hero_subtitle} onChange={(v) => update('hero_subtitle', v)} />
              <AdminInput label="Hero Image URL" value={settings.hero_image_url || ''} onChange={(v) => update('hero_image_url', v)} />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Primary CTA Text" value={settings.primary_cta_text} onChange={(v) => update('primary_cta_text', v)} />
                <AdminInput label="Primary CTA Link" value={settings.primary_cta_link} onChange={(v) => update('primary_cta_link', v)} />
                <AdminInput label="Secondary CTA Text" value={settings.secondary_cta_text} onChange={(v) => update('secondary_cta_text', v)} />
                <AdminInput label="Secondary CTA Link" value={settings.secondary_cta_link} onChange={(v) => update('secondary_cta_link', v)} />
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card/50 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">Contact & Social</h2>
            <div className="space-y-4">
              <AdminInput label="Contact Email" value={settings.contact_email} onChange={(v) => update('contact_email', v)} />
              <AdminInput label="Contact Phone" value={settings.contact_phone || ''} onChange={(v) => update('contact_phone', v)} />
              <AdminInput label="WhatsApp" value={settings.contact_whatsapp || ''} onChange={(v) => update('contact_whatsapp', v)} />
              <AdminInput label="Location" value={settings.contact_location || ''} onChange={(v) => update('contact_location', v)} />
              <div className="grid grid-cols-2 gap-4">
                <AdminInput label="Instagram" value={settings.social_instagram || ''} onChange={(v) => update('social_instagram', v)} />
                <AdminInput label="YouTube" value={settings.social_youtube || ''} onChange={(v) => update('social_youtube', v)} />
                <AdminInput label="Facebook" value={settings.social_facebook || ''} onChange={(v) => update('social_facebook', v)} />
                <AdminInput label="Twitter/X" value={settings.social_twitter || ''} onChange={(v) => update('social_twitter', v)} />
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card/50 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">SEO</h2>
            <div className="space-y-4">
              <AdminInput label="SEO Title" value={settings.seo_title} onChange={(v) => update('seo_title', v)} />
              <AdminTextarea label="SEO Description" value={settings.seo_description} onChange={(v) => update('seo_description', v)} />
              <AdminTextarea label="Footer Text" value={settings.footer_text} onChange={(v) => update('footer_text', v)} />
            </div>
          </div>

          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save All Settings'}
          </AdminButton>
        </div>
      )}
    </div>
  );
}
