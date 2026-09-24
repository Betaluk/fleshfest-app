import { auth, signIn } from '@/auth';
import Link from 'next/link';
import { Metadata } from 'next';
import SpotlightCard from '@/components/SpotlightCard';

export const metadata: Metadata = {
  title: 'Telão Interativo e Câmera Descartável para Festa de 15 Anos | Debutantes | FlashFest',
  description: 'Faça a festa de 15 anos inesquecível! Amigos e convidados tiram fotos com filtros de câmera descartável pelo celular e tudo passa no telão ao vivo. Sem app!',
  keywords: [
    'fotos festa de 15 anos telão',
    'câmera descartável festa 15 anos',
    'telão interativo debutante',
    'cabine de fotos festa 15 anos alternativa',
    'fotos ao vivo debutante',
    'fotos pista de dança 15 anos'
  ],
  alternates: {
    canonical: '/15-anos',
  },
  openGraph: {
    title: 'Telão Interativo e Câmera Descartável para Festa de 15 Anos | FlashFest',
    description: 'A vibe da câmera descartável no celular dos amigos e projeção instantânea na pista de dança.',
    url: 'https://flashfest.com.br/15-anos',
    siteName: 'FlashFest',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Festa de 15 Anos com Telão Interativo - FlashFest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telão Interativo e Câmera Descartável para Festa de 15 Anos | FlashFest',
    description: 'A pista de dança da festa de 15 anos muito mais animada com projeção de fotos ao vivo no telão.',
    images: ['/og-image.png'],
  },
};

