import { auth, signIn } from '@/auth';
import Link from 'next/link';
import { Metadata } from 'next';
import SpotlightCard from '@/components/SpotlightCard';
import PlanosCarousel, { PlanoItem } from '@/components/PlanosCarousel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Telão Interativo e Ativação de Fotos para Eventos Corporativos | FlashFest',
  description: 'Ativação inovadora para convenções, confraternizações e feiras. Fotos dos colaboradores e clientes no telão em tempo real com seu logotipo e moderação completa.',
  keywords: [
    'telão interativo eventos corporativos',
    'ativação de fotos corporativas',
    'mural digital para empresas',
    'fotos ao vivo convenção',
    'telão confraternização de empresa',
    'endomarketing evento fotos'
  ],
  alternates: {
    canonical: '/corporativo',
  },
  openGraph: {
    title: 'Telão Interativo e Ativação para Eventos Corporativos | FlashFest',
    description: 'Engajamento real de equipes e clientes com exibição instantânea de fotos no telão com a marca da sua empresa.',
    url: 'https://flashfest.com.br/corporativo',
    siteName: 'FlashFest',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Telão Interativo para Eventos Corporativos - FlashFest',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Telão Interativo e Ativação para Eventos Corporativos | FlashFest',
    description: 'Ativação de alto impacto para convenções, confraternizações e congressos.',
    images: ['/og-image.png'],
  },
};

