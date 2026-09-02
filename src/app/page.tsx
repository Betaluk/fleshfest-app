import Link from 'next/link';
import { auth, signIn } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  // 1. Verificação de Sessão
  const session = await auth();
  const isLogado = !!session?.user;

  // 2. A sua Server Action de Login Seguro
  async function fazerLogin() {
    'use server';
    await signIn('google', { redirectTo: '/dashboard' });
  }

  // 3. Os Planos (Agora com IDs e Destaque)
  const planos = [
    { nome: 'Start', preco: '49', fotos: '500', dias: '2', ideal: 'Festas íntimas' },
    { nome: 'Pro', preco: '99', fotos: '2.000', dias: '7', ideal: 'Aniversários e noivados', destaque: true },
    { nome: 'VIP', preco: '149', fotos: '5.000', dias: '30', ideal: 'Casamentos e formaturas' },
    { nome: 'VIP+', preco: '199', fotos: '10.000', dias: '30', ideal: 'Grandes eventos corporativos' }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-emerald-500/30 font-sans">
      
      {/* EFEITO DE LUZ NO TOPO */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950/0 to-zinc-950/0"></div>

      {/* NAVBAR MINIMALISTA */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="text-xl font-bold tracking-tighter text-white">
          Flash<span className="text-emerald-500">Fest</span>
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
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            A câmera da sua festa na mão dos convidados
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-8">
            Transforme o seu evento <br className="hidden md:block" /> em uma experiência interativa.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Um telão ao vivo, QR Codes instantâneos e fotos salvas em alta qualidade. 
            Esqueça as hashtags confusas. Seus convidados escaneiam, tiram a foto e ela aparece no telão na mesma hora.
          </p>

          <div className="flex flex-col items-center justify-center gap-4">
            {isLogado ? (
              <Link 
                href="/dashboard" 
                className="px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-lg hover:scale-105 hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(52,211,153,0.4)]"
              >
                Acessar meu Painel
              </Link>
            ) : (
              <form action={fazerLogin}>
                <button 
                  type="submit" 
                  className="px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-lg hover:scale-105 hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(52,211,153,0.4)]"
                >
                  Criar Conta Gratuitamente
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

        {/* BENTO GRID DE FUNCIONALIDADES */}
        <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 tracking-tight">Tudo que você precisa, <span className="text-zinc-500">zero complicação.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition">
              <div className="text-3xl mb-4">📺</div>
              <h3 className="text-xl font-bold text-white mb-2">Telão Dinâmico</h3>
              <p className="text-zinc-400 leading-relaxed">Um slideshow cinematográfico que se atualiza em tempo real enquanto os convidados tiram as fotos. Com a sua logo flutuando perfeitamente.</p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-white mb-2">Moderação Total</h3>
              <p className="text-zinc-400 leading-relaxed">Assuma o controle. O anfitrião tem um painel direto no celular para aprovar ou ocultar qualquer foto antes que ela apareça no telão.</p>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:border-emerald-500/30 transition">
              <div className="text-3xl mb-4">🖨️</div>
              <h3 className="text-xl font-bold text-white mb-2">Placas e QR Codes</h3>
              <p className="text-zinc-400 leading-relaxed">Crie o evento e o sistema gera automaticamente os QR Codes e um PDF pronto para imprimir e colocar nas mesas dos convidados.</p>
            </div>
          </div>
        </section>

        {/* SEÇÃO DE PREÇOS */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Preço justo e sem surpresas.</h2>
            <p className="text-zinc-400">Escolha o plano ideal de acordo com o tamanho do seu evento.</p>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-4 gap-6 pb-8 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-6 px-6 md:mx-0 md:px-0">
            {planos.map((plano) => (
              <div 
                key={plano.nome} 
                className={`snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-auto flex flex-col justify-between p-8 rounded-3xl border ${
                  plano.destaque 
                    ? 'bg-zinc-900 border-emerald-500/50 shadow-[0_0_30px_-15px_rgba(52,211,153,0.3)] relative' 
                    : 'bg-zinc-900/30 border-white/5'
                }`}
              >
                {plano.destaque && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-zinc-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Mais Escolhido
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-medium text-zinc-300 mb-2">Plano {plano.nome}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-lg text-zinc-500">R$</span>
                    <span className="text-5xl font-extrabold text-white tracking-tighter">{plano.preco}</span>
                    <span className="text-sm text-zinc-500">/evento</span>
                  </div>
                  
                  <div className="space-y-4 text-sm text-zinc-300">
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500">✓</span>
                      <span>Até <strong>{plano.fotos} fotos</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500">✓</span>
                      <span><strong>{plano.dias} dias</strong> para baixar o ZIP</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500">✓</span>
                      <span>Telão e QR Code inclusos</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500">✓</span>
                      <span className="text-zinc-500">{plano.ideal}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  {isLogado ? (
                    <Link 
                      href="/dashboard" 
                      className={`block w-full py-3 rounded-xl font-semibold text-center transition-all ${
                        plano.destaque 
                          ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400' 
                          : 'bg-zinc-800 text-white hover:bg-zinc-700'
                      }`}
                    >
                      Começar Agora
                    </Link>
                  ) : (
                    <form action={fazerLogin} className="w-full">
                      <button 
                        type="submit" 
                        className={`w-full py-3 rounded-xl font-semibold text-center transition-all ${
                          plano.destaque 
                            ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400' 
                            : 'bg-zinc-800 text-white hover:bg-zinc-700'
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
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/5 mt-20 py-12 text-center">
        <div className="text-xl font-bold tracking-tighter text-white mb-4 opacity-50 grayscale">
          Flash<span className="text-emerald-500">Fest</span>
        </div>
        <div className="flex items-center justify-center gap-6 text-sm text-zinc-600 mb-6">
          <Link href="/termos" className="hover:text-zinc-400 transition">Termos de Uso</Link>
          <Link href="/privacidade" className="hover:text-zinc-400 transition">Privacidade</Link>
        </div>
        <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} FlashFest. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}