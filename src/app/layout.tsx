import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' });

export const metadata = {
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