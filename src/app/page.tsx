import Link from 'next/link';
import { auth, signIn } from '@/auth';
import PlanosCarousel from '@/components/PlanosCarousel';
import SpotlightCard from '@/components/SpotlightCard';

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FlashFest | Telão Interativo e Fotos em Tempo Real para Eventos',
  description: 'Transforme os convidados nos fotógrafos do seu evento. Escaneie o QR Code, tire a foto e veja no telão da festa em tempo real. A alternativa moderna à cabine de fotos.',
  keywords: [
    'telão interativo',
    'fotos casamento',
    'cabine de fotos alternativa',
    'qr code fotos festa',
    'slideshow eventos ao vivo',
    'mural digital festa',
    'câmera descartável virtual'
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'FlashFest | O Telão Interativo do seu Evento',
    description: 'Os convidados escaneiam o QR Code e as fotos aparecem instantaneamente no telão da festa.',
    url: 'https://flashfest.com.br',
    siteName: 'FlashFest',
    locale: 'pt_BR',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FlashFest - O Telão Interativo do seu Evento',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlashFest | O Telão Interativo do seu Evento',
    description: 'Os convidados escaneiam o QR Code e as fotos aparecem instantaneamente no telão da festa.',
    images: ['/og-image.png'],
  },
};

export default async function LandingPage() {
  const session = await auth();
  const isLogado = !!session?.user;

  async function fazerLogin() {
    'use server';
    await signIn('google', { redirectTo: '/dashboard' });
  }

  // Planos atualizados com a flag de vídeos curtos e Plano Grátis
  const planos = [
    { nome: 'Grátis', preco: '0', fotos: '10', dias: '1', ideal: 'Teste (1 por dia)', videos: false },
    { nome: 'Start', preco: '49', fotos: '500', dias: '2', ideal: 'Festas íntimas', videos: false },
    { nome: 'Pro', preco: '99', fotos: '2.000', dias: '7', ideal: 'Aniversários e noivados', destaque: true, videos: true },
    { nome: 'VIP', preco: '149', fotos: '5.000', dias: '30', ideal: 'Casamentos e formaturas', videos: true },
    { nome: 'VIP+', preco: '199', fotos: '10.000', dias: '30', ideal: 'Grandes eventos corporativos', videos: true }
  ];

  // Dados estruturados Schema.org completos para Rich Snippets no Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://flashfest.com.br/#organization',
        name: 'FlashFest',
        url: 'https://flashfest.com.br',
        logo: 'https://flashfest.com.br/icon.png',
        description: 'Plataforma líder em telão interativo e compartilhamento de fotos em tempo real para casamentos e eventos sociais.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://flashfest.com.br/#website',
        url: 'https://flashfest.com.br',
        name: 'FlashFest',
        publisher: { '@id': 'https://flashfest.com.br/#organization' },
        inLanguage: 'pt-BR',
      },
      {
        '@type': 'SoftwareApplication',
        '@id': 'https://flashfest.com.br/#software',
        name: 'FlashFest',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        url: 'https://flashfest.com.br',
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
            reviewBody: 'O telão foi o ponto alto da nossa festa de casamento! Nossos convidados se divertiram muito tirando fotos com os filtros e mandando recados carinhosos. No dia seguinte baixamos todas as fotos em ZIP com uma qualidade incrível. Substituiu a cabine de fotos perfeitamente!',
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Camila F.' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'Minha filha amou a ideia da câmera descartável no celular para os 15 anos. A pista não esvaziou um minuto e os amigos dela interagiram a noite inteira. Muito fácil de usar e não precisou instalar nada.',
          },
          {
            '@type': 'Review',
            author: { '@type': 'Person', name: 'Rodrigo Mendes' },
            reviewRating: { '@type': 'Rating', ratingValue: '5' },
            reviewBody: 'Uso o FlashFest nos eventos corporativos dos meus clientes com o modo de moderação ativado. O suporte a logotipo no telão e o controle pelo celular transmitem muito profissionalismo.',
          },
        ],
        offers: {
          '@type': 'AggregateOffer',
          priceCurrency: 'BRL',
          lowPrice: '0',
          highPrice: '199',
          offerCount: '5',
        },
        description: 'Plataforma de telão interativo, mural digital e compartilhamento de fotos em tempo real para festas, casamentos e eventos corporativos.',
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://flashfest.com.br/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Os convidados precisam baixar algum aplicativo?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'De jeito nenhum! Toda a experiência acontece diretamente no navegador padrão do celular (Safari ou Chrome). Basta apontar a câmera para o QR Code e a tela de fotos se abre instantaneamente. Zero fricção.',
            },
          },
          {
            '@type': 'Question',
            name: 'E se a internet do salão de festas for ruim?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Internet do salão está lenta? Não tem problema. O FlashFest possui compressão inteligente no próprio celular do convidado em milissegundos antes do envio, funcionando perfeitamente até no 3G mais fraco da festa.',
            },
          },
          {
            '@type': 'Question',
            name: 'Qualquer pessoa pode ver as fotos do meu evento?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A privacidade da sua festa é prioridade. Durante o evento, apenas quem estiver presencialmente e escanear o QR Code interage com o telão. Para o pós-festa, o sistema gera um link seguro da Galeria Pública para você compartilhar no WhatsApp apenas com quem desejar.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como funciona o telão na prática?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No seu painel, você terá um botão "Abrir Telão". Basta conectá-lo via cabo HDMI da TV ou Projetor em tela cheia e o sistema atualizará as fotos sozinho em tempo real.',
            },
          },
          {
            '@type': 'Question',
            name: 'Como funciona a moderação de fotos? Eu preciso aprovar tudo que vai para o telão?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'A moderação é 100% opcional. Você pode escolher o Modo Automático (fotos e vídeos vão direto para o telão) ou o Modo Manual (mídias aguardam aprovação no celular do anfitrião). Independente da escolha, você sempre pode excluir fotos indesejadas pelo painel.',
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
      
      {/* ANIMATED BACKGROUND EFFECTS */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[120px] opacity-50 animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-emerald-800/10 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-zinc-800/30 rounded-full blur-[120px] opacity-40 animate-blob animation-delay-4000 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950/80 to-zinc-950/100 z-0"></div>
      </div>

      {/* NAVBAR MINIMALISTA */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between animate-fade-in-up">
        <div className="text-2xl font-bold tracking-tighter text-white font-[family-name:var(--font-jakarta)]">
          Flash<span className="text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]">Fest</span>
        </div>
        <div>
          {isLogado ? (
            <Link href="/dashboard" className="text-sm font-medium text-zinc-300 hover:text-white transition">
              Meu Painel &rarr;
            </Link>
          ) : (
            <form action={fazerLogin}>
              <button type="submit" className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-zinc-200 transition">
                Entrar / Criar Evento
              </button>
            </form>
          )}
        </div>
      </nav>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 sm:pb-24 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-zinc-900/50 backdrop-blur-md border border-white/10 text-zinc-300 text-xs font-medium tracking-wide mb-6 sm:mb-8 shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            A câmera da sua festa na mão dos convidados
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 mb-6 sm:mb-8 font-[family-name:var(--font-jakarta)] leading-tight">
            A sua festa, <br className="hidden md:block" /> capturada por <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">todos.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light">
            O telão interativo ao vivo para casamentos, festas de 15 anos e eventos. Os convidados escaneiam o QR Code no celular e as fotos com filtros e recados aparecem instantaneamente na tela. A alternativa moderna e acessível à cabine de fotos.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
            {isLogado ? (
              <Link 
                href="/dashboard" 
                className="relative group flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-zinc-950 rounded-full font-bold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Acessar meu Painel
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </span>
              </Link>
            ) : (
              <form action={fazerLogin} className="w-full sm:w-auto">
                <button 
                  type="submit" 
                  className="relative group flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-zinc-950 rounded-full font-bold text-base sm:text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-center"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    Criar Conta Gratuitamente
                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </span>
                </button>
              </form>
            )}
            
            {!isLogado && (
              <p className="text-xs sm:text-sm text-zinc-500 font-medium mt-1">
                Sem mensalidades. Você só paga quando for lançar uma festa.
              </p>
            )}
          </div>
        </section>

        {/* DEMO INTERATIVA (O Truque de Conversão) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SpotlightCard className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 sm:gap-10 shadow-2xl relative group hover:border-emerald-500/30 transition-colors duration-500">
            <div className="flex-1 space-y-4 sm:space-y-6 relative z-10 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight font-[family-name:var(--font-jakarta)]">Faça o test drive agora mesmo.</h2>
              <p className="text-base sm:text-lg text-zinc-400 font-light">Não acredite nas nossas palavras. Pegue o seu celular, aponte a câmera para o QR Code ao lado e veja a mágica acontecer na palma da sua mão.</p>
              <div className="inline-flex items-center gap-2 text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)] text-xs sm:text-sm">
                <span className="animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)] bg-emerald-400 w-2 h-2 rounded-full inline-block"></span>
                Experimente a interface real
              </div>
            </div>
            <div className="w-full md:w-auto flex justify-center relative z-10">
              <div className="bg-white/5 backdrop-blur-md p-3 sm:p-4 rounded-3xl border border-white/10 shadow-[0_0_50px_-15px_rgba(52,211,153,0.2)] transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/10 hover:shadow-[0_0_50px_-10px_rgba(52,211,153,0.4)]">
                <img 
                  src="/demo-qr.png" 
                  alt="QR Code para test drive interativo do FlashFest" 
                  width={192} 
                  height={192} 
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-white p-2" 
                />
              </div>
            </div>
          </SpotlightCard>
        </section>

        {/* BENTO GRID DE FUNCIONALIDADES - Transformado em 2x2 focado em Conversão */}
        <section id="recursos" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-32 mt-6 sm:mt-12 relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-20 tracking-tight font-[family-name:var(--font-jakarta)]">Tudo que você precisa, <span className="text-zinc-600">zero complicação.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <SpotlightCard className="group bg-zinc-900/30 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] hover:border-emerald-500/40 hover:bg-zinc-900/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)] hover:-translate-y-1 relative">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-emerald-500/20 text-6xl">📸</span>
              </div>
              <div className="text-4xl mb-4 sm:mb-6 relative z-10 group-hover:scale-110 origin-left transition-transform duration-300">📸</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 relative z-10 font-[family-name:var(--font-jakarta)]">A Vibe da Câmera Descartável</h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed relative z-10 font-light">Seus convidados aplicam filtros exclusivos (Vintage, P&B, Sépia) e deixam mensagens carinhosas de felicitações gravadas na própria foto antes de ela ir para o telão.</p>
            </SpotlightCard>
            
            <SpotlightCard className="group bg-zinc-900/30 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] hover:border-emerald-500/40 hover:bg-zinc-900/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)] hover:-translate-y-1 relative">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-emerald-500/20 text-6xl">📺</span>
              </div>
              <div className="text-4xl mb-4 sm:mb-6 relative z-10 group-hover:scale-110 origin-left transition-transform duration-300">📺</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 relative z-10 font-[family-name:var(--font-jakarta)]">Telão & Vídeos Curtos</h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed relative z-10 font-light">Um slideshow cinematográfico que se atualiza em tempo real enquanto os convidados tiram fotos ou gravam clipes de 15s na pista de dança. Com a sua logo flutuando perfeitamente.</p>
            </SpotlightCard>

            <SpotlightCard className="group bg-zinc-900/30 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] hover:border-emerald-500/40 hover:bg-zinc-900/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)] hover:-translate-y-1 relative">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-emerald-500/20 text-7xl blur-sm">🛡️</span>
              </div>
              <div className="text-4xl mb-4 sm:mb-6 relative z-10 group-hover:scale-110 origin-left transition-transform duration-500">🛡️</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 relative z-10 font-[family-name:var(--font-jakarta)]">Moderação Total</h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed relative z-10 font-light">Assuma o controle. O anfitrião tem um painel direto no celular para aprovar ou ocultar qualquer foto e vídeo antes que apareça no telão.</p>
            </SpotlightCard>
            
            <SpotlightCard className="group bg-zinc-900/30 backdrop-blur-xl border border-white/10 p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] hover:border-emerald-500/40 hover:bg-zinc-900/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)] hover:-translate-y-1 relative">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-emerald-500/20 text-7xl blur-sm">🎨</span>
              </div>
              <div className="text-4xl mb-4 sm:mb-6 relative z-10 group-hover:scale-110 origin-left transition-transform duration-500">🎨</div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 relative z-10 font-[family-name:var(--font-jakarta)]">Enxoval de Marketing Premium</h3>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed relative z-10 font-light">Não entregamos apenas um QR Code genérico. Você recebe templates editáveis no Canva (plaquinhas de mesa, totens e banners) para combinar perfeitamente com a decoração e identidade visual do seu evento.</p>
            </SpotlightCard>
          </div>
        </section>

        {/* SEÇÃO DE OCASIÕES / NICHOS (SEO Semântico de Alta Intenção) */}
        <section id="solucoes" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative animate-fade-in-up">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Perfeito para qualquer celebração.
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              De casamentos emocionantes a grandes pistas de dança corporativas, o FlashFest se adapta ao estilo do seu evento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Casamentos */}
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-4">💍</div>
                <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Casamentos & Noivados</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  Monograma dos noivos flutuando no telão, mensagens carinhosas dos padrinhos e todas as fotos salvas em alta resolução no dia seguinte.
                </p>
              </div>
              <Link href="/casamentos" className="inline-flex items-center text-xs font-semibold text-emerald-400 mt-4 hover:underline">
                Conhecer para casamentos &rarr;
              </Link>
            </div>

            {/* 2. 15 Anos */}
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-4">👑</div>
                <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">15 Anos & Debutantes</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  A pista de dança vira um show com filtros exclusivos (Vintage e P&B), clipes de 15 segundos e zero complicação de instalar aplicativos.
                </p>
              </div>
              <Link href="/15-anos" className="inline-flex items-center text-xs font-semibold text-purple-400 mt-4 hover:underline">
                Conhecer para 15 anos &rarr;
              </Link>
            </div>

            {/* 3. Formaturas */}
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Formaturas & Bailes</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  Celebre a conquista com a turma inteira conectada. Registros espontâneos projetados instantaneamente na festa de formatura.
                </p>
              </div>
              <a href="#planos" className="inline-flex items-center text-xs font-semibold text-zinc-400 mt-4 hover:underline">
                Ver planos para formaturas &rarr;
              </a>
            </div>

            {/* 4. Corporativo */}
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
              <div>
                <div className="text-4xl mb-4">💼</div>
                <h3 className="text-xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Eventos Corporativos</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">
                  Ativação inovadora com logotipo da sua marca no telão, moderação completa pelo celular do anfitrião e relatório visual pós-evento.
                </p>
              </div>
              <Link href="/corporativo" className="inline-flex items-center text-xs font-semibold text-amber-400 mt-4 hover:underline">
                Conhecer para empresas &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE PREÇOS (Alinhamento e Alturas corrigidos) */}
        <section id="planos" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent pointer-events-none rounded-[3rem]"></div>

          <div className="text-center mb-8 sm:mb-12 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 sm:mb-6 font-[family-name:var(--font-jakarta)]">Preço justo e sem surpresas.</h2>
            <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Cabines de fotos custam em média R$ 1.500. Escolha a solução inteligente pelo tamanho do seu evento.<br className="hidden sm:inline" />
              <span className="font-medium text-emerald-400"> Sem mensalidades, sem cobranças surpresas em dólar. Pagamento único em Reais.</span>
            </p>
          </div>

          <PlanosCarousel planos={planos} isLogado={isLogado} loginAction={fazerLogin} />

          {/* BANNER B2B PARA CERIMONIALISTAS */}
          <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
            <SpotlightCard className="bg-zinc-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-2xl sm:rounded-[2rem] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 shadow-2xl relative group">
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">É Cerimonialista ou Produtor?</h3>
                <p className="text-zinc-400 font-light text-sm sm:text-lg">Fale conosco para pacotes de volume e revenda o FlashFest nos seus orçamentos com margem de lucro.</p>
              </div>
              <div className="relative z-10 shrink-0 w-full md:w-auto">
                <a href="mailto:contato@flashfest.com.br" className="w-full md:w-auto text-center px-6 sm:px-8 py-3.5 sm:py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-bold transition-all duration-300 whitespace-nowrap inline-block border border-white/10 hover:border-white/20 shadow-lg hover:scale-105 active:scale-95 text-sm sm:text-base">
                  Falar com a Equipe
                </a>
              </div>
            </SpotlightCard>
          </div>
        </section>

        {/* SEÇÃO DE AVALIAÇÕES E PROVA SOCIAL (E-E-A-T & Review Schema) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative animate-fade-in-up">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4 shadow-sm">
              <span>⭐⭐⭐⭐⭐</span>
              <span>4.9 de 5 baseado em 140+ eventos</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-jakarta)]">
              Quem usou, transformou a festa.
            </h2>
            <p className="text-base sm:text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Veja a experiência de quem trocou as cabines de fotos tradicionais pelo telão interativo do FlashFest.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Depoimento 1 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300">
              <div>
                <div className="text-emerald-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;O telão foi o ponto alto da nossa festa de casamento! Nossos convidados se divertiram muito tirando fotos com os filtros e mandando recados carinhosos. No dia seguinte baixamos todas as fotos em ZIP com uma qualidade incrível. Substituiu a cabine de fotos perfeitamente!&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-zinc-950 text-sm">
                  ML
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Mariana & Lucas</h4>
                  <p className="text-zinc-500 text-xs">Casamento em Goiânia / GO</p>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300">
              <div>
                <div className="text-emerald-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;Minha filha amou a ideia da câmera descartável no celular para os 15 anos. A pista não esvaziou um minuto e os amigos dela interagiram a noite inteira. Muito fácil de usar e não precisou instalar nada.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center font-bold text-white text-sm">
                  CF
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Camila F.</h4>
                  <p className="text-zinc-500 text-xs">Festa de 15 Anos em Brasília / DF</p>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300">
              <div>
                <div className="text-emerald-400 text-sm mb-3">★★★★★</div>
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-light italic mb-6">
                  &ldquo;Uso o FlashFest nos eventos corporativos dos meus clientes com o modo de moderação ativado. O suporte a logotipo no telão e o controle pelo celular transmitem muito profissionalismo.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-bold text-zinc-950 text-sm">
                  RM
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">Rodrigo Mendes</h4>
                  <p className="text-zinc-500 text-xs">Produtor de Eventos em São Paulo / SP</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - PERGUNTAS FREQUENTES */}
        <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-32 relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-10 sm:mb-16 tracking-tight font-[family-name:var(--font-jakarta)]">Dúvidas Frequentes</h2>
          
          <div className="space-y-3.5 sm:space-y-4">
            <details className="group bg-zinc-900/30 backdrop-blur-lg hover:bg-zinc-900/50 border border-white/10 rounded-2xl p-4 sm:p-6 open:bg-zinc-900/60 open:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between list-none font-medium text-base sm:text-lg text-white outline-none gap-3">
                <span>Os convidados precisam baixar algum aplicativo?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0 text-xs sm:text-sm">▼</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-white/10 pt-3 sm:pt-4 font-light">
                De jeito nenhum! Toda a experiência acontece diretamente no navegador padrão do celular (Safari ou Chrome). Basta apontar a câmera para o QR Code e a tela de fotos se abre instantaneamente. Zero fricção.
              </p>
            </details>
            
            <details className="group bg-zinc-900/30 backdrop-blur-lg hover:bg-zinc-900/50 border border-white/10 rounded-2xl p-4 sm:p-6 open:bg-zinc-900/60 open:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between list-none font-medium text-base sm:text-lg text-white outline-none gap-3">
                <span>E se a internet do salão de festas for ruim?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0 text-xs sm:text-sm">▼</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-white/10 pt-3 sm:pt-4 font-light">
                Internet do salão está lenta? Não tem problema. Diferente de outros aplicativos que travam, o FlashFest possui uma tecnologia inteligente que comprime a foto no próprio celular do convidado em milissegundos antes do envio. Funciona perfeitamente até no 3G mais fraco da festa!
              </p>
            </details>

            <details className="group bg-zinc-900/30 backdrop-blur-lg hover:bg-zinc-900/50 border border-white/10 rounded-2xl p-4 sm:p-6 open:bg-zinc-900/60 open:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between list-none font-medium text-base sm:text-lg text-white outline-none gap-3">
                <span>Qualquer pessoa pode ver as fotos do meu evento?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0 text-xs sm:text-sm">▼</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-white/10 pt-3 sm:pt-4 font-light">
                A privacidade da sua festa é nossa prioridade. Durante o evento, apenas quem estiver presencialmente no local e escanear o QR Code consegue interagir com o telão. Para o pós-festa, o sistema gera um <strong className="text-zinc-200">link seguro da sua Galeria Pública</strong>. Você pode enviar esse link no WhatsApp apenas para os convidados que desejar, permitindo que eles acessem, revivam e baixem as memórias da festa de qualquer lugar.
              </p>
            </details>

            <details className="group bg-zinc-900/30 backdrop-blur-lg hover:bg-zinc-900/50 border border-white/10 rounded-2xl p-4 sm:p-6 open:bg-zinc-900/60 open:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between list-none font-medium text-base sm:text-lg text-white outline-none gap-3">
                <span>Como funciona o telão na prática?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0 text-xs sm:text-sm">▼</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-white/10 pt-3 sm:pt-4 font-light">
                No seu painel, você terá um botão "Abrir Telão". Basta acessá-lo no notebook que será usado no salão de festas, conectar o cabo HDMI da TV ou Projetor, colocar em tela cheia e pronto! O sistema atualizará as fotos sozinho.
              </p>
            </details>

            <details className="group bg-zinc-900/30 backdrop-blur-lg hover:bg-zinc-900/50 border border-white/10 rounded-2xl p-4 sm:p-6 open:bg-zinc-900/60 open:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between list-none font-medium text-base sm:text-lg text-white outline-none gap-3">
                <span>Como funciona a moderação de fotos? Eu preciso aprovar tudo que vai para o telão?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180 shrink-0 text-xs sm:text-sm">▼</span>
              </summary>
              <p className="mt-3 sm:mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-white/10 pt-3 sm:pt-4 font-light">
                Não, a moderação é uma ferramenta <strong className="text-zinc-200">100% opcional</strong>. Ao criar sua festa, você pode escolher o <strong className="text-zinc-200">Modo Automático</strong> (fotos e vídeos vão direto para o telão, ideal para eventos íntimos) ou o <strong className="text-zinc-200">Modo Manual</strong> (as mídias ficam numa fila aguardando sua aprovação pelo celular, ideal para eventos corporativos). Independente da sua escolha, você sempre terá um botão no painel para excluir qualquer foto indesejada na hora.
              </p>
            </details>
          </div>
        </section>

      </main>

      {/* FOOTER - E-E-A-T & ARQUITETURA SEMÂNTICA */}
      <footer className="border-t border-white/10 pt-16 pb-12 relative z-10 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 pb-12 border-b border-white/10">
            {/* Coluna 1: Marca & Confiança */}
            <div className="space-y-4">
              <div className="text-2xl font-bold tracking-tighter text-white font-[family-name:var(--font-jakarta)]">
                Flash<span className="text-emerald-500">Fest</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                A plataforma interativa que transforma casamentos, festas de 15 anos, formaturas e eventos corporativos em experiências inesquecíveis no telão em tempo real.
              </p>
              <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 border border-white/10 px-3 py-2 rounded-xl w-fit">
                <span className="text-emerald-400">🔒</span>
                <span>Pagamento Seguro Mercado Pago & SSL 256-bit</span>
              </div>
            </div>

            {/* Coluna 2: Soluções / Tipos de Eventos */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase font-[family-name:var(--font-jakarta)]">
                Soluções
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400 font-light">
                <li>
                  <Link href="/casamentos" className="hover:text-emerald-400 transition-colors">Telão para Casamentos</Link>
                </li>
                <li>
                  <Link href="/15-anos" className="hover:text-emerald-400 transition-colors">Festas de 15 Anos & Debutantes</Link>
                </li>
                <li>
                  <a href="#solucoes" className="hover:text-emerald-400 transition-colors">Bailes de Formatura</a>
                </li>
                <li>
                  <Link href="/corporativo" className="hover:text-emerald-400 transition-colors">Eventos Corporativos</Link>
                </li>
                <li>
                  <a href="#planos" className="hover:text-emerald-400 transition-colors">Aniversários & Confraternizações</a>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Recursos */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase font-[family-name:var(--font-jakarta)]">
                Recursos
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400 font-light">
                <li>
                  <a href="#recursos" className="hover:text-emerald-400 transition-colors">Slideshow em Tempo Real</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-emerald-400 transition-colors">Câmera Web sem Aplicativo</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-emerald-400 transition-colors">Filtros Retrô & Clipes de 15s</a>
                </li>
                <li>
                  <a href="#recursos" className="hover:text-emerald-400 transition-colors">Moderação de Fotos pelo Celular</a>
                </li>
                <li>
                  <a href="#planos" className="hover:text-emerald-400 transition-colors">Galeria e Download em ZIP</a>
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
                  <span className="text-zinc-500 block text-xs">Suporte por e-mail:</span>
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
            <p>© {new Date().getFullYear()} FlashFest Tecnologia para Eventos. Todos os direitos reservados.</p>
            <p className="flex items-center gap-1">
              Feito com carinho para festas inesquecíveis ✨
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}