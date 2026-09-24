import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, and, desc, gte } from 'drizzle-orm';
import { planos } from '@/db/schema';
import { auth } from '@/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';
import BotaoExcluir from './BotaoExcluir'; // Importamos o nosso novo botão super inteligente!

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ erro?: string, sucesso?: string }> | { erro?: string, sucesso?: string } }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/');
  }

  const resolvedSearchParams = await searchParams;

  // Adicionamos qualquer tipo (any) ao BUCKET_FOTOS para garantir que o TypeScript aceita a limpeza
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
    env: Env & { STRIPE_SECRET_KEY: string, BUCKET_FOTOS: any } 
  };
  const db = getDb(env);

  const meusEventos = await db.select()
    .from(eventos)
    .where(eq(eventos.usuarioId, session.user.id))
    .orderBy(desc(eventos.dataEvento));

  // Verifica se o usuário tem um evento teste grátis ativo criado nas últimas 24h
  const agora = Date.now();
  const vinteQuatroHorasMs = 24 * 60 * 60 * 1000;

  const eventoGratisAtivo = meusEventos.find(
    (ev) => ev.planoId === 'plano-gratis' && (agora - new Date(ev.dataCriacao).getTime()) < vinteQuatroHorasMs
  );

  let tempoRestanteTexto = '';
  if (eventoGratisAtivo) {
    const tempoPassado = agora - new Date(eventoGratisAtivo.dataCriacao).getTime();
    const tempoRestanteMs = Math.max(0, vinteQuatroHorasMs - tempoPassado);
    const horas = Math.floor(tempoRestanteMs / (1000 * 60 * 60));
    const minutos = Math.floor((tempoRestanteMs % (1000 * 60 * 60)) / (1000 * 60));
    tempoRestanteTexto = horas > 0 ? `${horas}h ${minutos}min` : `${minutos}min`;
  }

  async function pagarEvento(formData: FormData) {
    'use server';
    const eventoId = formData.get('eventoId') as string;
    const priceId = formData.get('priceId') as string; // Agora recebemos o ID exato
    if (!eventoId || !priceId) return;

    const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
      env: Env & { STRIPE_SECRET_KEY: string, BUCKET_FOTOS: any } 
    };
    
    const dbServer = getDb(env);

    if (priceId === 'plano-gratis') {
      const sessionAction = await auth();
      if (!sessionAction?.user?.id) return;

      const userId = sessionAction.user.id;
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);

      const eventosGratis = await dbServer.select()
        .from(eventos)
        .where(
          and(
            eq(eventos.usuarioId, userId),
            eq(eventos.planoId, 'plano-gratis'),
            gte(eventos.dataCriacao, ontem)
          )
        );

      if (eventosGratis.length > 0) {
        redirect('/dashboard?erro=limite_gratis');
      }

      // Auto-limpeza de eventos grátis antigos (>24h) deste usuário para liberar espaço e não acumular
      const eventosGratisAntigos = await dbServer.select()
        .from(eventos)
        .where(
          and(
            eq(eventos.usuarioId, userId),
            eq(eventos.planoId, 'plano-gratis')
          )
        );

      for (const evAntigo of eventosGratisAntigos) {
        if (evAntigo.id !== eventoId) {
          const fotosDoEvento = await dbServer.select().from(fotos).where(eq(fotos.eventoId, evAntigo.id));
          for (const f of fotosDoEvento) {
            const chave = f.urlImagem.split('/').pop();
            if (chave) await env.BUCKET_FOTOS.delete(chave);
          }
          if (evAntigo.urlLogo) {
            const chaveLogo = evAntigo.urlLogo.split('/').pop();
            if (chaveLogo) await env.BUCKET_FOTOS.delete(chaveLogo);
          }
          await dbServer.delete(fotos).where(eq(fotos.eventoId, evAntigo.id));
          await dbServer.delete(eventos).where(eq(eventos.id, evAntigo.id));
        }
      }

      await dbServer.insert(planos).values({
        id: 'plano-gratis',
        nomePlano: 'Grátis',
        limiteFotos: 10,
        diasExpiracao: 1,
        preco: 0
      }).onConflictDoNothing();

      await dbServer.update(eventos)
        .set({
          statusPagamento: 'pago',
          planoId: 'plano-gratis'
        })
        .where(eq(eventos.id, eventoId));

      revalidatePath('/dashboard');
      redirect('/dashboard?sucesso=true');
    }

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
    { id: 'plano-gratis', nome: 'Grátis', preco: 'R$ 0', fotos: '10', dias: '1' },
    { id: 'price_1UAyWLRwdoo1gIwbBa6BWaRO', nome: 'Start', preco: 'R$ 49', fotos: '500', dias: '2' },
    { id: 'price_1UAyaMRwdoo1gIwbrstbMrBs', nome: 'Pro', preco: 'R$ 99', fotos: '2.000', dias: '7' },
    { id: 'price_1UAycQRwdoo1gIwbdiKOZRgI', nome: 'VIP', preco: 'R$ 149', fotos: '5.000', dias: '30' },
    { id: 'price_1UAyehRwdoo1gIwbfDGSzFSl', nome: 'VIP+', preco: 'R$ 199', fotos: '10.000', dias: '30' }
  ];

  // TRADUTOR DE PLANOS: Converte o ID da Stripe no nome bonito para a tela
  const nomesDosPlanos: Record<string, string> = {
    'plano-falso': 'Pendente',
    'plano-gratis': 'Grátis',
    'price_1UAyWLRwdoo1gIwbBa6BWaRO': 'Start',
    'price_1UAyaMRwdoo1gIwbrstbMrBs': 'Pro',
    'price_1UAycQRwdoo1gIwbdiKOZRgI': 'VIP',
    'price_1UAyehRwdoo1gIwbfDGSzFSl': 'VIP+'
  };

  return (
    <div className="space-y-10 mt-8 mb-12 animate-fade-in-up">
      {resolvedSearchParams.erro === 'limite_gratis' && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <span className="text-3xl bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">⏳</span>
            <div>
              <p className="font-bold text-white text-base">Limite de 1 Evento Grátis por 24 horas</p>
              <p className="text-zinc-300 text-sm mt-0.5">
                Você já possui um evento teste ativo{eventoGratisAtivo ? ` ("${eventoGratisAtivo.nomeEvento}")` : ''}.
                {tempoRestanteTexto && ` Um novo teste gratuito estará liberado em ${tempoRestanteTexto}.`}
              </p>
            </div>
          </div>
          <Link
            href="/#planos"
            className="shrink-0 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs rounded-xl transition shadow hover:scale-105"
          >
            Ver Planos Completos
          </Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10 pb-8 gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 font-[family-name:var(--font-jakarta)]">Meus Eventos</h2>
          <p className="text-zinc-400 text-sm sm:text-lg font-light">Gerencie suas festas e controle seus telões ativos.</p>
        </div>
        <Link href="/dashboard/novo" className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 rounded-full bg-white text-black font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.15)] gap-2 hover:bg-zinc-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]">
          <span className="text-lg">+</span>
          Criar Novo Evento
        </Link>
      </div>

      {meusEventos.length === 0 ? (
        <div className="bg-zinc-900/30 border border-white/10 rounded-2xl sm:rounded-[2rem] p-8 sm:p-16 text-center backdrop-blur-xl flex flex-col items-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
          <div className="text-5xl sm:text-6xl mb-6 sm:mb-8 bg-white/5 w-20 h-20 sm:w-28 sm:h-28 flex items-center justify-center rounded-full border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)] relative z-10">🎉</div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 tracking-tight font-[family-name:var(--font-jakarta)] relative z-10">Nenhuma festa por aqui!</h3>
          <p className="text-zinc-400 max-w-md mx-auto mb-8 sm:mb-10 text-base sm:text-lg font-light relative z-10">
            Parece que você ainda não criou nenhum evento. Crie o seu primeiro evento e comece a recolher memórias inesquecíveis.
          </p>
          <Link href="/dashboard/novo" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-zinc-950 font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] relative z-10 text-center">
            Criar Meu Primeiro Evento
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {meusEventos.map((evento) => {
            const isPago = evento.statusPagamento === 'pago';
            const dataFormatada = new Date(evento.dataEvento).toLocaleDateString('pt-BR');
            // Pega o nome traduzido do nosso dicionário
            const nomePlanoExibido = nomesDosPlanos[evento.planoId] || 'Desconhecido';

            return (
              <div key={evento.id} className="group relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                {isPago && (
                   <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] pointer-events-none rounded-full"></div>
                )}

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6 gap-4">
                    <h3 className="text-2xl font-bold text-white leading-tight tracking-tight line-clamp-2 pr-2 font-[family-name:var(--font-jakarta)]">{evento.nomeEvento}</h3>
                    {isPago ? (
                      <span className="shrink-0 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]">ATIVO</span>
                    ) : (
                      <span className="shrink-0 px-3 py-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">PENDENTE</span>
                    )}
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-4 text-zinc-300 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <span className="text-2xl drop-shadow-md">📅</span>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Data do Evento</span>
                        <span className="font-semibold text-white text-sm">{dataFormatada}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-300 bg-black/20 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <span className="text-2xl drop-shadow-md">✨</span>
                      <div className="flex flex-col">
                        <span className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-0.5">Plano Escolhido</span>
                        <span className="font-semibold text-white text-sm">{nomePlanoExibido}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 mt-auto relative z-10">
                  {isPago ? (
                    <Link 
                      href={`/dashboard/evento/${evento.id}`} 
                      className="w-full flex items-center justify-center gap-2 bg-white text-black font-bold py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-zinc-100"
                    >
                      <span>Gerenciar Evento</span>
                      <span className="text-lg">→</span>
                    </Link>
                  ) : (
                    <div className="w-full bg-black/40 p-5 rounded-2xl border border-white/10 backdrop-blur-md">
                      <p className="text-sm text-zinc-400 mb-4 font-medium text-center">Ative seu evento para começar:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {planosDisponiveis.map((plano) => {
                          const isGratisBloqueado = plano.id === 'plano-gratis' && !!eventoGratisAtivo;

                          return (
                            <form key={plano.id} action={pagarEvento} className="w-full">
                              <input type="hidden" name="eventoId" value={evento.id} />
                              <input type="hidden" name="priceId" value={plano.id} />
                              <button 
                                type="submit" 
                                disabled={isGratisBloqueado}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 group flex flex-col relative overflow-hidden ${
                                  isGratisBloqueado
                                    ? 'border-white/5 bg-white/[0.02] opacity-60 cursor-not-allowed'
                                    : 'border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 cursor-pointer'
                                }`}
                                title={isGratisBloqueado ? `Disponível em ${tempoRestanteTexto}` : undefined}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-1.5 w-full mb-1 relative z-10">
                                  <span className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors flex flex-wrap items-center gap-1.5">
                                    {plano.nome}
                                    {isGratisBloqueado && (
                                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-normal">
                                        ⏳ Cooldown ({tempoRestanteTexto})
                                      </span>
                                    )}
                                  </span>
                                  <span className="text-white font-bold text-sm shrink-0">{plano.preco}</span>
                                </div>
                                <span className="text-[11px] text-zinc-400 relative z-10 font-medium">{plano.fotos} fotos • {plano.dias} dias</span>
                              </button>
                            </form>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-5 border-t border-white/10">
                    {/* A PROTEÇÃO: O botão de Editar só aparece se isPago for verdadeiro */}
                    {isPago && (
                      <Link
                        href={`/dashboard/evento/${evento.id}/editar`}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 py-3 rounded-xl text-sm font-medium transition-all duration-300"
                      >
                        <span className="text-base">✏️</span>
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