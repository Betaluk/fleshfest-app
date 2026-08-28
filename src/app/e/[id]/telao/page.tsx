import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import Slideshow from './Slideshow';
import { gerarUrlAssinada } from '@/lib/seguranca';

export const dynamic = 'force-dynamic';

export default async function TelaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env & { IMAGE_SECRET: string } };
  const db = getDb(env);

  const evento = await db.select().from(eventos).where(eq(eventos.id, id)).get();

  if (!evento) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center text-white">
        <h2 className="text-2xl font-bold">Evento não encontrado</h2>
      </div>
    );
  }

  const fotosAprovadas = await db
    .select()
    .from(fotos)
    .where(and(eq(fotos.eventoId, id), eq(fotos.status, 'aprovada')))
    .orderBy(desc(fotos.dataCaptura));

  // TRUQUE: Troca o domínio pela nossa API para a imagem carregar perfeitamente no R2
  const fotosTratadas = await Promise.all(fotosAprovadas.map(async (foto) => {
    const chaveFicheiro = foto.urlImagem.split('/').pop() || '';
    // Assina a URL para durar 12 horas
    const urlSegura = await gerarUrlAssinada(chaveFicheiro, env.IMAGE_SECRET, 12);
    
    return {
      ...foto,
      urlImagem: urlSegura
    };
  }));

  // =================================================================
  // NOVA LÓGICA: Desbloqueando a Logo segura para o telão
  let urlLogoSegura = null;
  if (evento?.urlLogo) {
    const chaveLogo = evento.urlLogo.split('/').pop() || '';
    urlLogoSegura = await gerarUrlAssinada(chaveLogo, env.IMAGE_SECRET, 12);
  }
  // =================================================================

  // --- MÁGICA DA URL DINÂMICA (Fazemos isso ANTES do return) ---
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8787' 
    : 'https://flashfest.lucasregesbarros.workers.dev';

  const urlCamera = `${baseUrl}/e/${id}`;
  // -----------------------------------

  // O RETURN ÚNICO QUE ENVOLVE TUDO: O Slideshow e a Logo!
  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      
      {/* 1. O fundo com as fotos animadas */}
      <Slideshow fotos={fotosTratadas} urlCamera={urlCamera} />
      
      {/* 2. O Monograma flutuando no canto inferior direito por cima das fotos */}
      {urlLogoSegura && (
        <div className="absolute bottom-10 right-10 z-50 pointer-events-none">
          <img 
            src={urlLogoSegura} 
            alt="Monograma" 
            className="max-h-40 max-w-[300px] object-contain drop-shadow-2xl opacity-90"
          />
        </div>
      )}

    </main>
  );
}