export default async function CorporativoPage() {
  const session = await auth();
  const isLogado = !!session?.user;

  async function fazerLogin() {
    'use server';
    await signIn('google', { redirectTo: '/dashboard' });
  }

  // Planos sob medida para Empresas e Convenções
  const planosCorporativo: PlanoItem[] = [
    { nome: 'Grátis', preco: '0', fotos: '10', dias: '1', ideal: 'Teste e validação técnica da equipe (1 por dia)', videos: false },
    { nome: 'Start', preco: '49', fotos: '500', dias: '2', ideal: 'Workshops, dinâmicas de equipe e happy hours até 50 pessoas', videos: false },
    { nome: 'Pro', preco: '99', fotos: '2.000', dias: '7', ideal: 'Confraternizações de fim de ano e lançamentos de produtos', videos: true },
    { nome: 'VIP', preco: '149', fotos: '5.000', dias: '30', ideal: 'Convenções regionais e encontros de até 600 pessoas', videos: true },
    { nome: 'VIP+', preco: '199', fotos: '10.000', dias: '30', ideal: 'Grandes convenções nacionais, feiras e estandes de alto tráfego', destaque: true, badge: 'Mais Escolhido para Empresas', videos: true }
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
            name: 'Corporativo',
            item: 'https://flashfest.com.br/corporativo',
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': 'https://flashfest.com.br/corporativo/#webpage',
        url: 'https://flashfest.com.br/corporativo',
        name: 'Telão Interativo para Eventos Corporativos | FlashFest',
        description: 'Plataforma para ativação de marca e engajamento com fotos e vídeos no telão em conferências e festas corporativas.',
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://flashfest.com.br/corporativo/#software',
        name: 'FlashFest Corporativo',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        url: 'https://flashfest.com.br/corporativo',
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
            author: { '@type': 'Person', name: 'Rodrigo Mendes' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'Utilizamos o FlashFest na nossa convenção anual para mais de 600 colaboradores com o modo de moderação ativo. O engajamento foi absurdo! O pessoal adorou ver suas fotos no telão principal do auditório e o time de comunicação teve material de sobra para as campanhas internas.',
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Juliana Vasconcelos' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'Na confraternização de final de ano da empresa, o engajamento foi incrível. Ter o logotipo da empresa no telão gerou forte sensação de pertencimento e o download em ZIP facilitou nossa retrospectiva no LinkedIn.',
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Marcelo Prado' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'Usamos no estande da nossa marca em uma grande feira de tecnologia. Colocamos o QR Code nos crachás e o telão de LED atraiu olhares o evento inteiro. Custo-benefício incomparável com totens convencionais.',
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
            name: 'Como funciona a exibição do logotipo da empresa no telão?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Basta fazer o upload do logotipo da sua empresa ou dos patrocinadores em PNG com fundo transparente pelo painel. Ele será integrado com elegância no telão com transições dinâmicas e ótima visibilidade.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como garantir que nenhuma foto imprópria seja exibida?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O FlashFest conta com o Modo de Moderação Manual: toda foto enviada por colaboradores ou visitantes entra numa fila de aprovação antes de ser exibida no telão. A equipe de comunicação ou cerimonial aprova com um simples toque no celular.',
            },
          },
          {
            '@type': 'Question',
            name: 'O sistema suporta grandes painéis de LED e múltiplos telões?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim! O telão FlashFest roda em qualquer navegador moderno e se ajusta automaticamente a proporções 16:9, UltraWide ou painéis de LED gigantes de palcos principais.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como o time de marketing e RH tem acesso aos arquivos pós-evento?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Disponibilizamos o download em um único arquivo ZIP de alta resolução com todas as fotos e mensagens enviadas, facilitando a criação de newsletters internas, posts no LinkedIn e relatórios.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como funciona o pagamento corporativo e comprovação fiscal?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'O pagamento é processado instantaneamente via Mercado Pago com cartão corporativo ou PIX com confirmação automática. O comprovante é disponibilizado de imediato para prestação de contas.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-50 selection:bg-amber-500/30 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BACKGROUND GLOW CORPORATIVO & PREMIUM */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/15 rounded-full blur-[130px] opacity-40 animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-amber-800/15 rounded-full blur-[130px] opacity-30 animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[25%] w-[50%] h-[50%] bg-zinc-800/30 rounded-full blur-[120px] opacity-35 animate-blob animation-delay-4000 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-zinc-950/85 to-zinc-950/100 z-0"></div>
      </div>

      {/* NAVBAR */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-20 sm:h-24 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white font-[family-name:var(--font-jakarta)]">
            Flash<span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Fest</span>
          </Link>
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300">
            Corporativo
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
            <Link href="/dashboard" className="text-xs sm:text-sm font-semibold bg-amber-400 text-zinc-950 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-amber-300 transition shadow-md">
              Meu Painel &rarr;
            </Link>
          ) : (
            <form action={fazerLogin}>
              <button type="submit" className="text-xs sm:text-sm font-semibold bg-white text-zinc-950 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-zinc-200 transition shadow-md">
                Criar Ativação Grátis
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
          <span className="text-amber-400 font-medium">Eventos Corporativos</span>
        </nav>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-medium mb-6 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>💼 Ativação de Marca para Convenções, Feiras & Confraternizações</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 font-[family-name:var(--font-jakarta)] leading-[1.12]">
            Engaje seu público e <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-400">
              projete a sua marca no telão.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Substitua ativações tradicionais e estáticas por um telão interativo que conecta colaboradores e clientes em tempo real. Com o logotipo da sua empresa em evidência e moderação total pelo smartphone da sua equipe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Ativação Corporativa &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
                >
                  Criar Ativação Corporativa &rarr;
                </button>
              </form>
            )}
            <a
              href="#comparativo"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-base"
            >
              Comparar com Totens Físicos
            </a>
          </div>

          <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-4">
            Sem mensalidades. Emissão instantânea de comprovante para prestação de contas.
          </p>
        </section>

        {/* DEMO INTERATIVA (TEST DRIVE CORPORATIVO NO CELULAR) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
          <SpotlightCard className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 md:p-12 flex flex-col md:flex-row items-center gap-8 sm:gap-10 shadow-2xl relative group hover:border-amber-500/30 transition-colors duration-500" spotlightColor="rgba(251, 191, 36, 0.15)" borderColor="rgba(251, 191, 36, 0.35)">
            <div className="flex-1 space-y-4 sm:space-y-5 relative z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-amber-300 font-medium bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 rounded-full text-xs sm:text-sm">
                <span className="animate-pulse bg-amber-400 w-2 h-2 rounded-full inline-block"></span>
                Faça o Test Drive Corporativo
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-[family-name:var(--font-jakarta)]">
                Experimente a agilidade no seu celular corporativo.
              </h2>
              <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
                Aponte a câmera do seu smartphone para o QR Code ao lado. Veja como é rápido e descomplicado: sem instalar aplicativos da Play Store ou App Store, colaboradores e convidados interagem em segundos.
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-zinc-400 pt-2">
                <span>✓ Compatível com iOS e Android</span>
                <span>•</span>
                <span>✓ Zero download</span>
                <span>•</span>
                <span>✓ Otimizado para 4G/Wi-Fi</span>
              </div>
            </div>
            <div className="w-full md:w-auto flex justify-center relative z-10 shrink-0">
              <div className="bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-white/10 shadow-[0_0_50px_-15px_rgba(251,191,36,0.25)] transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:border-amber-500/30 hover:bg-white/10">
                <img 
                  src="/demo-qr.png" 
                  alt="QR Code de demonstração do FlashFest Corporativo" 
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
              Como funciona a ativação corporativa?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Implementação simples, rápida e compatível com a infraestrutura de qualquer centro de convenções ou auditório.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col relative group hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-xl flex items-center justify-center mb-6">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                Cadastre o Evento & Suba seu Logotipo
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Em poucos minutos você faz o upload do logotipo da empresa ou de patrocinadores em PNG e define se deseja moderação manual ativada.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col relative group hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 font-bold text-xl flex items-center justify-center mb-6">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                Divulgue o QR Code no Local
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Exiba o QR Code nos crachás, totens de entrada, mesas ou nos intervalos dos palcos. Colaboradores apontam o celular e enviam fotos na hora.
              </p>
            </div>

            <div className="bg-zinc-900/40 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col relative group hover:border-amber-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold text-xl flex items-center justify-center mb-6">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                Projeção no Telão & Acervo em ZIP
              </h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                As fotos passam no painel de LED do palco em alta definição. No pós-evento, o time de Marketing e RH baixa tudo em ZIP para newsletters e LinkedIn.
              </p>
            </div>
          </div>
        </section>

        {/* COMPARATIVO: TOTENS FÍSICOS VS FLASHFEST */}
        <section id="comparativo" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Por que agências e empresas substituem totens estáticos pelo FlashFest?
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Uma solução que escala para milhares de pessoas sem gargalos operacionais e com custo muito menor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Totens / Cabines Físicas */}
            <div className="bg-zinc-900/30 border border-red-500/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">❌</span>
                <h3 className="text-lg sm:text-xl font-bold text-red-400">Totens & Cabines Tradicionais</h3>
              </div>
              <ul className="space-y-4 text-sm text-zinc-400 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Alto custo de locação:</strong> Valores a partir de R$ 3.500 por poucas horas de operação.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Gargalo de filas:</strong> Filas longas que congestionam estandes e atrapalham o networking.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Não escala:</strong> Atende apenas 1 ou 2 pessoas por minuto; inviável para eventos de 500+ pessoas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Fotos impressas isoladas:</strong> O público não vê as fotos coletivamente nos telões do auditório.</span>
                </li>
              </ul>
            </div>

            {/* FlashFest Corporativo */}
            <div className="bg-zinc-900/50 border border-amber-500/40 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(251,191,36,0.1)]">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">✨</span>
                <h3 className="text-lg sm:text-xl font-bold text-amber-400">FlashFest Corporativo</h3>
              </div>
              <ul className="space-y-4 text-sm text-zinc-300 font-light">
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span><strong>Preço acessível e transparente:</strong> Planos únicos em Reais sem taxas ocultas ou mensalidades.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span><strong>Escala ilimitada:</strong> Centenas de pessoas fotografam simultaneamente em todo o pavilhão.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span><strong>Logotipo & Moderação Rigorosa:</strong> Sua marca em evidência com segurança total contra imagens indevidas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-amber-400 font-bold">✓</span>
                  <span><strong>Acervo completo em ZIP:</strong> Todas as fotos em alta resolução prontas para o time de marketing e RH.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4 RECURSOS CORPORATIVOS */}
        <section id="recursos" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Projetado para eventos corporativos de alto padrão
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-light">
              Segurança institucional, branding customizado e facilidade de implantação técnica.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(251, 191, 36, 0.15)" borderColor="rgba(251, 191, 36, 0.3)">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Logotipo da Empresa</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Fortaleça o branding da empresa ou exiba marcas de patrocinadores em destaque no telão e nos materiais de mesa.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(251, 191, 36, 0.15)" borderColor="rgba(251, 191, 36, 0.3)">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Moderação em Fila</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Zero riscos à imagem institucional: fotos entram em fila para aprovação imediata pelo smartphone da equipe.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(251, 191, 36, 0.15)" borderColor="rgba(251, 191, 36, 0.3)">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Acervo para Marketing</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Download completo em ZIP com fotos e recados para usar em campanhas de endomarketing, intranet e redes sociais.
              </p>
            </SpotlightCard>

            <SpotlightCard className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 sm:p-8" spotlightColor="rgba(251, 191, 36, 0.15)" borderColor="rgba(251, 191, 36, 0.3)">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Sem Instalação de App</h3>
              <p className="text-zinc-400 text-sm font-light leading-relaxed">
                Alta taxa de adesão em convenções: clientes e parceiros acessam apenas lendo o QR Code no crachá ou totem.
              </p>
            </SpotlightCard>
          </div>
        </section>

        {/* SEÇÃO DE PREÇOS / PLANOS CORPORATIVOS */}
        <section id="planos" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <div className="text-center mb-8 sm:mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
              <span>💼 Investimento Único • Sem Mensalidades</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Planos sob Medida para Convenções e Confraternizações
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Transparência total para o setor de compras da sua empresa. Sem assinaturas recorrentes, com pagamento seguro em Reais via Cartão Corporativo ou PIX.
            </p>
          </div>

          <PlanosCarousel planos={planosCorporativo} isLogado={isLogado} loginAction={fazerLogin} theme="amber" />

          {/* BANNER B2B PARA AGÊNCIAS E PRODUTORAS */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <SpotlightCard className="bg-zinc-900/40 backdrop-blur-xl border border-amber-500/20 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl relative group" spotlightColor="rgba(251, 191, 36, 0.15)" borderColor="rgba(251, 191, 36, 0.3)">
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">
                  É Agência de Live Marketing ou Produtora de Eventos?
                </h3>
                <p className="text-zinc-400 font-light text-sm sm:text-lg">
                  Oferecemos pacotes anuais com múltiplos eventos, faturamento para pessoa jurídica e suporte prioritário para ativações de alto volume.
                </p>
              </div>
              <div className="relative z-10 shrink-0 w-full md:w-auto">
                <a 
                  href="mailto:contato@flashfest.com.br?subject=Parceria%20Corporativa%20e%20Agências" 
                  className="w-full md:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-bold transition-all duration-300 whitespace-nowrap inline-block border border-white/10 hover:border-white/20 shadow-lg hover:scale-105 active:scale-95 text-sm sm:text-base"
                >
                  Falar com Consultor Corporativo
                </a>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* SEÇÃO DE AVALIAÇÕES E PROVA SOCIAL (3 DEPOIMENTOS CORPORATIVOS) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4 shadow-sm">
              <span>⭐⭐⭐⭐⭐</span>
              <span>4.9 de 5 aprovado por produtores e equipes de RH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              O que dizem os organizadores de eventos corporativos
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Veja como grandes convenções e empresas aumentaram o engajamento com o FlashFest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Depoimento 1 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300">
              <div>
                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;Utilizamos o FlashFest na nossa convenção anual para mais de 600 colaboradores com o modo de moderação ativo. O engajamento foi absurdo! O pessoal adorou ver suas fotos no telão principal do auditório e o time de comunicação teve material de sobra para as campanhas internas.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-zinc-950 text-sm">
                  RM
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Rodrigo Mendes</h4>
                  <p className="text-zinc-500 text-xs">Produtor de Eventos Corporativos em São Paulo / SP</p>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300">
              <div>
                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;Na confraternização de final de ano da empresa, o engajamento foi de quase 100%. Ter o logotipo da empresa no telão gerou forte sensação de pertencimento e o download em ZIP facilitou nossa retrospectiva no LinkedIn.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-amber-400 flex items-center justify-center font-bold text-zinc-950 text-sm">
                  JV
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Juliana Vasconcelos</h4>
                  <p className="text-zinc-500 text-xs">Gerente de Endomarketing & RH em Curitiba / PR</p>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300">
              <div>
                <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;Usamos no estande da nossa marca em uma grande feira de tecnologia. Colocamos o QR Code nos crachás e o telão de LED atraiu olhares o evento inteiro. Custo-benefício incomparável com totens convencionais.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-amber-400 flex items-center justify-center font-bold text-zinc-950 text-sm">
                  MP
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Marcelo Prado</h4>
                  <p className="text-zinc-500 text-xs">Head de Marketing em Feiras B2B no Rio de Janeiro / RJ</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ CORPORATIVO (5 DÚVIDAS FREQUENTES) */}
        <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight mb-3 font-[family-name:var(--font-jakarta)]">
              Perguntas Frequentes de Empresas e Agências
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-light">
              Aspectos técnicos, fiscais e operacionais para a sua empresa contratar com tranquilidade.
            </p>
          </div>

          <div className="space-y-4">
            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-amber-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como funciona a exibição do logotipo e patrocinadores no telão?</span>
                <span className="text-amber-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Basta fazer o upload do logotipo da sua empresa ou dos patrocinadores em PNG com fundo transparente pelo painel administrativo. O sistema posiciona a marca com elegância e alta definição no telão durante toda a conferência ou confraternização.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-amber-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como garantir que nenhuma foto imprópria seja exibida (segurança de marca)?</span>
                <span className="text-amber-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                O FlashFest conta com o <strong className="text-white">Modo de Moderação Manual</strong>. Com ele ativado, qualquer foto ou vídeo enviado fica retido em uma fila de aprovação e só vai ao telão após um clique de liberação pelo smartphone da sua equipe de comunicação ou cerimonial.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-amber-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>O sistema suporta grandes painéis de LED, palcos e múltiplos telões?</span>
                <span className="text-amber-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Sim! O telão FlashFest funciona diretamente pelo navegador web (Chrome ou Safari) e foi construído com layout responsivo dinâmico, adaptando-se com nitidez perfeita a televisores 4K, projetores e painéis de LED UltraWide de palcos principais.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-amber-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como funciona o pagamento corporativo e comprovação fiscal?</span>
                <span className="text-amber-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                O pagamento é processado instantaneamente via Mercado Pago com cartão de crédito corporativo ou PIX com confirmação automática. O comprovante é gerado de imediato para a prestação de contas do setor financeiro da sua empresa.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 open:border-amber-500/30 transition-all cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>A internet de pavilhões e centros de convenções costuma oscilar: o FlashFest funciona bem?</span>
                <span className="text-amber-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Sim! O FlashFest realiza compressão ultrarrápida da imagem diretamente no smartphone do usuário antes do envio. Isso reduz o tráfego em até 80%, permitindo envio fluido mesmo com centenas de celulares conectados ao 4G simultaneamente.
              </p>
            </details>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="bg-gradient-to-b from-amber-950/30 via-zinc-900/60 to-zinc-950/80 border border-amber-500/30 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-jakarta)]">
              Eleve o nível do seu próximo evento corporativo
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
              Crie seu evento gratuitamente, configure o logotipo e teste a experiência em minutos com a sua equipe.
            </p>
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
              >
                Criar Ativação Corporativa &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="inline-block">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] text-base hover:scale-[1.02] active:scale-[0.98]"
                >
                  Criar Ativação Corporativa &rarr;
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
                Flash<span className="text-emerald-500">Fest</span> Corporativo
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                A tecnologia em telão interativo que conecta convenções, congressos, feiras e confraternizações em tempo real com alta segurança institucional.
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 border border-white/10 px-3 py-2 rounded-xl w-fit">
                <span className="text-amber-400">🔒</span>
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
                  <Link href="/corporativo" className="text-amber-400 font-medium">Eventos Corporativos & Feiras</Link>
                </li>
                <li>
                  <Link href="/casamentos" className="hover:text-emerald-400 transition-colors">Telão para Casamentos</Link>
                </li>
                <li>
                  <Link href="/15-anos" className="hover:text-emerald-400 transition-colors">Festas de 15 Anos & Debutantes</Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-emerald-400 transition-colors">Página Principal FlashFest</Link>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Recursos */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase font-[family-name:var(--font-jakarta)]">
                Recursos para Empresas
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400 font-light">
                <li>
                  <a href="#recursos" className="hover:text-amber-400 transition-colors">Logotipo no Telão</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-amber-400 transition-colors">Fila de Moderação Rigorosa</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-amber-400 transition-colors">Download em ZIP para RH</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-amber-400 transition-colors">QR Code sem Aplicativo</a>
                </li>
                <li>
                  <a href="#planos" className="hover:text-amber-400 transition-colors">Planos para Convenções</a>
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
                  <span className="text-zinc-500 block text-xs">Atendimento corporativo:</span>
                  <a href="mailto:contato@flashfest.com.br" className="text-zinc-300 hover:text-amber-400 transition-colors font-mono text-xs">
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
            <p>© {new Date().getFullYear()} FlashFest Corporativo. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Tecnologia e engajamento para os melhores eventos do Brasil 💼✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
