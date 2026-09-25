import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alex Stone | Elite Fitness Coaching & Transformations',
  description:
    'Premium personal fitness coaching by Alex Stone. Transformations, training videos, nutrition guidance, and 1:1 coaching programs.',
  openGraph: {
    title: 'Alex Stone | Elite Fitness Coaching',
    description:
      'Personalized coaching designed to help you build strength, confidence, and sustainable results.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
