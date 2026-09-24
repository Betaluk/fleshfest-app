import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import AutoRefresh from '@/components/AutoRefresh';

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

  // Gera as URLs baseadas no seu domínio público do R2
  const cdnBase = 'https://cdn.flashfest.com.br';
  
  const fotosSeguras = todasFotos.map((foto) => {
    const chaveFicheiro = foto.urlImagem.split('/').pop() || '';
    return { 
      ...foto, 
      urlImagem: `${cdnBase}/${chaveFicheiro}`, 
      chaveFicheiro 
    };
  });

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

  async function aprovarTodas() {
    'use server';
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
    await getDb(env)
      .update(fotos)
      .set({ status: 'aprovada' })
      .where(and(eq(fotos.eventoId, id), eq(fotos.status, 'pendente')));
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
    <div className="space-y-8 mt-4 animate-fade-in-up">
      <AutoRefresh interval={10000} /> {/* Atualiza a cada 10 segundos */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-zinc-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight font-[family-name:var(--font-jakarta)]">
            Moderação e Galeria
          </h2>
          <p className="text-zinc-400 mt-1">Festa: <strong className="text-white">{evento.nomeEvento}</strong></p>
        </div>
        <Link href={`/dashboard/evento/${id}`} className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-xl transition text-center border border-white/10 hover:border-white/20">
          ← Voltar ao Painel
        </Link>
      </div>

      {/* FILA DE APROVAÇÃO (Aparece se houver fotos pendentes) */}
      {fotosPendentes.length > 0 && (
        <section className="bg-zinc-900/60 border border-amber-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">⏳</span>
              <div>
                <h3 className="text-xl font-bold text-amber-400">Fila de Aprovação ({fotosPendentes.length})</h3>
                <p className="text-xs text-zinc-400">Aprove ou rejeite mídias antes de subirem para o telão</p>
              </div>
            </div>

            <form action={aprovarTodas}>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>✅</span> Aprovar Todas ({fotosPendentes.length})
              </button>
            </form>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {fotosPendentes.map((foto) => (
              <div key={foto.id} className="relative group rounded-2xl overflow-hidden border border-zinc-700 bg-black aspect-[3/4] shadow-md flex flex-col justify-end">
                
                {/* LÓGICA HÍBRIDA: FILA DE APROVAÇÃO */}
                {foto.tipoMedia === 'video' ? (
                  <video 
                    src={foto.urlImagem} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-contain absolute inset-0"
                  />
                ) : (
                  <img src={foto.urlImagem} alt="Pendente" className="w-full h-full object-contain absolute inset-0" />
                )}

                {/* Mensagem do Convidado (se houver) */}
                {foto.mensagem && (
                  <div className="absolute top-2 inset-x-2 z-10">
                    <p className="text-[11px] bg-black/80 backdrop-blur-md text-zinc-200 px-2.5 py-1 rounded-lg line-clamp-2 border border-white/10 shadow">
                      💬 {foto.mensagem}
                    </p>
                  </div>
                )}
                
                {/* BARRA DE AÇÕES: Sempre visível no mobile, e no hover em desktop */}
                <div className="relative z-20 w-full p-2.5 bg-gradient-to-t from-black via-black/80 to-transparent flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <form action={aprovarFoto} className="flex-1">
                    <input type="hidden" name="fotoId" value={foto.id} />
                    <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold py-2 rounded-xl shadow-md transition flex items-center justify-center gap-1 cursor-pointer">
                      <span>✓</span> Aprovar
                    </button>
                  </form>
                  <form action={rejeitarFoto} className="flex-1">
                    <input type="hidden" name="fotoId" value={foto.id} />
                    <input type="hidden" name="chaveFicheiro" value={foto.chaveFicheiro} />
                    <button className="w-full bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-xl shadow-md transition flex items-center justify-center gap-1 cursor-pointer">
                      <span>✕</span> Rejeitar
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
          <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-12 text-center text-zinc-400">
            Ainda não há mídias aprovadas para esta festa.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fotosAprovadas.map((foto) => (
              <div key={foto.id} className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-black aspect-[3/4] shadow-md">
                
                {/* LÓGICA HÍBRIDA: GALERIA DE APROVADAS */}
                {foto.tipoMedia === 'video' ? (
                  <video 
                    src={foto.urlImagem} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img src={foto.urlImagem} alt="Aprovada" className="w-full h-full object-contain" />
                )}

                {/* Mensagem do Convidado (se houver) */}
                {foto.mensagem && (
                  <div className="absolute bottom-2 inset-x-2 z-10 pointer-events-none">
                    <p className="text-[10px] bg-black/80 backdrop-blur-md text-zinc-300 px-2 py-0.5 rounded-md truncate border border-white/10">
                      💬 {foto.mensagem}
                    </p>
                  </div>
                )}
                
                {/* Botão para apagar a foto caso tenha se arrependido de aprovar (Sempre visível no mobile) */}
                <form action={rejeitarFoto} className="absolute top-2 right-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-20">
                  <input type="hidden" name="fotoId" value={foto.id} />
                  <input type="hidden" name="chaveFicheiro" value={foto.chaveFicheiro} />
                  <button className="bg-black/80 hover:bg-red-600 text-white p-2 rounded-xl transition border border-white/10 backdrop-blur-md cursor-pointer" title="Excluir Mídia">
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