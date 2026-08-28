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

  const dataIso = new Date(evento.dataEvento).toISOString().split('T')[0];

  async function atualizarEvento(formData: FormData) {
    'use server';

    const nome = formData.get('nome') as string;
    const data = formData.get('data') as string;
    const modoModeracao = formData.get('modoModeracao') as 'auto' | 'manual';

    if (!nome || !data || !modoModeracao) return;

    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
    const db = getDb(env);
    const session = await auth();

    if (session?.user?.id) {
      await db
        .update(eventos)
        .set({
          nomeEvento: nome,
          dataEvento: new Date(data),
          modoModeracao: modoModeracao,
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

        {/* NOVA SEÇÃO: Controle de Moderação */}
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