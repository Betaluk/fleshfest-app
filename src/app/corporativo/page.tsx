import { auth, signIn } from '@/auth';
import Link from 'next/link';
import { Metadata } from 'next';
import SpotlightCard from '@/components/SpotlightCard';

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
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Como funciona a exibição do logotipo da empresa no telão?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Basta fazer o upload do logotipo da sua empresa ou dos patrocinadores em PNG transparente pelo painel. Ele será integrado com elegância no telão com transições dinâmicas.',
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
            name: 'Como o time de marketing e RH tem acesso aos arquivos pós-evento?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Disponibilizamos o download em um único arquivo ZIP de alta resolução com todas as fotos e mensagens enviadas, facilitando a criação de newsletters internas, posts no LinkedIn e relatórios.',
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

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 inset-x-0 h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/15 rounded-full blur-[120px] opacity-40 animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-amber-800/15 rounded-full blur-[120px] opacity-30 animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/60 via-zinc-950/80 to-zinc-950/100 z-0"></div>
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
            <Link href="/dashboard" className="text-xs sm:text-sm font-medium bg-amber-400 text-zinc-950 px-4 py-2 rounded-full hover:bg-amber-300 transition font-semibold">
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
          <span className="text-amber-400 font-medium">Eventos Corporativos</span>
        </nav>
      </div>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs sm:text-sm font-medium mb-6">
            <span>💼</span>
            <span>Ativação de Marca para Convenções & Confraternizações</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 font-[family-name:var(--font-jakarta)] leading-[1.15]">
            Engaje seu público e <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-400">
              projete a sua marca no telão.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Substitua ativações tradicionais e estáticas por um telão interativo que conecta colaboradores e clientes em tempo real. Com seu logotipo no telão e moderação total pelo celular da sua equipe.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] text-base"
              >
                Criar Ativação Corporativa &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="w-full sm:w-auto">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] text-base"
                >
                  Criar Ativação Corporativa &rarr;
                </button>
              </form>
            )}
            <Link
              href="/#planos"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-colors text-base"
            >
              Conhecer os Planos Corporativos
            </Link>
          </div>
        </section>

        {/* 4 RECURSOS CORPORATIVOS */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
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

        {/* DEPOIMENTO CORPORATIVO */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <div className="bg-zinc-900/40 border border-amber-500/20 rounded-3xl p-8 sm:p-12 text-center relative shadow-[0_0_50px_rgba(251,191,36,0.1)]">
            <div className="text-amber-400 text-xl mb-4">★★★★★</div>
            <p className="text-zinc-200 text-base sm:text-xl font-light italic leading-relaxed mb-6">
              &ldquo;Utilizamos o FlashFest na nossa convenção anual para mais de 600 colaboradores com o modo de moderação ativo. O engajamento foi absurdo! O pessoal adorou ver suas fotos no telão principal do auditório e o time de comunicação teve material de sobra para as campanhas internas.&rdquo;
            </p>
            <div className="font-bold text-white text-base">Rodrigo Mendes</div>
            <div className="text-xs text-zinc-500">Produtor de Eventos Corporativos em São Paulo / SP</div>
          </div>
        </section>

        {/* FAQ CORPORATIVO */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 font-[family-name:var(--font-jakarta)]">
            Perguntas Frequentes de Empresas e Agências
          </h2>

          <div className="space-y-4">
            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>Como funciona para fechar com nota fiscal ou pagamento empresarial?</span>
                <span className="text-amber-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                O pagamento é processado instantaneamente via Mercado Pago com cartão corporativo ou PIX com confirmação automática. O comprovante é disponibilizado de imediato.
              </p>
            </details>

            <details className="group bg-zinc-900/30 border border-white/10 rounded-2xl p-5 open:bg-zinc-900/60 transition-all cursor-pointer">
              <summary className="flex items-center justify-between font-medium text-white outline-none gap-3">
                <span>O sistema suporta grandes painéis de LED e múltiplos telões?</span>
                <span className="text-amber-400 transition-transform group-open:rotate-180 shrink-0">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/10 pt-4 font-light">
                Sim! O telão FlashFest roda em qualquer navegador moderno e se ajusta automaticamente a proporções 16:9, UltraWide ou painéis de LED gigantes de palcos principais.
              </p>
            </details>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="bg-gradient-to-b from-amber-950/40 to-zinc-900/60 border border-amber-500/30 rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-jakarta)]">
              Eleve o nível do seu próximo evento corporativo
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-light">
              Crie seu evento gratuitamente, configure o logotipo e teste a experiência em minutos.
            </p>
            {isLogado ? (
              <Link
                href="/dashboard/novo"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] text-base"
              >
                Criar Ativação Corporativa &rarr;
              </Link>
            ) : (
              <form action={fazerLogin} className="inline-block">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 transition-all shadow-[0_0_30px_rgba(251,191,36,0.3)] text-base"
                >
                  Criar Ativação Corporativa &rarr;
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
            Flash<span className="text-emerald-500">Fest</span> Corporativo
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors">Início</Link>
            <Link href="/casamentos" className="hover:text-zinc-300 transition-colors">Casamentos</Link>
            <Link href="/15-anos" className="hover:text-zinc-300 transition-colors">15 Anos</Link>
            <Link href="/termos" className="hover:text-zinc-300 transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">Privacidade</Link>
          </div>
          <p>© {new Date().getFullYear()} FlashFest. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
