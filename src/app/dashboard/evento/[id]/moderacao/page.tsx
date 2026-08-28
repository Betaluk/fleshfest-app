import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { gerarUrlAssinada } from '@/lib/seguranca';

export const dynamic = 'force-dynamic';

export default async function ModeracaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) redirect('/');

  // Adicionamos o BUCKET_FOTOS e IMAGE_SECRET para podermos apagar e exibir fotos com segurança
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
    env: Env & { IMAGE_SECRET: string, BUCKET_FOTOS: any } 
  };
  const db = getDb(env);

  const evento = await db.select().from(eventos).where(eq(eventos.id, id)).get();
  if (!evento || evento.usuarioId !== session.user.id) redirect('/dashboard');

  // Busca TODAS as fotos da festa, ordenadas da mais recente para a mais antiga
  const todasFotos = await db.select().from(fotos).where(eq(fotos.eventoId, id)).orderBy(desc(fotos.dataCaptura));

  // Gera as URLs seguras para o anfitrião conseguir ver as imagens bloqueadas
  const fotosSeguras = await Promise.all(
    todasFotos.map(async (foto) => {
      const chaveFicheiro = foto.urlImagem.split('/').pop() || '';
      const urlSegura = await gerarUrlAssinada(chaveFicheiro, env.IMAGE_SECRET, 12);
      return { ...foto, urlImagem: urlSegura, chaveFicheiro };
    })
  );

  const fotosPendentes = fotosSeguras.filter(f => f.status === 'pendente');
  const fotosAprovadas = fotosSeguras.filter(f => f.status === 'aprovada');

  // --- AÇÕES DE SERVIDOR ---
  async function aprovarFoto(formData: FormData) {
    'use server';
    const fotoId = formData.get('fotoId') as string;
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
    await getDb(env).update(fotos).set({ status: 'aprovada' }).where(eq(fotos.id, fotoId));
    revalidatePath(`/dashboard/evento/${id}/moderacao`);
  }

  async function rejeitarFoto(formData: FormData) {
    'use server';
    const fotoId = formData.get('fotoId') as string;
    const chaveFicheiro = formData.get('chaveFicheiro') as string;
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env & { BUCKET_FOTOS: any } };
    
    // 1. Apaga do Cloudflare R2 (Poupa custos)
    if (chaveFicheiro) await env.BUCKET_FOTOS.delete(chaveFicheiro);
    // 2. Apaga do Banco de Dados
    await getDb(env).delete(fotos).where(eq(fotos.id, fotoId));
    
    revalidatePath(`/dashboard/evento/${id}/moderacao`);
  }

  return (
    <div className="space-y-8 mt-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-zinc-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Moderação e Galeria</h2>
          <p className="text-zinc-400 mt-1">Festa: {evento.nomeEvento}</p>
        </div>
        <Link href={`/dashboard/evento/${id}`} className="px-5 py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition text-center">
          Voltar ao Painel
        </Link>
      </div>

      {/* FILA DE APROVAÇÃO (Aparece se houver fotos pendentes) */}
      {fotosPendentes.length > 0 && (
        <section className="bg-zinc-900 border border-amber-900/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">⏳</span>
            <h3 className="text-xl font-bold text-amber-400">Fila de Aprovação ({fotosPendentes.length})</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {fotosPendentes.map((foto) => (
              <div key={foto.id} className="relative group rounded-lg overflow-hidden border border-zinc-700 bg-black aspect-[3/4]">
                <img src={foto.urlImagem} alt="Pendente" className="w-full h-full object-cover" />
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-3 p-4">
                  <form action={aprovarFoto} className="w-full">
                    <input type="hidden" name="fotoId" value={foto.id} />
                    <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold py-2 rounded shadow-lg transition">
                      ✅ Aprovar
                    </button>
                  </form>
                  <form action={rejeitarFoto} className="w-full">
                    <input type="hidden" name="fotoId" value={foto.id} />
                    <input type="hidden" name="chaveFicheiro" value={foto.chaveFicheiro} />
                    <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded shadow-lg transition">
                      🗑️ Rejeitar
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALERIA DE FOTOS APROVADAS */}
      <section>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>✅</span> Galeria Ativa no Telão ({fotosAprovadas.length})
        </h3>
        
        {fotosAprovadas.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center text-zinc-400">
            Ainda não há fotos aprovadas para esta festa.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fotosAprovadas.map((foto) => (
              <div key={foto.id} className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-black aspect-[3/4]">
                <img src={foto.urlImagem} alt="Aprovada" className="w-full h-full object-cover" />
                
                {/* Botão para apagar a foto caso tenha se arrependido de aprovar */}
                <form action={rejeitarFoto} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <input type="hidden" name="fotoId" value={foto.id} />
                  <input type="hidden" name="chaveFicheiro" value={foto.chaveFicheiro} />
                  <button className="bg-black/80 hover:bg-red-600 text-white p-2 rounded-full transition" title="Excluir Foto">
                    🗑️
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}