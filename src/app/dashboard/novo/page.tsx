import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, planos, usuarios } from '@/db/schema';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function NovoEventoPage() {
  
  async function criarEvento(formData: FormData) {
    'use server';

    const nome = formData.get('nome') as string;
    const data = formData.get('data') as string;

    if (!nome || !data) return;

    const sessionAction = await auth();
    if (!sessionAction?.user?.id) {
        throw new Error("Utilizador não autenticado");
    }

    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
    const db = getDb(env);

    await db.insert(planos).values({
      id: 'plano-falso',
      nomePlano: 'Plano Padrão',
      limiteFotos: 500,
      diasExpiracao: 2,
      preco: 0
    }).onConflictDoNothing();
    
    await db.insert(usuarios).values({
      id: sessionAction.user.id,
      nome: sessionAction.user.name || 'Usuário Google',
      email: sessionAction.user.email || 'email@teste.com',
      dataCriacao: new Date() 
    }).onConflictDoNothing();
    
    const novoId = crypto.randomUUID();

    // --- GRAVAMOS O EVENTO NO BANCO ---
    // Ele entra como "pendente" e com o "plano-falso" até o cliente pagar
    await db.insert(eventos).values({
      id: novoId,
      usuarioId: sessionAction.user.id, 
      planoId: 'plano-falso',          
      nomeEvento: nome,
      dataEvento: new Date(data),
      muralAtivo: true,
      modoModeracao: 'auto',
      statusPagamento: 'pendente' 
    });

    // Redireciona o cliente direto para o painel onde a Vitrine de Planos está aguardando
    redirect('/dashboard');
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-white mb-6">Criar Novo Evento</h2>
      <form action={criarEvento} className="space-y-6">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-zinc-300 mb-2">
            Nome da Festa
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            placeholder="Ex: Casamento Ana & João"
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
            required
            className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 [color-scheme:dark]"
          />
        </div>
        <div className="pt-4 flex justify-end space-x-4 border-t border-zinc-800 mt-6">
          <Link href="/dashboard" className="px-4 py-2 text-zinc-400 hover:text-white transition">
            Cancelar
          </Link>
          <button
            type="submit"
            className="bg-emerald-500 text-zinc-950 px-6 py-2 rounded-md font-bold hover:bg-emerald-400 transition"
          >
            Criar Evento
          </button>
          <p className="text-xs text-zinc-500 text-center mt-4 w-full">
            Ao criar um evento, você concorda com nossos{' '}
            <Link href="/termos" target="_blank" className="underline hover:text-zinc-300">Termos de Uso</Link>
            {' '}e{' '}
            <Link href="/privacidade" target="_blank" className="underline hover:text-zinc-300">Política de Privacidade</Link>.
          </p>
        </div>
      </form>
    </div>
  );
}