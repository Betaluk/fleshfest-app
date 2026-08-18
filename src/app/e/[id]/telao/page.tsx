import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import Slideshow from './Slideshow';

export const dynamic = 'force-dynamic';

export default async function TelaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
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
  const fotosTratadas = fotosAprovadas.map(foto => ({
    ...foto,
    urlImagem: foto.urlImagem.replace('https://fotos.flashfest.com', '/api/fotos')
  }));

  // --- MÁGICA DA URL DINÂMICA AQUI ---
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8787' 
    : 'https://flashfest.lucasregesbarros.workers.dev';

  const urlCamera = `${baseUrl}/e/${id}`;
  // -----------------------------------

  return <Slideshow fotos={fotosTratadas} urlCamera={urlCamera} />;
}