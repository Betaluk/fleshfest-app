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
  metadataBase: new URL('https://flashfest.com.br'),
  title: {
    default: 'FlashFest | Telão Interativo e Fotos em Tempo Real para Festas',
    template: '%s | FlashFest',
  },
  description: 'Transforme os convidados nos fotógrafos do seu evento. Escaneie o QR Code, tire fotos e envie mensagens ao vivo no telão da festa. A alternativa moderna e acessível à cabine de fotos.',
  keywords: [
    'telão interativo',
    'fotos casamento',
    'cabine de fotos alternativa',
    'qr code fotos festa',
    'slideshow eventos ao vivo',
    'mural de fotos digital',
    'câmera descartável virtual festa',
    'totem de fotos interativo'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'FlashFest | O Telão Interativo do seu Evento',
    description: 'Transforme os convidados nos fotógrafos da festa. Fotos ao vivo no telão via QR Code, câmera com filtros e galeria pública pós-festa.',
    url: 'https://flashfest.com.br',
    siteName: 'FlashFest',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FlashFest - O Telão Interativo para Eventos',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashFest | O Telão Interativo do seu Evento',
    description: 'Transforme os convidados nos fotógrafos da festa. Fotos ao vivo no telão via QR Code, câmera com filtros e galeria pública pós-festa.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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