import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
  const db = getDb(env);

  const evento = await db
    .select()
    .from(eventos)
    .where(and(eq(eventos.id, id), eq(eventos.usuarioId, session.user.id)))
    .get();

  if (!evento) {
    return (
      <div className="text-center mt-20 text-white">
        <h2 className="text-2xl font-bold mb-4">Evento não encontrado</h2>
        <Link href="/dashboard" className="text-emerald-400 hover:underline">
          Voltar ao painel
        </Link>
      </div>
    );
  }
  // A TRAVA DE SEGURANÇA: Se não estiver pago, manda de volta para a vitrine!
  if (evento.statusPagamento !== 'pago') {
    redirect('/dashboard');
  }

  const dataIso = new Date(evento.dataEvento).toISOString().split('T')[0];

  async function atualizarEvento(formData: FormData) {
    'use server';

    const nome = formData.get('nome') as string;
    const data = formData.get('data') as string;
    const modoModeracao = formData.get('modoModeracao') as 'auto' | 'manual';
    const logo = formData.get('logo') as File | null;

    if (!nome || !data || !modoModeracao) return;

    // Atualizamos o tipo do Env para incluir o BUCKET_FOTOS
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env & { BUCKET_FOTOS: any } };
    const db = getDb(env);
    const session = await auth();

    if (session?.user?.id) {
      let novaUrlLogo = evento?.urlLogo || null; // Mantém a existente por padrão

      // Se o usuário selecionou um arquivo novo
      if (logo && logo.size > 0) {
        const ext = logo.name.split('.').pop() || 'png';
        const nomeFicheiro = `logo_${id}_${Date.now()}.${ext}`;
        const buffer = await logo.arrayBuffer();
        
        await env.BUCKET_FOTOS.put(nomeFicheiro, buffer, {
          httpMetadata: { contentType: logo.type },
        });

        const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : 'https://flashfest.com.br';
        novaUrlLogo = `${baseUrl}/api/fotos/${nomeFicheiro}`;
      }

      await db
        .update(eventos)
        .set({
          nomeEvento: nome,
          dataEvento: new Date(data),
          modoModeracao: modoModeracao,
          urlLogo: novaUrlLogo,
        })
        .where(and(eq(eventos.id, id), eq(eventos.usuarioId, session.user.id)));

      revalidatePath('/dashboard');
      revalidatePath(`/dashboard/evento/${id}`);
      redirect(`/dashboard/evento/${id}`); // Redireciona de volta para o painel da festa
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">Editar Evento</h2>
      
      <form action={atualizarEvento} className="space-y-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-zinc-300 mb-2">
            Nome da Festa
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            defaultValue={evento.nomeEvento}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
          />
        </div>

        <div>
          <label htmlFor="data" className="block text-sm font-medium text-zinc-300 mb-2">
            Data do Evento
          </label>
          <input
            type="date"
            id="data"
            name="data"
            defaultValue={dataIso}
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 [color-scheme:dark]"
          />
        </div>

        {/* SEÇÃO: Controle de Moderação */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-zinc-300 mb-3">
            Modo de Exibição no Telão
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`border rounded-lg p-4 cursor-pointer transition flex flex-col gap-2 ${evento.modoModeracao === 'auto' ? 'border-emerald-500 bg-emerald-500/10' : 'border-zinc-700 bg-zinc-950 hover:border-zinc-500'}`}>
              <div className="flex items-center gap-2">
                <input type="radio" name="modoModeracao" value="auto" defaultChecked={evento.modoModeracao === 'auto'} className="text-emerald-500 bg-zinc-900 border-zinc-700" />
                <span className="font-bold text-white">Automático</span>
              </div>
              <span className="text-sm text-zinc-400 pl-6">Fotos vão direto para o telão assim que tiradas.</span>
            </label>

            <label className={`border rounded-lg p-4 cursor-pointer transition flex flex-col gap-2 ${evento.modoModeracao === 'manual' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 bg-zinc-950 hover:border-zinc-500'}`}>
              <div className="flex items-center gap-2">
                <input type="radio" name="modoModeracao" value="manual" defaultChecked={evento.modoModeracao === 'manual'} className="text-amber-500 bg-zinc-900 border-zinc-700" />
                <span className="font-bold text-white">Manual</span>
              </div>
              <span className="text-sm text-zinc-400 pl-6">Você precisará aprovar as fotos antes de aparecerem.</span>
            </label>
          </div>
        </div>

        {/* --- A MAGIA DO MONOGRAMA AQUI --- */}
        <div className="pt-2">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Monograma / Marca d'Água (Opcional)</label>
          <div className="bg-zinc-950 border border-zinc-800 rounded-md p-4 flex flex-col gap-4">
            {evento.urlLogo && (
              <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded">
                ✅ Logo atual já configurada! Envie outra se desejar substituir.
              </div>
            )}
            <input type="file" name="logo" accept="image/png" className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition" />
            <p className="text-xs text-zinc-500">Envie uma imagem com fundo transparente (.PNG) para aparecer no canto inferior direito do telão.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end space-x-4 border-t border-zinc-800 mt-6">
          <Link href={`/dashboard/evento/${id}`} className="px-4 py-2 text-zinc-400 hover:text-white transition">
            Cancelar
          </Link>
          <button
            type="submit"
            className="bg-emerald-500 text-zinc-950 px-6 py-2 rounded-md font-bold hover:bg-emerald-400 transition"
          >
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
}