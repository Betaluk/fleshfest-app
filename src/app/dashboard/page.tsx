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
    const priceId = formData.get('priceId') as string; // Agora recebemos o ID exato
    if (!eventoId || !priceId) return;

    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env & { STRIPE_SECRET_KEY: string } };
    
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-07-29.dahlia', 
      httpClient: Stripe.createFetchHttpClient(),
    });

    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : 'https://flashfest.com.br'; 

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Se ativou PIX na Stripe, pode adicionar 'pix' aqui depois
      line_items: [{
        price: priceId, // ID injetado dinamicamente
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
      // 0. Busca o evento para sabermos se ele tem uma Logo
      const evento = await db
        .select()
        .from(eventos)
        .where(and(eq(eventos.id, eventoId), eq(eventos.usuarioId, session.user.id)))
        .get();

      if (!evento) return;

      // 1. Busca todas as fotos desta festa na base de dados
      const fotosParaDeletar = await db.select().from(fotos).where(eq(fotos.eventoId, eventoId));

      // 2. Apaga fisicamente os ficheiros (Fotos) no R2 da Cloudflare
      for (const foto of fotosParaDeletar) {
        const chaveFicheiro = foto.urlImagem.split('/').pop();
        if (chaveFicheiro) {
          await env.BUCKET_FOTOS.delete(chaveFicheiro);
        }
      }

      // 2.1 Apaga a Logo fisicamente no R2 (se houver)
      if (evento.urlLogo) {
        const chaveLogo = evento.urlLogo.split('/').pop();
        if (chaveLogo) {
          await env.BUCKET_FOTOS.delete(chaveLogo);
        }
      }

      // 3. LIMPEZA NO BANCO DE DADOS (A ordem é vital: primeiro as fotos, depois o evento)
      await db.delete(fotos).where(eq(fotos.eventoId, eventoId)); // <- ESTA É A LINHA QUE FALTAVA!
      
      await db.delete(eventos).where(
        and(eq(eventos.id, eventoId), eq(eventos.usuarioId, session.user.id))
      );
      
      revalidatePath('/dashboard');
    }
  }

  const planosDisponiveis = [
    { id: 'price_1UAyWLRwdoo1gIwbBa6BWaRO', nome: 'Start', preco: 'R$ 49', fotos: '500', dias: '2' },
    { id: 'price_1UAyaMRwdoo1gIwbrstbMrBs', nome: 'Pro', preco: 'R$ 99', fotos: '2.000', dias: '7' },
    { id: 'price_1UAycQRwdoo1gIwbdiKOZRgI', nome: 'VIP', preco: 'R$ 149', fotos: '5.000', dias: '30' },
    { id: 'price_1UAyehRwdoo1gIwbfDGSzFSl', nome: 'VIP+', preco: 'R$ 199', fotos: '10.000', dias: '30' }
  ];

  // TRADUTOR DE PLANOS: Converte o ID da Stripe no nome bonito para a tela
  const nomesDosPlanos: Record<string, string> = {
    'plano-falso': 'Pendente',
    'price_1UAyWLRwdoo1gIwbBa6BWaRO': 'Start',
    'price_1UAyaMRwdoo1gIwbrstbMrBs': 'Pro',
    'price_1UAycQRwdoo1gIwbdiKOZRgI': 'VIP',
    'price_1UAyehRwdoo1gIwbfDGSzFSl': 'VIP+'
  };

  return (
    <div className="space-y-10 mt-8 mb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-8 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">Meus Eventos</h2>
          <p className="text-zinc-400 text-lg">Gerencie suas festas e controle seus telões ativos.</p>
        </div>
        <Link href="/dashboard/novo" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] gap-2">
          <span>+</span>
          Criar Novo Evento
        </Link>
      </div>

      {meusEventos.length === 0 ? (
        <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-16 text-center backdrop-blur-xl flex flex-col items-center">
          <div className="text-6xl mb-6 bg-white/5 w-24 h-24 flex items-center justify-center rounded-full border border-white/10 shadow-lg">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Nenhuma festa por aqui!</h3>
          <p className="text-zinc-400 max-w-md mx-auto mb-8 text-lg">
            Parece que você ainda não criou nenhum evento. Crie o seu primeiro evento e comece a recolher memórias inesquecíveis.
          </p>
          <Link href="/dashboard/novo" className="px-8 py-3 rounded-full bg-emerald-500 text-zinc-950 font-bold hover:bg-emerald-400 transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]">
            Criar Meu Primeiro Evento
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meusEventos.map((evento) => {
            const isPago = evento.statusPagamento === 'pago';
            const dataFormatada = new Date(evento.dataEvento).toLocaleDateString('pt-BR');
            // Pega o nome traduzido do nosso dicionário
            const nomePlanoExibido = nomesDosPlanos[evento.planoId] || 'Desconhecido';

            return (
              <div key={evento.id} className="group relative bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-white/20 transition-all hover:shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-bold text-white leading-tight tracking-tight line-clamp-2 pr-2">{evento.nomeEvento}</h3>
                    {isPago ? (
                      <span className="shrink-0 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">ATIVO</span>
                    ) : (
                      <span className="shrink-0 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-full border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">PENDENTE</span>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-zinc-300 bg-black/20 p-3 rounded-lg border border-white/5">
                      <span className="text-xl">📅</span>
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Data do Evento</span>
                        <span className="font-semibold text-white">{dataFormatada}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-zinc-300 bg-black/20 p-3 rounded-lg border border-white/5">
                      <span className="text-xl">✨</span>
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Plano Escolhido</span>
                        <span className="font-semibold text-white">{nomePlanoExibido}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mt-auto relative z-10">
                  {isPago ? (
                    <Link 
                      href={`/dashboard/evento/${evento.id}`} 
                      className="w-full flex items-center justify-center gap-2 bg-white text-black hover:bg-zinc-200 font-bold py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>Gerenciar Evento</span>
                      <span className="text-xl">→</span>
                    </Link>
                  ) : (
                    <div className="w-full bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                      <p className="text-sm text-zinc-400 mb-4 font-medium text-center">Ative seu evento para começar:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {planosDisponiveis.map((plano) => (
                          <form key={plano.id} action={pagarEvento} className="w-full">
                            <input type="hidden" name="eventoId" value={evento.id} />
                            <input type="hidden" name="priceId" value={plano.id} />
                            <button 
                              type="submit" 
                              className="w-full text-left p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all group flex flex-col relative overflow-hidden"
                            >
                              <div className="flex justify-between items-center w-full mb-1 relative z-10">
                                <span className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">{plano.nome}</span>
                                <span className="text-white font-bold text-base">{plano.preco}</span>
                              </div>
                              <span className="text-xs text-zinc-400 relative z-10">{plano.fotos} fotos • {plano.dias} dias</span>
                            </button>
                          </form>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    {/* A PROTEÇÃO: O botão de Editar só aparece se isPago for verdadeiro */}
                    {isPago && (
                      <Link
                        href={`/dashboard/evento/${evento.id}/editar`}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 py-2.5 rounded-xl text-sm font-medium transition-all"
                      >
                        <span className="text-lg">✏️</span>
                        Editar
                      </Link>
                    )}
                    {/* O formulário de exclusão ganha a classe w-full quando fica sozinho na linha */}
                    <form action={deletarEvento} className={!isPago ? "w-full" : "flex-1"}>
                      <input type="hidden" name="eventoId" value={evento.id} />
                      <div className="h-full">
                        <BotaoExcluir isPago={isPago} nomeEvento={evento.nomeEvento} />
                      </div>
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