export default async function DebutantesPage() {
  const session = await auth();
  const isLogado = !!session;

  async function fazerLogin() {
    'use server';
    await signIn('google', { redirectTo: '/dashboard' });
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Início',
            item: 'https://flashfest.com.br',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '15 Anos',
            item: 'https://flashfest.com.br/15-anos',
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://flashfest.com.br/15-anos/#webpage',
        url: 'https://flashfest.com.br/15-anos',
        name: 'Telão Interativo e Câmera Descartável para Festa de 15 Anos | FlashFest',
        description: 'Plataforma de telão interativo com filtros de câmera descartável e clipes de 15s para festas de debutante.',
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Como os jovens tiram fotos na festa de 15 anos?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Basta apontar a câmera do celular para o QR Code espalhado na festa (totens, plaquinhas de mesa e adesivos). O navegador abre na hora, sem precisar de cadastro longo ou baixar aplicativo na App Store/Play Store.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como funciona a estética de câmera descartável?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A interface do FlashFest simula a pegada retrô e nostálgica que a Geração Z ama: filtros Vintage, Preto & Branco e Sépia, além da possibilidade de gravar mensagens diretamente na foto.',
            },
          },
          {
            '@type': 'Question',
            name: 'Dá para gravar vídeos na pista de dança?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim! Nos planos Pro, VIP e VIP+, os convidados podem gravar clipes curtos de até 15 segundos que passam no telão com alta energia durante o auge da balada.',
            },
          },
          {
            '@type': 'Question',
            name: 'Os pais conseguem controlar o que vai para o telão?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim! O sistema possui o Modo de Moderação. Os pais ou o cerimonial podem aprovar ou recusar fotos em um clique pelo próprio celular antes de serem projetadas no telão.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 selection:bg-purple-500/30 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] opacity-40 animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-pink-800/20 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/20 via-zinc-950/80 to-zinc-950/100 z-0"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-white font-[family-name:var(--font-jakarta)]">
          Flash<span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Fest</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition">
            &larr; Voltar à Página Principal
          </Link>
          {isLogado ? (
            <Link href="/dashboard" className="text-xs sm:text-sm font-medium bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-400 transition font-semibold">
              Meu Painel &rarr;
            </Link>
          ) : (
            <form action={fazerLogin}>
              <button type="submit" className="text-xs sm:text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition font-semibold">
                Criar Festa Grátis
              </button>
            </form>
          )}
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Início</Link>
          <span>/</span>
          <span className="text-purple-400 font-medium">15 Anos & Debutantes</span>
        </nav>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm font-medium mb-6">
            <span>👑</span>
            <span>A sensação das Festas de 15 Anos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 font-[family-name:var(--font-jakarta)] leading-[1.15]">
            A vibe da câmera descartável, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              ao vivo no telão da sua festa de 15 anos.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Seus amigos escaneiam o QR Code na pista, tiram fotos com filtros retrô e gravam clipes de 15 segundos que passam instantaneamente no telão da balada. Sem baixar nenhum app!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-base"
              >
                Criar Festa de 15 Anos Grátis &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-base"
                >
                  Criar Festa de 15 Anos Grátis &rarr;
                </button>
              </form>
            )}
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-base"
            >
              Testar QR Code de Demonstração
            </Link>
          </div>
        </section>

        {/* 4 PILARES DA FESTA DE 15 ANOS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Por que as debutantes e os convidados se apaixonam pelo FlashFest?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Tudo foi desenhado para garantir que a pista de dança nunca esvazie.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(168, 85, 247, 0.18)" borderColor="rgba(192, 132, 252, 0.4)">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Filtros Retrô Estilosos</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Filtros Vintage, P&B e cores analógicas que dão um ar cinematográfico às fotos dos amigos.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(168, 85, 247, 0.18)" borderColor="rgba(192, 132, 252, 0.4)">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Vídeos de 15 Segundos</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Grave coreografias, brindes e loucuras da pista de dança que passam com áudio e movimento no telão.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(168, 85, 247, 0.18)" borderColor="rgba(192, 132, 252, 0.4)">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Sem Instalar Aplicativo</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Ninguém precisa apagar arquivos no celular para baixar app. Apontou a câmera, abriu na hora no Safari/Chrome.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(168, 85, 247, 0.18)" borderColor="rgba(192, 132, 252, 0.4)">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Tranquilidade para os Pais</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Moderação completa direto no celular dos pais ou do cerimonialista para garantir uma festa impecável.
              </p>
            </SpotlightCard>
          </div>
        </section>

        {/* DEPOIMENTO 15 ANOS */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-zinc-900/40 border border-purple-500/20 rounded-3xl p-8 sm:p-12 text-center relative shadow-[0_0_50px_rgba(168,85,247,0.1)]">
            <div className="text-purple-400 text-xl mb-4">★★★★★</div>
            <p className="text-zinc-200 text-base sm:text-xl font-light italic leading-relaxed mb-6">
              &ldquo;A festa de 15 anos da minha filha foi um estouro! Ela não queria aquela cabine de fotos tradicional que ocupa metade do salão. Colocamos o QR Code nos adesivos e no telão da pista: os amigos dela não pararam de gravar clipes e tirar fotos. No final, baixamos tudo em ZIP para guardar de lembrança!&rdquo;
            </p>
            <div className="font-bold text-white text-base">Camila F. (Mãe da Debutante)</div>
            <div className="text-xs text-zinc-500">Festa de 15 Anos em Brasília / DF • 180 Convidados</div>
          </div>
        </section>

        {/* FAQ 15 ANOS */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 font-[family-name:var(--font-jakarta)]">
            Perguntas Frequentes sobre 15 Anos
          </h2>

          <div className="space-y-4">
            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como funciona para passar no telão da pista de dança?</span>
                <span className="text-purple-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                O DJ ou responsável pelo telão/painel de LED só precisa abrir o link do telão em tela cheia no computador dele. O FlashFest atualiza tudo de forma automática, com transições suaves e design cinematográfico.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>A aniversariante ganha todas as fotos no final?</span>
                <span className="text-purple-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Sim! Pelo painel de controle, você tem acesso ao botão de download em ZIP com todas as fotos e vídeos em qualidade original para postar nos stories ou guardar no álbum.
              </p>
            </details>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="bg-gradient-to-b from-purple-950/40 to-zinc-900/60 border border-purple-500/30 rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-jakarta)]">
              Faça dos 15 anos um evento lendário!
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
              Crie seu evento gratuitamente, teste a interface no seu próprio celular e garanta o sucesso da pista.
            </p>
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-base"
              >
                Criar Festa de 15 Anos Grátis &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="inline-block">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-base"
                >
                  Criar Festa de 15 Anos Grátis &rarr;
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 pt-12 pb-8 bg-black/40 backdrop-blur-xl text-center text-xs text-zinc-500 font-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm font-bold text-white">
            Flash<span className="text-emerald-500">Fest</span> 15 Anos
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Início</Link>
            <Link href="/casamentos" className="hover:text-zinc-300 transition-colors">Casamentos</Link>
            <Link href="/termos" className="hover:text-zinc-300 transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">Privacidade</Link>
          </div>
          <p>© {new Date().getFullYear()} FlashFest. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
