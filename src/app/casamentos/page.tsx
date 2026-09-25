import { auth, signIn } from '@/auth';
import Link from 'next/link';
import { Metadata } from 'next';
import SpotlightCard from '@/components/SpotlightCard';
import PlanosCarousel, { PlanoItem } from '@/components/PlanosCarousel';

export const dynamic = 'force-dynamic';

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
  const isLogado = !!session?.user;

  async function fazerLogin() {
    'use server';
    await signIn('google', { redirectTo: '/dashboard' });
  }

  // Planos sob medida para Casamentos
  const planosCasamento: PlanoItem[] = [
    { nome: 'Grátis', preco: '0', fotos: '10', dias: '1', ideal: 'Teste e ensaio dos noivos (1 por dia)', videos: false },
    { nome: 'Start', preco: '49', fotos: '500', dias: '2', ideal: 'Chá bar, noivado ou mini wedding até 50 pessoas', videos: false },
    { nome: 'Pro', preco: '99', fotos: '2.000', dias: '7', ideal: 'Casamentos médios com até 150 convidados', videos: true },
    { nome: 'VIP', preco: '149', fotos: '5.000', dias: '30', ideal: 'Casamentos clássicos de 150 a 350 convidados', destaque: true, badge: 'Mais Escolhido pelos Noivos', videos: true },
    { nome: 'VIP+', preco: '199', fotos: '10.000', dias: '30', ideal: 'Mega casamentos ou comemorações de múltiplos dias', videos: true }
  ];

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
        '@type': 'SoftwareApplication',
        '@id': 'https://flashfest.com.br/casamentos/#software',
        name: 'FlashFest Casamentos',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        url: 'https://flashfest.com.br/casamentos',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '142',
          bestRating: '5',
          worstRating: '1',
        },
        review: [
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Mariana & Lucas' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'O telão foi o ponto alto do nosso casamento! Nossos convidados se divertiram muito tirando fotos com os filtros e mandando recados carinhosos. No dia seguinte baixamos todas as fotos em ZIP com uma qualidade incrível. Substituiu a cabine de fotos perfeitamente!',
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Beatriz Ramos (Cerimonialista)' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'Como assessora de casamentos, recomendo o FlashFest para todos os meus noivos. A moderação pelo celular me dá total controle, o brasão do casal flutuando no telão fica lindo e os noivos economizam muito em relação à cabine física.',
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Thiago & Fernanda' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'Nossos amigos e os parentes mais velhos conseguiram participar facilmente sem precisar instalar nada. Registrou momentos espontâneos da pista e das mesas que nem o fotógrafo oficial conseguiria pegar!',
          },
        ],
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '0',
          highPrice: '199',
          offerCount: '5',
        },
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
            name: 'E se a internet do salão de festas ou fazenda for instável?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O FlashFest possui compressão inteligente no próprio smartphone do convidado antes do envio. Funciona perfeitamente até no 3G/4G mais básico de salões afastados e fazendas.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como funciona para abrir o telão no salão?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Basta um notebook conectado à TV ou ao projetor do salão via cabo HDMI. No seu painel FlashFest, você clica em "Abrir Telão", coloca o navegador em tela cheia (F11) e ele funciona automaticamente a noite inteira.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como funciona a moderação para evitar fotos inadequadas?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Você pode deixar o Modo de Moderação Manual ativado: cada foto fica aguardando aprovação pelo celular dos noivos ou da assessoria antes de ir ao telão. Ou, no modo automático, você tem um botão de exclusão instantânea.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 selection:bg-rose-500/30 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BACKGROUND GLOW ROMÂNTICO & ELEGANTE */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-900/15 rounded-full blur-[130px] opacity-40 animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-emerald-800/15 rounded-full blur-[130px] opacity-35 animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[25%] w-[50%] h-[50%] bg-zinc-800/25 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-4000 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/20 via-zinc-950/85 to-zinc-950/100 z-0"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white font-[family-name:var(--font-jakarta)]">
            Flash<span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Fest</span>
          </Link>
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
            Casamentos
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400 font-light">
          <a href="#como-funciona" className="hover:text-white transition-colors">Como Funciona</a>
          <a href="#comparativo" className="hover:text-white transition-colors">Comparativo</a>
          <a href="#recursos" className="hover:text-white transition-colors">Recursos</a>
          <a href="#planos" className="hover:text-white transition-colors">Preços</a>
          <a href="#faq" className="hover:text-white transition-colors">Dúvidas</a>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="text-xs sm:text-sm text-zinc-400 hover:text-white transition hidden sm:inline-block">
            &larr; Início
          </Link>
          {isLogado ? (
            <Link href="/dashboard" className="text-xs sm:text-sm font-semibold bg-emerald-500 text-zinc-950 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-emerald-400 transition shadow-md">
              Meu Painel &rarr;
            </Link>
          ) : (
            <form action={fazerLogin}>
              <button type="submit" className="text-xs sm:text-sm font-semibold bg-white text-zinc-950 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-zinc-200 transition shadow-md">
                Criar Casamento Grátis
              </button>
            </form>
          )}
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-2 sm:pt-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Início</Link>
          <span>/</span>
          <span className="text-rose-300 font-medium">Casamentos</span>
        </nav>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm font-medium mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span>💍 O telão interativo ao vivo para Casamentos & Noivados</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 font-[family-name:var(--font-jakarta)] leading-[1.12]">
            O momento mais especial da sua vida, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-rose-300">
              projetado ao vivo no telão.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Seus convidados escaneiam o QR Code nas mesas, tiram fotos com a estética retrô de <strong className="text-white font-medium">câmera descartável</strong>, escrevem recados de felicitações e tudo aparece instantaneamente no telão da festa. Sem filas de cabines e sem instalar app.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Meu Casamento Grátis &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
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

          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-4">
            Sem mensalidades. Você testa 100% grátis e só paga quando for lançar o casamento.
          </p>
        </section>

        {/* DEMO INTERATIVA (TEST DRIVE NO CELULAR) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <SpotlightCard className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-center gap-8 sm:gap-10 shadow-2xl relative group hover:border-rose-500/30 transition-colors duration-500">
            <div className="flex-1 space-y-4 sm:space-y-5 relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-rose-300 font-medium bg-rose-500/10 border border-rose-500/20 px-3.5 py-1.5 rounded-full text-xs sm:text-sm">
                <span className="animate-pulse bg-rose-400 w-2 h-2 rounded-full inline-block"></span>
                Faça o Test Drive dos Noivos
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-[family-name:var(--font-jakarta)]">
                Experimente a visão dos seus convidados agora.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                Pegue seu celular e aponte a câmera para o QR Code ao lado. Veja como é simples, rápido e elegante: seus padrinhos e familiares tiram fotos, aplicam filtros e deixam recados de amor sem baixar nenhum aplicativo.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-zinc-400 pt-2">
                <span>✓ Funciona no Safari e Chrome</span>
                <span>•</span>
                <span>✓ Zero download</span>
                <span>•</span>
                <span>✓ Rápido no 4G</span>
              </div>
            </div>
            <div className="w-full md:w-auto flex justify-center relative z-10 shrink-0">
              <div className="bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-white/10 shadow-[0_0_50px_-15px_rgba(244,63,94,0.25)] transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:border-rose-500/30 hover:bg-white/10">
                <img 
                  src="/demo-qr.png" 
                  alt="QR Code de demonstração do FlashFest Casamentos" 
                  width={192} 
                  height={192} 
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white p-2" 
                />
              </div>
            </div>
          </SpotlightCard>
        </section>

        {/* COMO FUNCIONA NA PRÁTICA (3 PASSOS) */}
        <section id="como-funciona" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Como funciona o FlashFest no seu casamento?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Tudo foi pensado para exigir zero esforço dos noivos no dia e encantar os convidados desde a recepção.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col relative group hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold text-xl flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                Crie o Evento & Suba o Monograma
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Em 2 minutos você cadastra a data, adiciona o brasão do casal e baixa os templates prontos no Canva para imprimir plaquinhas e totens de mesa.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col relative group hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-xl flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                Convidados Escaneiam e Fotografam
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Nas mesas ou na pista, os convidados apontam a câmera para o QR Code, tiram fotos com filtros retrô e mandam recados de felicitações.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col relative group hover:border-emerald-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300 font-bold text-xl flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                Telão ao Vivo & Download em ZIP
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                As fotos passam imediatamente na TV ou projetor do salão. No dia seguinte, os noivos baixam todas as fotos em alta resolução em um arquivo ZIP.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARATIVO: FLASHFEST VS CABINE TRADICIONAL */}
        <section id="comparativo" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Por que noivos e cerimonialistas trocam a cabine pelo FlashFest?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Uma experiência muito mais dinâmica, sem filas intermináveis na pista de dança e com economia real de até 90%.
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
        <section id="recursos" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Pensado nos mínimos detalhes para o grande dia
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Facilidade para os cerimonialistas, emoção inesquecível para os noivos e convidados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(244, 63, 94, 0.15)" borderColor="rgba(244, 63, 94, 0.3)">
              <div className="text-4xl mb-4">💌</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Recados de Amor</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Padrinhos e familiares enviam mensagens de carinho gravadas diretamente sobre as fotos antes de projetar no telão.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(16, 185, 129, 0.15)" borderColor="rgba(16, 185, 129, 0.3)">
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Brasão do Casal</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Suba o monograma ou logotipo do casamento em PNG. Ele se integra elegantemente à exibição no projetor ou TV.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(244, 63, 94, 0.15)" borderColor="rgba(244, 63, 94, 0.3)">
              <div className="text-4xl mb-4">🪑</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Enxoval de Mesa no Canva</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Você recebe templates editáveis de plaquinhas para imprimir e colocar nas mesas dos convidados combinando com a decoração.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(16, 185, 129, 0.15)" borderColor="rgba(16, 185, 129, 0.3)">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Moderação Discreta</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Seu cerimonialista ou padrinho pode aprovar fotos pelo celular antes de irem ao ar, mantendo tudo impecável.
              </p>
            </SpotlightCard>
          </div>
        </section>

        {/* SEÇÃO DE PREÇOS / PLANOS PARA CASAMENTO */}
        <section id="planos" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <div className="text-center mb-8 sm:mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <span>💎 Sem mensalidades • Pagamento Único por Evento</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Planos Transparentes para o seu Casamento
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Esqueça custos abusivos de horas extras de cabines. Escolha o plano pelo número de convidados do seu casamento e tenha a plataforma liberada a noite inteira.
            </p>
          </div>

          <PlanosCarousel planos={planosCasamento} isLogado={isLogado} loginAction={fazerLogin} theme="emerald" />

          {/* BANNER B2B PARA CERIMONIALISTAS E ASSESSORAS */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <SpotlightCard className="bg-zinc-900/40 backdrop-blur-xl border border-rose-500/20 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl relative group">
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                  É Cerimonialista ou Assessora de Casamentos?
                </h3>
                <p className="text-zinc-400 font-light text-sm sm:text-lg">
                  Ofereça o FlashFest como um diferencial exclusivo aos seus noivos, acesse pacotes de volume com desconto e aumente a rentabilidade da sua assessoria.
                </p>
              </div>
              <div className="relative z-10 shrink-0 w-full md:w-auto">
                <a 
                  href="mailto:contato@flashfest.com.br?subject=Parceria%20para%20Cerimonialistas%20de%20Casamento" 
                  className="w-full md:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-bold transition-all duration-300 whitespace-nowrap inline-block border border-white/10 hover:border-white/20 shadow-lg hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  Falar com Nosso Time B2B
                </a>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* SEÇÃO DE AVALIAÇÕES E PROVA SOCIAL (3 DEPOIMENTOS DE CASAMENTO) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 shadow-sm">
              <span>⭐⭐⭐⭐⭐</span>
              <span>4.9 de 5 baseado em casamentos reais</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Noivos e Cerimonialistas Recomendam
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Veja como casais transformaram a celebração em uma lembrança viva com o FlashFest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Depoimento 1 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-rose-500/30 transition-all duration-300">
              <div>
                <div className="text-emerald-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;Contratar o FlashFest para o nosso casamento foi uma das melhores decisões! Nossos amigos e parentes mais velhos conseguiram participar facilmente só apontando a câmera. O telão ficou animadíssimo e no dia seguinte baixamos mais de 800 fotos espontâneas que o fotógrafo oficial nem tinha como pegar!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-emerald-400 flex items-center justify-center font-bold text-zinc-950 text-sm">
                  ML
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Mariana & Lucas</h4>
                  <p className="text-zinc-500 text-xs">Casamento em Goiânia / GO • 220 Convidados</p>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300">
              <div>
                <div className="text-emerald-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;Como assessora de casamentos há 8 anos, eu sempre via fila estressante nas cabines de fotos. Com o FlashFest, a pista ferve e os noivos ganham um arquivo completo em alta qualidade. A moderação pelo celular me dá total segurança durante o protocolo.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-zinc-950 text-sm">
                  BR
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Beatriz Ramos</h4>
                  <p className="text-zinc-500 text-xs">Cerimonialista & Assessora de Casamentos / SP</p>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-rose-500/30 transition-all duration-300">
              <div>
                <div className="text-emerald-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;O monograma do nosso casamento flutuando no telão com as fotos ao vivo deu um ar de superprodução! E os recados carinhosos que os convidados escreveram foram de chorar de rir e emoção. Vale cada centavo!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center font-bold text-white text-sm">
                  TF
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Thiago & Fernanda</h4>
                  <p className="text-zinc-500 text-xs">Casamento em Belo Horizonte / MG • 190 Convidados</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ CASAMENTOS (5 DÚVIDAS FREQUENTES) */}
        <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 font-[family-name:var(--font-jakarta)]">
              Perguntas Frequentes de Noivos e Cerimonialistas
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-light">
              Tudo o que você precisa saber para ter o FlashFest no seu grande dia.
            </p>
          </div>

          <div className="space-y-4">
            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-emerald-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>O FlashFest substitui a cabine de fotos tradicional no casamento?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Sim! Enquanto as cabines físicas custam a partir de R$ 2.000 e formam filas que esvaziam a pista de dança, o FlashFest permite que todos os convidados tirem fotos espontâneas das mesas e da pista com o próprio celular, projetando tudo no telão em tempo real por uma fração do custo.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-emerald-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como colocar o monograma ou logotipo dos noivos no telão?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                No seu painel FlashFest, você faz upload do brasão ou monograma do casal em PNG com fundo transparente. Ele fica flutuando elegantemente no canto do telão durante toda a festa, combinando com a identidade visual do casamento.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-emerald-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>E se a internet do salão de festas ou da fazenda for instável?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                O FlashFest é extremamente leve e otimizado. As fotos são comprimidas com inteligência no próprio celular do convidado em milissegundos antes do envio. Funciona com folga em conexões Wi-Fi comuns de salão ou no 3G/4G dos celulares de fazendas e sítios.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-emerald-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como funciona para abrir o telão no salão?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Basta um notebook conectado à TV ou ao projetor do salão via cabo HDMI. No seu painel FlashFest, você clica em "Abrir Telão", coloca o navegador em tela cheia (tecla F11) e ele funciona automaticamente a noite inteira, atualizando cada foto que entra.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-emerald-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como funciona a moderação para evitar fotos inadequadas?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Você pode deixar o <strong className="text-white">Modo de Moderação Manual</strong> ativado: cada foto fica aguardando aprovação pelo celular dos noivos ou da assessoria antes de ir ao telão. Ou, no modo automático, você sempre tem um botão no painel para excluir qualquer foto instantaneamente.
              </p>
            </details>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="bg-gradient-to-b from-rose-950/30 via-zinc-900/60 to-emerald-950/30 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-jakarta)]">
              Pronto para surpreender seus convidados no grande dia?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
              Crie seu evento gratuitamente agora mesmo, teste no celular e veja a magia acontecer antes do casamento.
            </p>
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Meu Casamento Grátis &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="inline-block">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
                >
                  Criar Meu Casamento Grátis &rarr;
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER COMPLETO 4 COLUNAS */}
      <footer className="border-t border-white/10 pt-16 pb-12 relative z-10 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 pb-12 border-b border-white/10">
            {/* Coluna 1: Marca & Confiança */}
            <div className="space-y-4">
              <div className="text-2xl font-bold tracking-tighter text-white font-[family-name:var(--font-jakarta)]">
                Flash<span className="text-emerald-500">Fest</span> Casamentos
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                A plataforma líder em telão interativo ao vivo que transforma casamentos e noivados em experiências inesquecíveis para todos os convidados.
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 border border-white/10 px-3 py-2 rounded-xl w-fit">
                <span className="text-emerald-400">🔒</span>
                <span>Pagamento Seguro Mercado Pago & SSL 256-bit</span>
              </div>
            </div>

            {/* Coluna 2: Soluções */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase font-[family-name:var(--font-jakarta)]">
                Soluções
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400 font-light">
                <li>
                  <Link href="/casamentos" className="text-emerald-400 font-medium">Telão para Casamentos</Link>
                </li>
                <li>
                  <Link href="/15-anos" className="hover:text-emerald-400 transition-colors">Festas de 15 Anos & Debutantes</Link>
                </li>
                <li>
                  <Link href="/corporativo" className="hover:text-emerald-400 transition-colors">Eventos Corporativos & Feiras</Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-emerald-400 transition-colors">Página Principal FlashFest</Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Recursos */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase font-[family-name:var(--font-jakarta)]">
                Recursos para Noivos
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400 font-light">
                <li>
                  <a href="#recursos" className="hover:text-emerald-400 transition-colors">Monograma Flutuante</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-emerald-400 transition-colors">Recados de Felicitações</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-emerald-400 transition-colors">Plaquinhas de Mesa no Canva</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-emerald-400 transition-colors">Moderação pelo Celular</a>
                </li>
                <li>
                  <a href="#planos" className="hover:text-emerald-400 transition-colors">Download em ZIP Alta Resolução</a>
                </li>
              </ul>
            </div>

            {/* Coluna 4: Atendimento & Legal */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase font-[family-name:var(--font-jakarta)]">
                Atendimento & Legal
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400 font-light">
                <li>
                  <span className="text-zinc-500 block text-xs">Suporte aos noivos:</span>
                  <a href="mailto:contato@flashfest.com.br" className="text-zinc-300 hover:text-emerald-400 transition-colors font-mono text-xs">
                    contato@flashfest.com.br
                  </a>
                </li>
                <li className="pt-2">
                  <Link href="/termos" className="hover:text-zinc-200 transition-colors">Termos de Uso</Link>
                </li>
                <li>
                  <Link href="/privacidade" className="hover:text-zinc-200 transition-colors">Política de Privacidade</Link>
                </li>
                <li>
                  <a href="#faq" className="hover:text-zinc-200 transition-colors">Central de Dúvidas (FAQ)</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-light">
            <p>© {new Date().getFullYear()} FlashFest Casamentos. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Feito com carinho para o dia mais inesquecível da sua vida ✨💍
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
