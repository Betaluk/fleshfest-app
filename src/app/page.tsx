import Link from 'next/link';
import { auth, signIn } from '@/auth';

export const dynamic = 'force-dynamic';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FlashFest | Telão Interativo e Compartilhamento de Fotos para Eventos',
  description: 'Transforme os convidados nos fotógrafos do seu evento. Escaneie o QR Code, tire a foto e veja no telão da festa em tempo real. A alternativa moderna à cabine de fotos.',
  keywords: ['telão interativo', 'fotos casamento', 'cabine de fotos alternativa', 'qr code fotos festa', 'slideshow eventos ao vivo'],
  openGraph: {
    title: 'FlashFest | O Telão Interativo do seu Evento',
    description: 'Os convidados escaneiam o QR Code e as fotos aparecem instantaneamente no telão da festa.',
    url: 'https://flashfest.com.br',
    siteName: 'FlashFest',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default async function LandingPage() {
  const session = await auth();
  const isLogado = !!session?.user;

  async function fazerLogin() {
    'use server';
    await signIn('google', { redirectTo: '/dashboard' });
  }

  // Planos atualizados com a flag de vídeos curtos
  const planos = [
    { nome: 'Start', preco: '49', fotos: '500', dias: '2', ideal: 'Festas íntimas', videos: false },
    { nome: 'Pro', preco: '99', fotos: '2.000', dias: '7', ideal: 'Aniversários e noivados', destaque: true, videos: true },
    { nome: 'VIP', preco: '149', fotos: '5.000', dias: '30', ideal: 'Casamentos e formaturas', videos: true },
    { nome: 'VIP+', preco: '199', fotos: '10.000', dias: '30', ideal: 'Grandes eventos corporativos', videos: true }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'FlashFest',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '49.00',
      priceCurrency: 'BRL',
    },
    description: 'Plataforma de telão interativo e compartilhamento de fotos em tempo real para casamentos e eventos corporativos.',
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
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-24 text-center animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/50 backdrop-blur-md border border-white/10 text-zinc-300 text-xs font-medium tracking-wide mb-8 shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            A câmera da sua festa na mão dos convidados
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40 mb-8 font-[family-name:var(--font-jakarta)] leading-tight">
            A sua festa, <br className="hidden md:block" /> capturada por <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">todos.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Um telão ao vivo, QR Codes instantâneos, fotos com filtros e vídeos curtos da pista de dança. 
            Esqueça as hashtags confusas. Seus convidados escaneiam e a mágica aparece no telão na mesma hora.
          </p>

          <div className="flex flex-col items-center justify-center gap-6">
            {isLogado ? (
              <Link 
                href="/dashboard" 
                className="relative group flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Acessar meu Painel
                  <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                </span>
              </Link>
            ) : (
              <form action={fazerLogin}>
                <button 
                  type="submit" 
                  className="relative group flex items-center gap-2 px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
              <p className="text-sm text-zinc-500 font-medium mt-2">
                Sem mensalidades. Você só paga quando for lançar uma festa.
              </p>
            )}
          </div>
        </section>

        {/* DEMO INTERATIVA (O Truque de Conversão) */}
        <section className="max-w-5xl mx-auto px-6 py-16 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-14 flex flex-col md:flex-row items-center gap-10 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

            <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-[family-name:var(--font-jakarta)]">Faça o test drive agora mesmo.</h2>
              <p className="text-lg text-zinc-400 font-light">Não acredite nas nossas palavras. Pegue o seu celular, aponte a câmera para o QR Code ao lado e veja a mágica acontecer na palma da sua mão.</p>
              <div className="inline-flex items-center gap-2 text-emerald-400 font-medium bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)] bg-emerald-400 w-2 h-2 rounded-full inline-block"></span>
                Experimente a interface real
              </div>
            </div>
            <div className="w-full md:w-auto flex justify-center relative z-10">
              <div className="bg-white/5 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-[0_0_50px_-15px_rgba(52,211,153,0.2)] transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 hover:border-emerald-500/30 hover:bg-white/10 hover:shadow-[0_0_50px_-10px_rgba(52,211,153,0.4)]">
                <img src="/demo-qr.png" alt="QR Code Test Drive" className="w-48 h-48 rounded-2xl bg-white p-2" />
              </div>
            </div>
          </div>
        </section>

        {/* BENTO GRID DE FUNCIONALIDADES - Transformado em 2x2 focado em Conversão */}
        <section className="max-w-7xl mx-auto px-6 py-32 mt-12 relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20 tracking-tight font-[family-name:var(--font-jakarta)]">Tudo que você precisa, <span className="text-zinc-600">zero complicação.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group bg-zinc-900/30 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] hover:border-emerald-500/40 hover:bg-zinc-900/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-emerald-500/20 text-6xl">📸</span>
              </div>
              <div className="text-4xl mb-6 relative z-10 group-hover:scale-110 origin-left transition-transform duration-300">📸</div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10 font-[family-name:var(--font-jakarta)]">A Vibe da Câmera Descartável</h3>
              <p className="text-zinc-400 leading-relaxed relative z-10 font-light">Seus convidados aplicam filtros exclusivos (Vintage, P&B, Sépia) e deixam mensagens carinhosas de felicitações gravadas na própria foto antes de ela ir para o telão.</p>
            </div>
            
            <div className="group bg-zinc-900/30 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] hover:border-emerald-500/40 hover:bg-zinc-900/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-emerald-500/20 text-6xl">📺</span>
              </div>
              <div className="text-4xl mb-6 relative z-10 group-hover:scale-110 origin-left transition-transform duration-300">📺</div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10 font-[family-name:var(--font-jakarta)]">Telão & Vídeos Curtos</h3>
              <p className="text-zinc-400 leading-relaxed relative z-10 font-light">Um slideshow cinematográfico que se atualiza em tempo real enquanto os convidados tiram fotos ou gravam clipes de 15s na pista de dança. Com a sua logo flutuando perfeitamente.</p>
            </div>

            <div className="group bg-zinc-900/30 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] hover:border-emerald-500/40 hover:bg-zinc-900/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-emerald-500/20 text-7xl blur-sm">🛡️</span>
              </div>
              <div className="text-4xl mb-6 relative z-10 group-hover:scale-110 origin-left transition-transform duration-500">🛡️</div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10 font-[family-name:var(--font-jakarta)]">Moderação Total</h3>
              <p className="text-zinc-400 leading-relaxed relative z-10 font-light">Assuma o controle. O anfitrião tem um painel direto no celular para aprovar ou ocultar qualquer foto e vídeo antes que apareça no telão.</p>
            </div>
            
            <div className="group bg-zinc-900/30 backdrop-blur-xl border border-white/10 p-10 rounded-[2rem] hover:border-emerald-500/40 hover:bg-zinc-900/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(52,211,153,0.15)] hover:-translate-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="text-emerald-500/20 text-7xl blur-sm">🎨</span>
              </div>
              <div className="text-4xl mb-6 relative z-10 group-hover:scale-110 origin-left transition-transform duration-500">🎨</div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10 font-[family-name:var(--font-jakarta)]">Enxoval de Marketing Premium</h3>
              <p className="text-zinc-400 leading-relaxed relative z-10 font-light">Não entregamos apenas um QR Code genérico. Você recebe templates editáveis no Canva (plaquinhas de mesa, totens e banners) para combinar perfeitamente com a decoração e identidade visual do seu evento.</p>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE PREÇOS */}
        <section className="max-w-7xl mx-auto px-6 py-16 relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-900/30 to-transparent pointer-events-none rounded-[3rem]"></div>

          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-[family-name:var(--font-jakarta)]">Preço justo e sem surpresas.</h2>
            <p className="text-xl text-zinc-400 font-light max-w-2xl mx-auto leading-relaxed">
              Cabines de fotos custam em média R$ 1.500. Escolha a solução inteligente pelo tamanho do seu evento.<br/>
              <span className="font-medium text-emerald-400">Sem mensalidades, sem cobranças surpresas em dólar. Pagamento único em Reais.</span>
            </p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-6 pb-8 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 md:mx-0 md:px-0 relative z-10 items-end">
            {planos.map((plano) => (
              <div 
                key={plano.nome} 
                className={`snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-auto flex flex-col p-8 rounded-[2rem] transition-all duration-500 ${
                  plano.destaque 
                    ? 'bg-zinc-900/80 backdrop-blur-2xl border border-emerald-500/50 shadow-[0_0_50px_-15px_rgba(52,211,153,0.3)] relative transform md:-translate-y-4 hover:-translate-y-6'
                    : 'bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:bg-zinc-900/60 hover:border-white/20 hover:-translate-y-2'
                }`}
              >
                {plano.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Mais Escolhido
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-medium text-zinc-300 mb-3 font-[family-name:var(--font-jakarta)]">Plano {plano.nome}</h3>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-lg text-zinc-500 font-medium">R$</span>
                    <span className="text-6xl font-extrabold text-white tracking-tighter font-[family-name:var(--font-jakarta)]">{plano.preco}</span>
                    <span className="text-sm text-zinc-500 font-medium">/evento</span>
                  </div>
                  
                  <div className="space-y-4 text-sm text-zinc-300 font-light">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500">✓</span>
                      <span>Até <strong>{plano.fotos} fotos</strong></span>
                    </div>
                    {plano.videos && (
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-500">✓</span>
                        <span>Suporte a <strong>Vídeos Curtos (15s)</strong></span>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>{plano.dias} dias</strong> para baixar as memórias</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500">✓</span>
                      <span>Telão, Filtros e QR Code inclusos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-zinc-500">{plano.ideal}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-10">
                  {isLogado ? (
                    <Link 
                      href="/dashboard" 
                      className={`block w-full py-4 rounded-xl font-semibold text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                        plano.destaque 
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      Começar Agora
                    </Link>
                  ) : (
                    <form action={fazerLogin} className="w-full">
                      <button 
                        type="submit" 
                        className={`w-full py-4 rounded-xl font-semibold text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                          plano.destaque 
                            ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)]'
                            : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      Começar Agora
                    </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* BANNER B2B PARA CERIMONIALISTAS */}
          <div className="mt-16 bg-zinc-900/40 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] p-8 md:p-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none group-hover:from-emerald-500/10 transition-colors duration-500"></div>
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">É Cerimonialista ou Produtor?</h3>
              <p className="text-zinc-400 font-light text-lg">Fale conosco para pacotes de volume e revenda o FlashFest nos seus orçamentos com margem de lucro.</p>
            </div>
            <div className="relative z-10 shrink-0">
              <a href="mailto:contato@flashfest.com.br" className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full font-bold transition-all duration-300 whitespace-nowrap inline-block border border-white/10 hover:border-white/20 shadow-lg">
                Falar com a Equipe
              </a>
            </div>
          </div>
        </section>

        {/* FAQ - PERGUNTAS FREQUENTES */}
        <section className="max-w-3xl mx-auto px-6 py-32 relative animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 tracking-tight font-[family-name:var(--font-jakarta)]">Dúvidas Frequentes</h2>
          
          <div className="space-y-4">
            <details className="group bg-zinc-900/30 backdrop-blur-lg hover:bg-zinc-900/50 border border-white/10 rounded-2xl p-6 open:bg-zinc-900/60 open:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between list-none font-medium text-lg text-white outline-none">
                <span>Os convidados precisam baixar algum aplicativo?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed border-t border-white/10 pt-4 font-light">
                De jeito nenhum! Toda a experiência acontece diretamente no navegador padrão do celular (Safari ou Chrome). Basta apontar a câmera para o QR Code e a tela de fotos se abre instantaneamente. Zero fricção.
              </p>
            </details>
            
            <details className="group bg-zinc-900/30 backdrop-blur-lg hover:bg-zinc-900/50 border border-white/10 rounded-2xl p-6 open:bg-zinc-900/60 open:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between list-none font-medium text-lg text-white outline-none">
                <span>E se a internet do salão de festas for ruim?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed border-t border-white/10 pt-4 font-light">
                Internet do salão está lenta? Não tem problema. Diferente de outros aplicativos que travam, o FlashFest possui uma tecnologia inteligente que comprime a foto no próprio celular do convidado em milissegundos antes do envio. Funciona perfeitamente até no 3G mais fraco da festa!
              </p>
            </details>

            <details className="group bg-zinc-900/30 backdrop-blur-lg hover:bg-zinc-900/50 border border-white/10 rounded-2xl p-6 open:bg-zinc-900/60 open:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between list-none font-medium text-lg text-white outline-none">
                <span>Qualquer pessoa pode ver as fotos do meu evento?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed border-t border-white/10 pt-4 font-light">
                Não. O link do evento é criptografado e as fotos são 100% privadas. Apenas as pessoas que estiverem fisicamente na sua festa e escanearem o QR Code (e você, pelo painel) terão acesso às imagens.
              </p>
            </details>

            <details className="group bg-zinc-900/30 backdrop-blur-lg hover:bg-zinc-900/50 border border-white/10 rounded-2xl p-6 open:bg-zinc-900/60 open:border-emerald-500/20 transition-all duration-500 cursor-pointer shadow-lg">
              <summary className="flex items-center justify-between list-none font-medium text-lg text-white outline-none">
                <span>Como funciona o telão na prática?</span>
                <span className="text-emerald-500 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-4 text-zinc-400 leading-relaxed border-t border-white/10 pt-4 font-light">
                No seu painel, você terá um botão "Abrir Telão". Basta acessá-lo no notebook que será usado no salão de festas, conectar o cabo HDMI da TV ou Projetor, colocar em tela cheia e pronto! O sistema atualizará as fotos sozinho.
              </p>
            </details>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-16 text-center relative z-10 bg-black/20 backdrop-blur-xl">
        <div className="text-2xl font-bold tracking-tighter text-white mb-6 opacity-60 font-[family-name:var(--font-jakarta)]">
          Flash<span className="text-emerald-500">Fest</span>
        </div>
        <div className="flex items-center justify-center gap-8 text-sm text-zinc-500 mb-8">
          <Link href="/termos" className="hover:text-zinc-300 transition-colors">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-zinc-300 transition-colors">Privacidade</Link>
        </div>
        <p className="text-zinc-600 text-sm font-light">© {new Date().getFullYear()} FlashFest. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}