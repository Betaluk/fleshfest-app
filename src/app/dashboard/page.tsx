import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';
import BotaoExcluir from './BotaoExcluir'; // Importamos o nosso novo botão super inteligente!

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  // Adicionamos qualquer tipo (any) ao BUCKET_FOTOS para garantir que o TypeScript aceita a limpeza
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
    env: Env & { STRIPE_SECRET_KEY: string, BUCKET_FOTOS: any } 
  };
  const db = getDb(env);

  const meusEventos = await db.select()
    .from(eventos)
    .where(eq(eventos.usuarioId, session.user.id))
    .orderBy(desc(eventos.dataEvento));

  async function pagarEvento(formData: FormData) {
    'use server';
    const eventoId = formData.get('eventoId') as string;
    if (!eventoId) return;

    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env & { STRIPE_SECRET_KEY: string } };
    
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-07-29.dahlia', 
      httpClient: Stripe.createFetchHttpClient(),
    });

    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : 'https://flashfest.lucasregesbarros.workers.dev'; 

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: 'price_1U6EnXRsvoZpGZFTbYxCJVol', // <--- MANTENHA O SEU PRICE ID AQUI
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${baseUrl}/dashboard?sucesso=true`,
      cancel_url: `${baseUrl}/dashboard`,
      client_reference_id: eventoId,
      allow_promotion_codes: true,
    });

    redirect(checkoutSession.url!);
  }

  // --- A NOVA LÓGICA DE EXCLUSÃO (Limpeza Total) ---
  async function deletarEvento(formData: FormData) {
    'use server';
    const eventoId = formData.get('eventoId') as string;
    if (!eventoId) return;

    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env & { BUCKET_FOTOS: any } };
    const db = getDb(env);
    const session = await auth();

    if (session?.user?.id) {
      // 1. Busca todas as fotos desta festa na base de dados
      const fotosParaDeletar = await db.select().from(fotos).where(eq(fotos.eventoId, eventoId));

      // 2. Apaga fisicamente os ficheiros pesados no R2 da Cloudflare
      for (const foto of fotosParaDeletar) {
        // Extrai o nome do ficheiro do final da URL (ex: 'meuarquivo.jpg')
        const chaveFicheiro = foto.urlImagem.split('/').pop();
        if (chaveFicheiro) {
          await env.BUCKET_FOTOS.delete(chaveFicheiro);
        }
      }

      // 3. Agora sim, apaga o evento (e as fotos do D1 em cascata, se configurado)
      await db.delete(eventos).where(
        and(eq(eventos.id, eventoId), eq(eventos.usuarioId, session.user.id))
      );
      
      revalidatePath('/dashboard');
    }
  }

  return (
    <div className="space-y-8 mt-4">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Meus Eventos</h2>
          <p className="text-zinc-400 mt-1">Gerencie suas festas e telões ativos.</p>
        </div>
        <Link href="/dashboard/novo" className="bg-emerald-500 text-zinc-950 px-6 py-2 rounded-md font-bold hover:bg-emerald-400 transition">
          + Criar Evento
        </Link>
      </div>

      {meusEventos.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-white mb-2">Nenhuma festa por aqui!</h3>
          <p className="text-zinc-400 mb-6">Crie o seu primeiro evento e comece a recolher memórias.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meusEventos.map((evento) => {
            const isPago = evento.statusPagamento === 'pago';
            const dataFormatada = new Date(evento.dataEvento).toLocaleDateString('pt-BR');

            return (
              <div key={evento.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white leading-tight">{evento.nomeEvento}</h3>
                    {isPago ? (
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded">ATIVO</span>
                    ) : (
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded">PENDENTE</span>
                    )}
                  </div>
                  <div className="text-sm text-zinc-400 mb-6">
                    <p>📅 Data: {dataFormatada}</p>
                    <p>📸 Plano: {evento.planoId === 'plano-falso' ? 'Padrão' : evento.planoId}</p>
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                  {isPago ? (
                    <Link 
                      href={`/dashboard/evento/${evento.id}`} 
                      className="w-full block text-center bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-2 rounded-lg transition"
                    >
                      Gerenciar Evento
                    </Link>
                  ) : (
                    <form action={pagarEvento} className="w-full">
                      <input type="hidden" name="eventoId" value={evento.id} />
                      <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition">
                        💳 Pagar Agora
                      </button>
                    </form>
                  )}

                  <div className="flex gap-2 pt-2 border-t border-zinc-800/80">
                    <Link
                      href={`/dashboard/evento/${evento.id}/editar`}
                      className="flex-1 flex items-center justify-center gap-1 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 py-1.5 rounded text-sm transition"
                    >
                      ✏️ Editar
                    </Link>

                    {/* AQUI ESTÁ A NOSSA NOVA MAGIA! */}
                    <form action={deletarEvento}>
                      <input type="hidden" name="eventoId" value={evento.id} />
                      <BotaoExcluir isPago={isPago} nomeEvento={evento.nomeEvento} />
                    </form>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}