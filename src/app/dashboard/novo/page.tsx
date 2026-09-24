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
    const modoModeracao = formData.get('modoModeracao') as string;

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
      modoModeracao: modoModeracao || 'auto',
      statusPagamento: 'pendente' 
    });

    // Redireciona o cliente direto para o painel onde a Vitrine de Planos está aguardando
    redirect('/dashboard');
  }

  return (
    <div className="max-w-2xl mx-auto bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mt-4 sm:mt-8 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 font-[family-name:var(--font-jakarta)]">Criar Novo Evento</h2>
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
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition"
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
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 [color-scheme:dark] transition"
          />
        </div>
        <div>
          <label htmlFor="modoModeracao" className="block text-sm font-medium text-zinc-300 mb-2">
            Modo de Exibição no Telão
          </label>
          <select
            id="modoModeracao"
            name="modoModeracao"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-white text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition cursor-pointer"
          >
            <option value="auto">Automático (Fotos vão direto para o telão)</option>
            <option value="manual">Manual (Aprovar fotos no celular antes)</option>
          </select>
        </div>
        {/* ÁREA DOS BOTÕES E CONSENTIMENTO */}
        <div className="pt-6 border-t border-white/10 mt-6">
          {/* 1. Os botões ficam na própria linha deles, alinhados à direita */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mb-4">
            <Link 
              href="/dashboard" 
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white transition text-center font-medium text-sm"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-500 text-zinc-950 px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition text-center text-sm shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              Criar Evento
            </button>
          </div>
          {/* 2. O texto fica livre em baixo, centralizado */}
          <p className="text-xs text-zinc-500 text-center w-full">
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