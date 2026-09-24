import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

import type { Metadata, Viewport } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#09090b',
};

export const metadata: Metadata = {
  title: 'FlashFest',
  description: 'A câmera descartável virtual para sua festa.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="bg-zinc-950 text-white antialiased font-sans selection:bg-emerald-500/30">
        {children}
      </body>
    </html>
  );
}