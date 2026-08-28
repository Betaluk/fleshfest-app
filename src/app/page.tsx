import Link from "next/link";
import { signIn } from '@/auth';

export default function Home() {
  async function fazerLogin() {
    'use server';
    await signIn('google', { redirectTo: '/dashboard' });
  }
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30">
      
      {/* Navegação */}
      <nav className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-2xl tracking-tighter text-white">
            Flash<span className="text-emerald-400">Fest</span>
          </div>
          <form action={fazerLogin}>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium bg-white text-black px-5 py-2 rounded-full hover:bg-zinc-200 transition"
            >
              Entrar / Criar Evento
            </Link>
          </form>  
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center mt-8">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          O telão interativo do seu <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            evento inesquecível.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          Transforme os seus convidados nos fotógrafos oficiais do evento. 
          Eles escaneiam o QR Code, tiram a foto e ela aparece instantaneamente no telão da festa!
        </p>
        <form action={fazerLogin}>
          <Link 
            href="/dashboard" 
            className="inline-block bg-emerald-500 text-zinc-950 text-lg font-bold px-8 py-4 rounded-full hover:bg-emerald-400 transition transform hover:scale-105"
          >
            Começar Agora
          </Link>
        </form>
      </section>

      {/* Como Funciona */}
      <section className="border-t border-zinc-900 bg-zinc-900/20 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Como funciona a mágica?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            
            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl text-center hover:border-emerald-500/50 transition">
              <div className="text-5xl mb-6">📱</div>
              <h3 className="text-xl font-bold mb-3">1. Escaneie</h3>
              <p className="text-zinc-400">Os convidados apontam o celular para o QR Code nas mesas. Não precisam instalar nenhuma aplicação!</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl text-center hover:border-emerald-500/50 transition">
              <div className="text-5xl mb-6">📸</div>
              <h3 className="text-xl font-bold mb-3">2. Capture</h3>
              <p className="text-zinc-400">Através da nossa câmera web otimizada, eles tiram as selfies e fotos dos melhores momentos da festa.</p>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl text-center hover:border-emerald-500/50 transition">
              <div className="text-5xl mb-6">📺</div>
              <h3 className="text-xl font-bold mb-3">3. Telão ao Vivo</h3>
              <p className="text-zinc-400">Em segundos, a foto é processada e entra num slideshow animado no telão principal do evento.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="border-t border-zinc-900 py-12 text-center text-zinc-500">
        <p>© {new Date().getFullYear()} FlashFest. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}