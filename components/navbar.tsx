'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/transformations', label: 'Transformations' },
  { href: '/training', label: 'Training' },
  { href: '/packages', label: 'Packages' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar({ brandName = 'ALEX STONE' }: { brandName?: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'glass-dark py-3 border-b border-white/5'
            : 'bg-transparent py-5'
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-12 lg:px-20">
          <Link href="/" className="group">
            <span className="font-serif text-xl font-bold tracking-wider text-foreground transition-colors group-hover:text-accent">
              {brandName}
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-sm font-medium tracking-wide transition-colors duration-300',
                    isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-px bg-accent"
                    />
                  )}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="rounded-sm border border-accent/50 px-5 py-2 text-sm font-semibold tracking-wide text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
            >
              Get Started
            </Link>
          </div>

          <button
            className="text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-serif text-xl font-bold tracking-wider">{brandName}</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <motion.nav
              className="flex flex-col items-center justify-center gap-6 px-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
            >
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'font-serif text-3xl font-semibold transition-colors',
                      pathname === link.href ? 'text-accent' : 'text-foreground hover:text-accent'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="mt-4"
              >
                <Link
                  href="/contact"
                  className="rounded-sm bg-accent px-8 py-3 text-sm font-semibold tracking-wide text-accent-foreground"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
