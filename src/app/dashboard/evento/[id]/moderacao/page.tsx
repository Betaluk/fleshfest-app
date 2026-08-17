import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

// Impede que a página seja guardada em cache (estática)
export const dynamic = 'force-dynamic';

export default async function ModeracaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Lógica de Backend para APROVAR a foto (Server Action)
  async function aprovarFoto(formData: FormData) {
    'use server';
    const fotoId = formData.get('fotoId') as string;
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
    const db = getDb(env);
    
    await db.update(fotos).set({ status: 'aprovada' }).where(eq(fotos.id, fotoId));
    revalidatePath(`/dashboard/evento/${id}/moderacao`); // Recarrega a página para atualizar a grelha
  }

  // Lógica de Backend para REJEITAR a foto (Server Action)
  async function rejeitarFoto(formData: FormData) {
    'use server';
    const fotoId = formData.get('fotoId') as string;
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
    const db = getDb(env);
    
    await db.update(fotos).set({ status: 'rejeitada' }).where(eq(fotos.id, fotoId));
    revalidatePath(`/dashboard/evento/${id}/moderacao`);
  }

  // Ligar à base de dados para carregar o evento e as fotos
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
  const db = getDb(env);

  const evento = await db.select().from(eventos).where(eq(eventos.id, id)).get();
  if (!evento) return <div className="p-8 text-white">Evento não encontrado</div>;

  // Vai buscar TODAS as fotografias deste evento, da mais recente para a mais antiga
  const listaFotos = await db.select().from(fotos).where(eq(fotos.eventoId, id)).orderBy(desc(fotos.dataCaptura));

  return (
    <div className="space-y-6 mt-4">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Fila de Moderação</h2>
          <p className="text-sm text-zinc-400 mt-1">Gira as fotografias que aparecerão no ecrã principal.</p>
        </div>
        <Link href={`/dashboard/evento/${id}`} className="px-5 py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition">
          Voltar ao Evento
        </Link>
      </div>

      {listaFotos.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-400">
          Nenhuma fotografia foi tirada neste evento ainda.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listaFotos.map((foto) => (
            <div key={foto.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
              {/* O nosso "truque" para carregar a imagem via API local */}
              <div className="relative aspect-[3/4] w-full bg-black">
                <img
                  src={foto.urlImagem.replace('https://fotos.flashfest.com', '/api/fotos')}
                  alt="Foto do convidado"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-zinc-400">Estado:</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                    foto.status === 'aprovada' ? 'bg-emerald-500/10 text-emerald-400' :
                    foto.status === 'rejeitada' ? 'bg-red-500/10 text-red-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {foto.status}
                  </span>
                </div>

                <div className="flex gap-2 w-full">
                  <form action={aprovarFoto} className="flex-1">
                    <input type="hidden" name="fotoId" value={foto.id} />
                    <button 
                      type="submit" 
                      disabled={foto.status === 'aprovada'}
                      className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 py-2 rounded-lg text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ✅ Aprovar
                    </button>
                  </form>
                  <form action={rejeitarFoto} className="flex-1">
                    <input type="hidden" name="fotoId" value={foto.id} />
                    <button 
                      type="submit" 
                      disabled={foto.status === 'rejeitada'}
                      className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-medium transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ❌ Rejeitar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}