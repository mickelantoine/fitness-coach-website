'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold tracking-wider">ADMIN</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your website</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-sm border border-border bg-card/50 p-8"
        >
          {error && (
            <div className="mb-4 rounded-sm border border-destructive/30 bg-destructive/10 p-3 text-sm text-foreground">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-sm border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground focus:border-accent focus:outline-none"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-sm border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground focus:border-accent focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-accent-foreground transition-all hover:bg-accent/90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Authorized personnel only. All actions are logged.
        </p>
      </div>
    </div>
  );
}
