import './globals.css';

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
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}