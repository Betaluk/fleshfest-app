import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { auth, signIn } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();

  // Se NÃO houver sessão, mostra a tela de Login
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
        <h1 className="text-4xl font-bold text-white">Bem-vindo ao FlashFest</h1>
        <p className="text-zinc-400">Entre na sua conta para criar e gerenciar os seus eventos.</p>
        
        <form action={async () => { 'use server'; await signIn('google'); }}>
          <button type="submit" className="bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-zinc-200 transition flex items-center gap-2">
            Entrar com Google
          </button>
        </form>
      </div>
    );
  }

  // Se houver sessão, puxa os eventos
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
  const db = getDb(env);

  const meusEventos = await db.select().from(eventos).where(eq(eventos.usuarioId, session.user.id!));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meus Eventos</h2>
        <Link href="/dashboard/novo" className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-zinc-200 transition">
          + Criar Evento
        </Link>
      </div>

      {meusEventos.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center text-zinc-400">
          Você ainda não tem nenhum evento. Comece a sua primeira festa!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meusEventos.map((evento) => (
             <div key={evento.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-5">
               <h3 className="text-lg font-semibold text-white">{evento.nomeEvento}</h3>
               <Link href={`/dashboard/evento/${evento.id}`} className="mt-4 text-sm font-medium text-white block text-center bg-zinc-800 hover:bg-zinc-700 py-2 rounded transition">
                 Gerenciar Evento
               </Link>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}