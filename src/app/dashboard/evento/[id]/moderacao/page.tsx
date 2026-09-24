import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import AutoRefresh from '@/components/AutoRefresh';
import ModeracaoClient from './ModeracaoClient';

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
      chaveFicheiro,
      dataCaptura: foto.dataCaptura instanceof Date ? foto.dataCaptura.toISOString() : String(foto.dataCaptura)
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

      <ModeracaoClient
        fotosPendentes={fotosPendentes}
        fotosAprovadas={fotosAprovadas}
        nomeEvento={evento.nomeEvento}
        aprovarFotoAction={aprovarFoto}
        rejeitarFotoAction={rejeitarFoto}
        aprovarTodasAction={aprovarTodas}
      />
    </div>
  );
}