import { auth, signIn } from '@/auth';
import Link from 'next/link';
import { Metadata } from 'next';
import SpotlightCard from '@/components/SpotlightCard';

export const metadata: Metadata = {
  title: 'Telão Interativo para Casamentos | Fotos ao Vivo & Alternativa à Cabine | FlashFest',
  description: 'Surpreenda seus convidados no casamento com fotos no telão em tempo real. Monograma dos noivos, mensagens carinhosas, filtros retrô e download em ZIP sem instalar app.',
  keywords: [
    'telão interativo casamento',
    'fotos casamento telão',
    'alternativa cabine de fotos casamento',
    'câmera descartável casamento',
    'fotos convidados telão ao vivo',
    'mural digital casamento',
    'slideshow casamento tempo real'
  ],
  alternates: {
    canonical: '/casamentos',
  },
  openGraph: {
    title: 'Telão Interativo para Casamentos | FlashFest',
    description: 'Seus convidados escaneiam o QR Code nas mesas e as fotos aparecem instantaneamente no telão do salão com monograma dos noivos e mensagens de carinho.',
    url: 'https://flashfest.com.br/casamentos',
    siteName: 'FlashFest',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Telão Interativo para Casamentos - FlashFest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telão Interativo para Casamentos | FlashFest',
    description: 'Transforme as fotos dos convidados em um espetáculo no telão do seu casamento em tempo real.',
    images: ['/og-image.png'],
  },
};

