import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos, planos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import BotaoDownload from './BotaoDownload';

export const dynamic = 'force-dynamic';

export default async function GaleriaPublica({ params }: { params: { id: string } }) {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
  const db = getDb(env);

  // 1. Busca o Evento e o Plano
  const evento = await db.select().from(eventos).where(eq(eventos.id, params.id)).get();
  
  if (!evento) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Galeria não encontrada</h1>
        <p className="text-zinc-400">Verifique se o link está correto.</p>
      </div>
    );
  }

  const plano = await db.select().from(planos).where(eq(planos.id, evento.planoId)).get();
  const diasExp = plano?.diasExpiracao || 2;

  // 2. Lógica de Expiração
  const isDemo = evento.id === 'SEU_ID_DA_DEMO_AQUI'; // Coloque o ID da sua demo imortal aqui
  const dataLimite = new Date(evento.dataEvento);
  dataLimite.setDate(dataLimite.getDate() + diasExp);
  const hoje = new Date();

  if (hoje > dataLimite && !isDemo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-3xl font-bold text-white mb-4">Galeria Expirada</h1>
        <p className="text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
          O prazo de {diasExp} dias do plano contratado chegou ao fim e essas memórias foram arquivadas.
        </p>
        <Link href="/" className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition">
          Conhecer o FlashFest
        </Link>
      </div>
    );
  }

  // 3. Busca de Fotos com Trava de Moderação
  // Se for manual, puxa só as que estão com status 'aprovada'. Se for automático, puxa todas.
  const fotosGaleria = await db.select().from(fotos)
    .where(
      evento.modoModeracao === 'manual'
        ? and(eq(fotos.eventoId, evento.id), eq(fotos.status, 'aprovada'))
        : eq(fotos.eventoId, evento.id)
    )
    .orderBy(desc(fotos.id)); // Exibe as mais recentes primeiro

  const dataFormatada = new Date(evento.dataEvento).toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-32">
      
      {/* CABEÇALHO */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{evento.nomeEvento}</h1>
            <p className="text-zinc-400 text-sm">Realizado em {dataFormatada} • {fotosGaleria.length} fotos</p>
          </div>
          <div className="text-xl font-bold tracking-tighter opacity-50">
            Flash<span className="text-emerald-500">Fest</span>
          </div>
        </div>
      </header>

      {/* GRID DE FOTOS (Estilo Masonry/Pinterest com CSS nativo) */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {fotosGaleria.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            Nenhuma foto disponível para exibição no momento.
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {fotosGaleria.map((foto) => (
              <div key={foto.id} className="relative group break-inside-avoid rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={foto.urlImagem} 
                  alt="Momento do evento" 
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Overlay com Botão de Download (Aparece no Hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                  <BotaoDownload url={foto.urlImagem} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* BANNER DE MARKETING (Sticky no Rodapé) */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_40px_-10px_rgba(52,211,153,0.2)]">
            <div>
              <p className="text-white font-bold text-sm sm:text-base">Gostou da experiência?</p>
              <p className="text-zinc-400 text-xs sm:text-sm">Leve o telão interativo do FlashFest para a sua próxima festa.</p>
            </div>
            <Link 
              href="/" 
              className="w-full sm:w-auto text-center px-6 py-2 bg-emerald-500 text-zinc-950 text-sm font-bold rounded-xl hover:bg-emerald-400 transition"
            >
              Criar meu Evento
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}