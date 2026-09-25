'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PageHeader, AdminInput, AdminTextarea, AdminButton, LoadingState } from '@/components/admin/ui';
import { ImageUpload } from '@/components/admin/image-upload';
import type { CoachProfile } from '@/lib/types';

export default function AdminCoachProfile() {
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certInput, setCertInput] = useState('');
  const [achInput, setAchInput] = useState('');
  const [statLabel, setStatLabel] = useState('');
  const [statValue, setStatValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    supabase.from('coach_profile').select('*').limit(1).maybeSingle().then(({ data }) => {
      setProfile(data as CoachProfile);
      setLoading(false);
    });
  }, []);

  const update = (field: keyof CoachProfile, value: unknown) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from('coach_profile')
      .update({
        name: profile.name,
        title: profile.title,
        profile_image_url: profile.profile_image_url,
        biography: profile.biography,
        story: profile.story,
        philosophy: profile.philosophy,
        certifications: profile.certifications,
        achievements: profile.achievements,
        experience: profile.experience,
        statistics: profile.statistics,
        updated_at: new Date().toISOString(),
      })
      .eq('id', profile.id);
    if (error) {
      toast({ title: 'Error saving', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Profile saved successfully' });
    }
    setSaving(false);
  };

  if (loading) return <LoadingState />;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Coach Profile" />
      {profile && (
        <div className="space-y-6">
          <div className="rounded-sm border border-border bg-card/50 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">Basic Info</h2>
            <div className="space-y-4">
              <AdminInput label="Name" value={profile.name} onChange={(v) => update('name', v)} required />
              <AdminInput label="Title" value={profile.title} onChange={(v) => update('title', v)} />
              <ImageUpload label="Profile Image" value={profile.profile_image_url} onChange={(url) => update('profile_image_url', url)} aspectRatio="aspect-[3/4]" />
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card/50 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">Biography & Story</h2>
            <div className="space-y-4">
              <AdminTextarea label="Biography" value={profile.biography} onChange={(v) => update('biography', v)} rows={4} />
              <AdminTextarea label="Story" value={profile.story || ''} onChange={(v) => update('story', v)} rows={4} />
              <AdminTextarea label="Philosophy" value={profile.philosophy || ''} onChange={(v) => update('philosophy', v)} rows={3} />
              <AdminTextarea label="Experience" value={profile.experience || ''} onChange={(v) => update('experience', v)} rows={3} />
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card/50 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">Certifications</h2>
            <div className="space-y-2">
              {profile.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm">{cert}</span>
                  <button
                    onClick={() => update('certifications', profile.certifications.filter((_, idx) => idx !== i))}
                    className="text-destructive hover:text-destructive/80"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={certInput}
                  onChange={(e) => setCertInput(e.target.value)}
                  placeholder="Add certification..."
                  className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
                <AdminButton
                  onClick={() => {
                    if (certInput) {
                      update('certifications', [...profile.certifications, certInput]);
                      setCertInput('');
                    }
                  }}
                >
                  Add
                </AdminButton>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card/50 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">Achievements</h2>
            <div className="space-y-2">
              {profile.achievements.map((ach, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm">{ach}</span>
                  <button
                    onClick={() => update('achievements', profile.achievements.filter((_, idx) => idx !== i))}
                    className="text-destructive hover:text-destructive/80"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={achInput}
                  onChange={(e) => setAchInput(e.target.value)}
                  placeholder="Add achievement..."
                  className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
                <AdminButton
                  onClick={() => {
                    if (achInput) {
                      update('achievements', [...profile.achievements, achInput]);
                      setAchInput('');
                    }
                  }}
                >
                  Add
                </AdminButton>
              </div>
            </div>
          </div>

          <div className="rounded-sm border border-border bg-card/50 p-6">
            <h2 className="mb-4 font-serif text-lg font-bold">Statistics</h2>
            <div className="space-y-2">
              {profile.statistics.map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm">{stat.label}</span>
                  <span className="rounded-sm border border-border bg-background px-3 py-2 text-sm">{stat.value}</span>
                  <button
                    onClick={() => update('statistics', profile.statistics.filter((_, idx) => idx !== i))}
                    className="text-destructive hover:text-destructive/80"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={statLabel}
                  onChange={(e) => setStatLabel(e.target.value)}
                  placeholder="Label..."
                  className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
                <input
                  type="number"
                  value={statValue}
                  onChange={(e) => setStatValue(e.target.value)}
                  placeholder="Value..."
                  className="w-24 rounded-sm border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
                />
                <AdminButton
                  onClick={() => {
                    if (statLabel && statValue) {
                      update('statistics', [...profile.statistics, { label: statLabel, value: parseInt(statValue) }]);
                      setStatLabel('');
                      setStatValue('');
                    }
                  }}
                >
                  Add
                </AdminButton>
              </div>
            </div>
          </div>

          <AdminButton onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </AdminButton>
        </div>
      )}
    </div>
  );
}
