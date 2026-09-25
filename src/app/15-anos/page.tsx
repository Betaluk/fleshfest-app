import { auth, signIn } from '@/auth';
import Link from 'next/link';
import { Metadata } from 'next';
import SpotlightCard from '@/components/SpotlightCard';
import PlanosCarousel, { PlanoItem } from '@/components/PlanosCarousel';

export const dynamic = 'force-dynamic';

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
  const isLogado = !!session?.user;

  async function fazerLogin() {
    'use server';
    await signIn('google', { redirectTo: '/dashboard' });
  }

  // Planos sob medida para Festas de 15 Anos e Debutantes
  const planosDebutante: PlanoItem[] = [
    { nome: 'Grátis', preco: '0', fotos: '10', dias: '1', ideal: 'Teste antes da festa com as melhores amigas (1 por dia)', videos: false },
    { nome: 'Start', preco: '49', fotos: '500', dias: '2', ideal: 'Pré-15 anos, ensaio fotográfico ou recepção íntima até 50 pessoas', videos: false },
    { nome: 'Pro', preco: '99', fotos: '2.000', dias: '7', ideal: 'Festas de 15 anos até 150 amigos com vídeos de 15s na pista', destaque: true, badge: 'Favorito das Debutantes', videos: true },
    { nome: 'VIP', preco: '149', fotos: '5.000', dias: '30', ideal: 'Grandes festas de 15 anos (150 a 350 convidados e balada longa)', videos: true },
    { nome: 'VIP+', preco: '199', fotos: '10.000', dias: '30', ideal: 'Megafestas com mais de 350 convidados e acervo guardado por 30 dias', videos: true }
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
        '@type': 'SoftwareApplication',
        '@id': 'https://flashfest.com.br/15-anos/#software',
        name: 'FlashFest 15 Anos',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        url: 'https://flashfest.com.br/15-anos',
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
            author: { '@type': 'Person', name: 'Camila F. (Mãe da Debutante)' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'A festa de 15 anos da minha filha foi um estouro! Ela não queria aquela cabine de fotos tradicional que ocupa metade do salão. Colocamos o QR Code nos adesivos e no telão da pista: os amigos dela não pararam de gravar clipes e tirar fotos. No final, baixamos tudo em ZIP para guardar de lembrança!',
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Isabella M. (Debutante)' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'Foi a melhor parte da balada! Meus amigos gravavam vídeos dançando na pista e na mesma hora aparecia no telão gigante. Os filtros retrô ficaram muito perfeitos, todo mundo postou nos stories no dia seguinte!',
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'DJ Rafael Alves' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'Como DJ especializado em festas de 15 anos, vejo que o FlashFest muda a energia do evento. Os jovens não saem da pista porque ficam dançando e vendo suas fotos no painel de LED. Simples de rodar no notebook do palco.',
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
          {
            '@type': 'Question',
            name: 'A debutante ganha todas as fotos no final da festa?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim! Pelo painel de controle, você tem acesso ao botão de download em ZIP com todas as fotos e vídeos em qualidade original para postar nos stories ou guardar no álbum da família.',
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

      {/* BACKGROUND GLOW VIBRANTE & BALADA */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[130px] opacity-40 animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-pink-800/20 rounded-full blur-[130px] opacity-35 animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[25%] w-[50%] h-[50%] bg-zinc-800/30 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-4000 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-950/25 via-zinc-950/85 to-zinc-950/100 z-0"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white font-[family-name:var(--font-jakarta)]">
            Flash<span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Fest</span>
          </Link>
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
            15 Anos
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
            <Link href="/dashboard" className="text-xs sm:text-sm font-semibold bg-purple-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-purple-400 transition shadow-md">
              Meu Painel &rarr;
            </Link>
          ) : (
            <form action={fazerLogin}>
              <button type="submit" className="text-xs sm:text-sm font-semibold bg-white text-zinc-950 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-zinc-200 transition shadow-md">
                Criar Festa Grátis
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
          <span className="text-purple-400 font-medium">15 Anos & Debutantes</span>
        </nav>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs sm:text-sm font-medium mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span>👑 A sensação das Festas de 15 Anos & Debutantes</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 font-[family-name:var(--font-jakarta)] leading-[1.12]">
            A vibe da câmera descartável, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
              ao vivo no telão dos seus 15 anos.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Seus amigos escaneiam o QR Code na pista, tiram fotos com filtros retrô e gravam clipes de 15 segundos que passam instantaneamente no telão da balada. Sem baixar nenhum app!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Festa de 15 Anos Grátis &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
                >
                  Criar Festa de 15 Anos Grátis &rarr;
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
            Sem cartão de crédito. Teste a câmera agora mesmo e surpreenda seus amigos.
          </p>
        </section>

        {/* DEMO INTERATIVA (TEST DRIVE TEEN NO CELULAR) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <SpotlightCard className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-center gap-8 sm:gap-10 shadow-2xl relative group hover:border-purple-500/30 transition-colors duration-500" spotlightColor="rgba(168, 85, 247, 0.18)" borderColor="rgba(192, 132, 252, 0.35)">
            <div className="flex-1 space-y-4 sm:space-y-5 relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-purple-300 font-medium bg-purple-500/10 border border-purple-500/20 px-3.5 py-1.5 rounded-full text-xs sm:text-sm">
                <span className="animate-pulse bg-purple-400 w-2 h-2 rounded-full inline-block"></span>
                Faça o Test Drive no Celular
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-[family-name:var(--font-jakarta)]">
                Veja os filtros retrô no seu próprio celular.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                Aponte a câmera do seu smartphone para o QR Code ao lado. Experimente a interface estilo câmera descartável com filtros Vintage, P&B e mensagens carinhosas gravadas na hora.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-zinc-400 pt-2">
                <span>✓ Abre direto no Safari/Chrome</span>
                <span>•</span>
                <span>✓ Filtros analógicos</span>
                <span>•</span>
                <span>✓ Envio em milissegundos</span>
              </div>
            </div>
            <div className="w-full md:w-auto flex justify-center relative z-10 shrink-0">
              <div className="bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-white/10 shadow-[0_0_50px_-15px_rgba(168,85,247,0.25)] transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:border-purple-500/30 hover:bg-white/10">
                <img 
                  src="/demo-qr.png" 
                  alt="QR Code de demonstração do FlashFest 15 Anos" 
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
              Como funciona na sua festa de 15 anos?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Tudo é 100% digital, interativo e sem precisar de equipe técnica pesada no salão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col relative group hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 font-bold text-xl flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                Crie a Festa & Baixe as Plaquinhas
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Em poucos minutos você cria seu evento, personaliza a capa com foto da debutante e recebe modelos prontos no Canva para espalhar nas mesas.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col relative group hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-300 font-bold text-xl flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                QR Code na Pista de Dança
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Seus amigos escaneiam com a câmera do celular direto na pista de dança ou nas mesas. Abre na hora sem baixar nada na loja de aplicativos.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col relative group hover:border-purple-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-xl flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                Telão Bombando & Memórias em ZIP
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Fotos e clipes de 15 segundos passam no telão do DJ em tempo real. No dia seguinte, a aniversariante baixa tudo em ZIP com qualidade máxima!
              </p>
            </div>
          </div>
        </section>

        {/* COMPARATIVO: CABINE TRADICIONAL VS FLASHFEST */}
        <section id="comparativo" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Por que as debutantes preferem o FlashFest à cabine física?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Uma experiência viva e jovem que mantém a pista fervendo a noite inteira.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cabine Física */}
            <div className="bg-zinc-900/30 border border-red-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">❌</span>
                <h3 className="text-lg sm:text-xl font-bold text-red-400">Cabine de Fotos Física</h3>
              </div>
              <ul className="space-y-4 text-sm text-zinc-400 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Fila chata:</strong> Seus amigos perdem horas na fila em vez de dançar na balada.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Fotos posadas e engessadas:</strong> Sempre as mesmas poses com plaquinhas de papelão antigas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Papel amassado:</strong> As fotos impressas acabam amassadas na bolsa ou esquecidas nas mesas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Sem suporte a vídeos:</strong> Impossível registrar os momentos mais engraçados da pista de dança.</span>
                </li>
              </ul>
            </div>

            {/* FlashFest 15 Anos */}
            <div className="bg-zinc-900/50 border border-purple-500/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">✨</span>
                <h3 className="text-lg sm:text-xl font-bold text-purple-400">Telão FlashFest</h3>
              </div>
              <ul className="space-y-4 text-sm text-zinc-300 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span><strong>Pista de dança cheia:</strong> Todos tiram fotos dançando sem sair do ritmo da balada.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span><strong>Vídeos de 15 Segundos:</strong> Grava coreografias e cantorias ao vivo que passam na tela grande.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span><strong>Filtros Retrô Cinematográficos:</strong> Estética de câmera analógica que a galera ama postar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span><strong>Download em ZIP:</strong> A debutante recebe todas as fotos e vídeos em qualidade original.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4 PILARES DA FESTA DE 15 ANOS */}
        <section id="recursos" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Por que as debutantes e convidados se apaixonam pelo FlashFest?
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
                Grave coreografias, cantorias e a energia da pista de dança que passam com som no telão.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(168, 85, 247, 0.18)" borderColor="rgba(192, 132, 252, 0.4)">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Sem Instalar Aplicativo</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Ninguém precisa apagar fotos no celular para baixar app. Apontou a câmera, abriu na hora no Safari/Chrome.
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

        {/* SEÇÃO DE PREÇOS / PLANOS PARA 15 ANOS */}
        <section id="planos" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <div className="text-center mb-8 sm:mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4">
              <span>👑 A melhor festa pelo melhor preço • Sem Mensalidades</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Planos Perfeitos para a sua Balada de 15 Anos
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Esqueça os R$ 2.500 de cabines físicas tradicionais. Escolha o plano pelo tamanho da sua festa e garanta a pista mais animada da cidade.
            </p>
          </div>

          <PlanosCarousel planos={planosDebutante} isLogado={isLogado} loginAction={fazerLogin} theme="purple" />

          {/* BANNER B2B PARA DJS E CERIMONIALISTAS DE 15 ANOS */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <SpotlightCard className="bg-zinc-900/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl relative group" spotlightColor="rgba(168, 85, 247, 0.18)" borderColor="rgba(192, 132, 252, 0.35)">
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                  É DJ, Cerimonialista ou Produtor de Debutantes?
                </h3>
                <p className="text-zinc-400 font-light text-sm sm:text-lg">
                  Ofereça o FlashFest nos seus pacotes de iluminação e pista de dança, encante as famílias e ganhe comissões exclusivas por evento.
                </p>
              </div>
              <div className="relative z-10 shrink-0 w-full md:w-auto">
                <a 
                  href="mailto:contato@flashfest.com.br?subject=Parceria%20Festas%20de%2015%20Anos" 
                  className="w-full md:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-bold transition-all duration-300 whitespace-nowrap inline-block border border-white/10 hover:border-white/20 shadow-lg hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  Falar com Nosso Time
                </a>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* SEÇÃO DE AVALIAÇÕES E PROVA SOCIAL (3 DEPOIMENTOS DE 15 ANOS) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-4 shadow-sm">
              <span>⭐⭐⭐⭐⭐</span>
              <span>4.9 de 5 aprovado por debutantes e famílias</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Quem viveu a festa conta como foi
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Veja por que mães, aniversariantes e DJs consideram o FlashFest indispensável.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Depoimento 1 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300">
              <div>
                <div className="text-purple-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;A festa de 15 anos da minha filha foi um estouro! Ela não queria aquela cabine de fotos tradicional que ocupa metade do salão. Colocamos o QR Code nos adesivos e no telão da pista: os amigos dela não pararam de gravar clipes e tirar fotos. No final, baixamos tudo em ZIP para guardar de lembrança!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                  CF
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Camila F.</h4>
                  <p className="text-zinc-500 text-xs">Mãe de Debutante em Brasília / DF • 180 Convidados</p>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-pink-500/30 transition-all duration-300">
              <div>
                <div className="text-purple-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;Foi a melhor parte da balada! Meus amigos gravavam vídeos dançando na pista e na mesma hora aparecia no telão gigante. Os filtros retrô ficaram muito perfeitos, todo mundo postou nos stories no dia seguinte!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-400 flex items-center justify-center font-bold text-white text-sm">
                  IM
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Isabella M.</h4>
                  <p className="text-zinc-500 text-xs">Debutante em Campinas / SP</p>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300">
              <div>
                <div className="text-purple-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;Como DJ especializado em festas de 15 anos, vejo que o FlashFest muda a energia do evento. Os jovens não saem da pista porque ficam dançando e vendo suas fotos no painel de LED. Simples de rodar no notebook do palco.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-emerald-400 flex items-center justify-center font-bold text-zinc-950 text-sm">
                  RA
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">DJ Rafael Alves</h4>
                  <p className="text-zinc-500 text-xs">DJ de Debutantes em Porto Alegre / RS</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ 15 ANOS (5 DÚVIDAS FREQUENTES) */}
        <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 font-[family-name:var(--font-jakarta)]">
              Perguntas Frequentes sobre 15 Anos
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-light">
              Tudo o que você precisa saber para transformar a balada de 15 anos em um show.
            </p>
          </div>

          <div className="space-y-4">
            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-purple-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como os jovens tiram fotos na festa sem precisar baixar aplicativo?</span>
                <span className="text-purple-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Basta apontar a câmera do celular para o QR Code espalhado na festa (totens, plaquinhas de mesa e adesivos). O navegador abre na hora, sem precisar de cadastro longo ou baixar aplicativo na App Store/Play Store.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-purple-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como funciona a gravação e exibição de vídeos curtos de 15s no telão?</span>
                <span className="text-purple-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Nos planos Pro, VIP e VIP+, os convidados têm um botão especial para gravar clipes curtos de até 15 segundos direto pela câmera da web. O clipe sobe com áudio e é reproduzido com alta energia no telão em rotação contínua.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-purple-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Os pais conseguem moderar e controlar o que passa no telão?</span>
                <span className="text-purple-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Sim! O FlashFest possui o Modo de Moderação. Os pais ou o cerimonialista podem acompanhar todas as mídias pelo próprio celular e aprovar cada foto antes de aparecer no telão, ou deixar automático e excluir com 1 toque se necessário.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-purple-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como conectar o telão na pista de dança ou painel de LED do DJ?</span>
                <span className="text-purple-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                O DJ ou responsável pelo painel de LED só precisa abrir o link do telão em tela cheia no computador dele conectado à tela via cabo HDMI. O FlashFest atualiza tudo de forma automática, com transições suaves e design cinematográfico.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-purple-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>A aniversariante e a família recebem todas as fotos e vídeos depois?</span>
                <span className="text-purple-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Sim! Pelo painel de controle, você tem acesso ao botão de download em ZIP com todas as fotos e vídeos em qualidade original para postar nos stories, feed ou guardar no álbum da debutante.
              </p>
            </details>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="bg-gradient-to-b from-purple-950/30 via-zinc-900/60 to-pink-950/30 border border-purple-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-jakarta)]">
              Faça dos seus 15 anos uma noite inesquecível e histórica!
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
              Crie seu evento gratuitamente, teste a interface no seu próprio celular e garanta o sucesso da pista de dança.
            </p>
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Festa de 15 Anos Grátis &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="inline-block">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
                >
                  Criar Festa de 15 Anos Grátis &rarr;
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
                Flash<span className="text-emerald-500">Fest</span> 15 Anos
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                A vibe da câmera descartável e vídeos ao vivo no telão para debutantes e festas de 15 anos inesquecíveis.
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 border border-white/10 px-3 py-2 rounded-xl w-fit">
                <span className="text-purple-400">🔒</span>
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
                  <Link href="/15-anos" className="text-purple-400 font-medium">Festas de 15 Anos & Debutantes</Link>
                </li>
                <li>
                  <Link href="/casamentos" className="hover:text-emerald-400 transition-colors">Telão para Casamentos</Link>
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
                Recursos Debutantes
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400 font-light">
                <li>
                  <a href="#recursos" className="hover:text-purple-400 transition-colors">Filtros Câmera Descartável</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-purple-400 transition-colors">Vídeos de 15s na Pista</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-purple-400 transition-colors">Telão de LED em Tempo Real</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-purple-400 transition-colors">Moderação Segura para os Pais</a>
                </li>
                <li>
                  <a href="#planos" className="hover:text-purple-400 transition-colors">Planos para 15 Anos</a>
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
                  <span className="text-zinc-500 block text-xs">Dúvidas sobre a festa:</span>
                  <a href="mailto:contato@flashfest.com.br" className="text-zinc-300 hover:text-purple-400 transition-colors font-mono text-xs">
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
            <p>© {new Date().getFullYear()} FlashFest 15 Anos. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Feito para fazer a sua balada de 15 anos entrar para a história ✨👑
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
