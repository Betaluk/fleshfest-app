import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos, planos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import GaleriaGrid from './GaleriaGrid';
import BotoesCompartilhamento from './BotoesCompartilhamento';

export const dynamic = 'force-dynamic';

// 1. Atualizamos a tipagem do params para Promise
export default async function GaleriaPublica({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Extraímos o ID "aguardando" a Promise se resolver
  const { id } = await params;

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
  const db = getDb(env);

  // 3. Buscamos no banco usando a constante 'id' limpa
  const evento = await db.select().from(eventos).where(eq(eventos.id, id)).get();
  
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
  const isDemo = evento.id === 'e0f9535f-d7b3-465d-8b61-b3fb70722656';
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
  // 3. Busca de Fotos com Trava de Moderação
  // Se for manual, puxa só as que estão com status 'aprovada'. Se for automático, puxa todas.
  const fotosBrutas = await db.select().from(fotos)
    .where(
      evento.modoModeracao === 'manual'
        ? and(eq(fotos.eventoId, evento.id), eq(fotos.status, 'aprovada'))
        : eq(fotos.eventoId, evento.id)
    )
    .orderBy(desc(fotos.id)); // Exibe as mais recentes primeiro

  // =================================================================
  // NOVA LÓGICA: URL Pública do CDN (Custo Zero de CPU)
  const cdnBase = 'https://cdn.flashfest.com.br';
  const fotosGaleria = fotosBrutas.map((foto) => {
    const chaveFicheiro = foto.urlImagem.split('/').pop() || '';
    return {
      ...foto,
      urlImagem: `${cdnBase}/${chaveFicheiro}`,
      dataCaptura: foto.dataCaptura instanceof Date ? foto.dataCaptura.toISOString() : String(foto.dataCaptura)
    };
  });
  // =================================================================
  const dataFormatada = new Date(evento.dataEvento).toLocaleDateString('pt-BR');
  // Monta a URL completa baseada no ambiente
  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://flashfest.com.br';
  const urlGaleria = `${baseUrl}/g/${evento.id}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-32">
      {/* CABEÇALHO */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight break-words">{evento.nomeEvento}</h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-0.5">Realizado em {dataFormatada} • {fotosGaleria.length} {fotosGaleria.length === 1 ? 'mídia' : 'mídias'}</p>
          </div>
          
          {/* A INJEÇÃO DOS BOTÕES */}
          <BotoesCompartilhamento url={urlGaleria} nomeEvento={evento.nomeEvento} />
        </div>
      </header>

      {/* GRID INTERATIVO COM LIGHTBOX */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <GaleriaGrid fotos={fotosGaleria} nomeEvento={evento.nomeEvento} />
      </main>

      {/* BANNER DE MARKETING (Sticky no Rodapé) */}
      <div className="fixed bottom-0 inset-x-0 z-40 p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent pointer-events-none">
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