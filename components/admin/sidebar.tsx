'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  User,
  Users,
  Dumbbell,
  FileText,
  Package,
  Image,
  Video,
  LogOut,
  Menu,
  X,
  Mail,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/settings', label: 'Website Settings', icon: Settings },
  { href: '/admin/coach-profile', label: 'Coach Profile', icon: User },
  { href: '/admin/transformations', label: 'Transformations', icon: Users },
  { href: '/admin/exercises', label: 'Exercises', icon: Dumbbell },
  { href: '/admin/blog', label: 'Blog Posts', icon: FileText },
  { href: '/admin/packages', label: 'Packages', icon: Package },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Users },
  { href: '/admin/videos', label: 'Video Content', icon: Video },
  { href: '/admin/media', label: 'Media Library', icon: Image },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
];

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card/50 lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-6">
            <Link href="/admin" className="font-serif text-lg font-bold tracking-wider text-accent">
              ADMIN PANEL
            </Link>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border p-4">
            <Link
              href="/"
              target="_blank"
              className="mb-2 flex items-center gap-3 rounded-sm px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              View Website →
            </Link>
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-muted-foreground hover:text-destructive"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-card/80 px-4 py-3 backdrop-blur-md lg:hidden">
        <Link href="/admin" className="font-serif text-base font-bold tracking-wider text-accent">
          ADMIN
        </Link>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-30 bg-background/95 lg:hidden" onClick={() => setOpen(false)}>
          <nav className="mt-14 space-y-1 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-sm px-3 py-3 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-sm px-3 py-3 text-sm text-muted-foreground hover:text-destructive"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64">
        <div className="min-h-screen p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  );
}
