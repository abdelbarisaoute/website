import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = {
  title: 'Open Mathematics & Physics Library',
  description: 'A modern open library for mathematics and physics learning.',
  openGraph: {
    title: 'Open Mathematics & Physics Library',
    description: 'Structured mathematics and physics lessons with textbook-level reading experience.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
