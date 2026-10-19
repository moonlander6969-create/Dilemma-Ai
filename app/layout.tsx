import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Dilemna Ai - Fate, Intuition & Crossroads Guidance',
  description: 'Explore life\'s crossroads with clarity, comfort, and peace of mind. Uncover trade-offs, reveal what fate has in store, and discover your destined path.',
  openGraph: {
    title: 'Dilemna Ai - Fate, Intuition & Crossroads Guidance',
    description: 'Explore life\'s crossroads with clarity, comfort, and peace of mind. Uncover trade-offs, reveal what fate has in store, and discover your destined path.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dilemna Ai - Fate, Intuition & Crossroads Guidance',
    description: 'Explore life\'s crossroads with clarity, comfort, and peace of mind. Uncover trade-offs, reveal what fate has in store, and discover your destined path.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