export default async function CasamentosPage() {
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
            name: 'Casamentos',
            item: 'https://flashfest.com.br/casamentos',
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://flashfest.com.br/casamentos/#webpage',
        url: 'https://flashfest.com.br/casamentos',
        name: 'Telão Interativo para Casamentos | FlashFest',
        description: 'Plataforma de telão interativo e compartilhamento de fotos em tempo real para casamentos e noivados.',
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'O FlashFest substitui a cabine de fotos tradicional no casamento?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim! Enquanto as cabines físicas custam a partir de R$ 2.000 e formam filas no salão, o FlashFest permite que todos os convidados tirem fotos espontâneas das mesas e da pista com o próprio celular, projetando tudo no telão em tempo real por uma fração do custo.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como colocar o monograma ou logotipo dos noivos no telão?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No seu painel FlashFest, você faz upload do brasão ou monograma do casal em PNG com fundo transparente. Ele fica flutuando elegantemente no canto do telão durante toda a festa.',
            },
          },
          {
            '@type': 'Question',
            name: 'Os convidados precisam instalar algum aplicativo?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Não! Os convidados apenas apontam a câmera do celular para o QR Code nas plaquinhas das mesas e o aplicativo web abre diretamente no navegador (Safari ou Chrome), sem nenhum download.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como os noivos recebem todas as fotos após o casamento?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No painel dos noivos, há um botão de Download em ZIP com todas as fotos e vídeos em resolução original, além de um link de Galeria Pública para compartilhar com a família pelo WhatsApp.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 selection:bg-emerald-500/30 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-900/15 rounded-full blur-[120px] opacity-40 animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-emerald-800/15 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950/80 to-zinc-950/100 z-0"></div>
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
            <Link href="/dashboard" className="text-xs sm:text-sm font-medium bg-emerald-500 text-zinc-950 px-4 py-2 rounded-full hover:bg-emerald-400 transition font-semibold">
              Meu Painel &rarr;
            </Link>
          ) : (
            <form action={fazerLogin}>
              <button type="submit" className="text-xs sm:text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition font-semibold">
                Criar Evento Grátis
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
          <span className="text-emerald-400 font-medium">Casamentos</span>
        </nav>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm font-medium mb-6">
            <span>💍</span>
            <span>Telão Interativo para Casamentos & Noivados</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 font-[family-name:var(--font-jakarta)] leading-[1.15]">
            O momento mais especial da sua vida, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-rose-300">
              projetado ao vivo no telão.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Seus convidados escaneiam o QR Code nas mesas, tiram fotos com a estética de <strong className="text-white font-medium">câmera descartável</strong>, escrevem recados carinhosos e tudo aparece instantaneamente no telão da festa. Sem filas de cabines e sem instalar nada.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-base"
              >
                Criar Meu Casamento Grátis &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-base"
                >
                  Criar Meu Casamento Grátis &rarr;
                </button>
              </form>
            )}
            <a
              href="#comparativo"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-base"
            >
              Comparar com Cabine Tradicional
            </a>
          </div>
        </section>

        {/* COMPARATIVO: FLASHFEST VS CABINE TRADICIONAL */}
        <section id="comparativo" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Por que noivos e cerimonialistas trocam a cabine pelo FlashFest?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Uma experiência muito mais dinâmica, sem filas intermináveis na pista de dança e com economia real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cabine Tradicional */}
            <div className="bg-zinc-900/30 border border-red-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">❌</span>
                <h3 className="text-lg sm:text-xl font-bold text-red-400">Cabine de Fotos Física</h3>
              </div>
              <ul className="space-y-4 text-sm text-zinc-400 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Custa caro:</strong> Preços partem de R$ 2.000 a R$ 4.500 por apenas 4 horas de festa.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Filas chatas:</strong> Seus convidados perdem tempo em pé na fila em vez de curtir a pista de dança.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Fotos limitadas:</strong> Registra apenas quem vai até a cabine; as mesas e a pista ficam de fora.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Ocupa espaço:</strong> Exige estrutura pesada, tomadas e montagem que interferem no layout do salão.</span>
                </li>
              </ul>
            </div>

            {/* FlashFest */}
            <div className="bg-zinc-900/50 border border-emerald-500/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">✨</span>
                <h3 className="text-lg sm:text-xl font-bold text-emerald-400">Telão FlashFest</h3>
              </div>
              <ul className="space-y-4 text-sm text-zinc-300 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Economia de até 90%:</strong> Planos a partir de R$ 99 com evento ativo a noite toda.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Zero filas:</strong> Cada convidado fotografa do seu próprio assento ou direto da pista.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Monograma dos Noivos:</strong> O brasão do casamento fica flutuando com perfeição no telão.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Download em ZIP:</strong> Todas as memórias salvas em alta qualidade para o álbum dos noivos.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4 BENEFÍCIOS ESPECÍFICOS PARA CASAMENTO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Pensado nos mínimos detalhes para o grande dia
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Facilidade para quem organiza, emoção garantida para os convidados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="text-4xl mb-4">💌</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Recados de Amor</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Padrinhos e familiares enviam mensagens de carinho gravadas diretamente sobre as fotos antes de projetar no telão.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Brasão do Casal</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Suba o monograma ou logotipo do casamento em PNG. Ele se integra elegantemente à exibição no projetor ou TV.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="text-4xl mb-4">🪑</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Enxoval de Mesa no Canva</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Você recebe templates editáveis de plaquinhas para imprimir e colocar nas mesas dos convidados combinando com a decoração.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Moderação Discreta</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Seu cerimonialista ou padrinho pode aprovar fotos pelo celular antes de irem ao ar, mantendo tudo impecável.
              </p>
            </SpotlightCard>
          </div>
        </section>

        {/* DEPOIMENTO CASAMENTO */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 sm:p-12 text-center relative">
            <div className="text-emerald-400 text-xl mb-4">★★★★★</div>
            <p className="text-zinc-200 text-base sm:text-xl font-light italic leading-relaxed mb-6">
              &ldquo;Contratar o FlashFest para o nosso casamento foi uma das melhores decisões! Nossos amigos e parentes mais velhos conseguiram participar facilmente só apontando a câmera. O telão ficou animadíssimo e no dia seguinte baixamos mais de 800 fotos espontâneas que o fotógrafo oficial nem tinha como pegar!&rdquo;
            </p>
            <div className="font-bold text-white text-base">Mariana & Lucas</div>
            <div className="text-xs text-zinc-500">Casamento em Goiânia / GO • 220 Convidados</div>
          </div>
        </section>

        {/* FAQ CASAMENTOS */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 font-[family-name:var(--font-jakarta)]">
            Perguntas Frequentes de Noivos e Cerimonialistas
          </h2>

          <div className="space-y-4">
            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Precisa de internet de alta velocidade no salão de festas?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                O FlashFest é extremamente leve e otimizado. As fotos são comprimidas com inteligência no próprio celular do convidado antes do envio. Funciona com folga em conexões Wi-Fi comuns de salão ou no 4G dos celulares.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como funciona para abrir o telão no salão?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Basta um notebook conectado à TV ou ao projetor do salão via cabo HDMI. No seu painel FlashFest, você clica em "Abrir Telão", coloca o navegador em tela cheia (F11) e ele funciona automaticamente a noite inteira.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>E se alguém mandar uma foto inadequada?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Você pode deixar o <strong className="text-white">Modo de Moderação Manual</strong> ativado. Assim, cada foto fica aguardando a aprovação pelo celular dos noivos ou da assessoria antes de ir ao telão. Ou, no modo automático, você tem um botão de exclusão instantânea.
              </p>
            </details>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="bg-gradient-to-b from-emerald-950/40 to-zinc-900/60 border border-emerald-500/30 rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-jakarta)]">
              Pronto para surpreender seus convidados?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
              Crie seu evento gratuitamente agora mesmo, teste no celular e encante todos no seu casamento.
            </p>
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-base"
              >
                Criar Meu Casamento Grátis &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="inline-block">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-base"
                >
                  Criar Meu Casamento Grátis &rarr;
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
            Flash<span className="text-emerald-500">Fest</span> Casamentos
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Início</Link>
            <Link href="/termos" className="hover:text-zinc-300 transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">Privacidade</Link>
          </div>
          <p>© {new Date().getFullYear()} FlashFest. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
