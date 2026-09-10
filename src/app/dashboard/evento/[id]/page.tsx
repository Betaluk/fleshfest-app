import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos, planos } from '@/db/schema';
import { eq, count, and } from 'drizzle-orm';
import Link from 'next/link';
import QRCodeCard from './QRCodeCard';
import BotaoDownloadZip from './BotaoDownloadZip';
import { gerarUrlAssinada } from '@/lib/seguranca';
import BotaoBaixarPDF from './BotaoBaixarPDF';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function GerenciarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
    env: Env & { IMAGE_SECRET: string } 
  };
  const db = getDb(env);

  // 1. Busca o Evento
  const evento = await db.select().from(eventos).where(eq(eventos.id, id)).get();

  if (!evento) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-white mb-4">Evento não encontrado</h2>
        <Link href="/dashboard" className="text-emerald-400 hover:underline">Voltar para o painel</Link>
      </div>
    );
  }
  // A TRAVA DE SEGURANÇA: Se não estiver pago, manda de volta para a vitrine!
  if (evento.statusPagamento !== 'pago') {
    redirect('/dashboard');
  }

  // 2. Busca o Plano vinculado para saber o Limite de Fotos e os Dias de Expiração
  const plano = await db.select().from(planos).where(eq(planos.id, evento.planoId)).get();
  const limiteFotos = plano?.limiteFotos || 500;
  const diasExpiracao = plano?.diasExpiracao || 2;

  // 3. Contagem de Fotos e Geração das URLs Seguras para o ZIP
  const totalFotosResult = await db.select({ valor: count() }).from(fotos).where(eq(fotos.eventoId, id)).get();
  const totalFotos = totalFotosResult?.valor || 0;
  
  const fotosAprovadas = await db.select().from(fotos).where(and(eq(fotos.eventoId, id), eq(fotos.status, 'aprovada')));

  const fotosUrls = await Promise.all(
    fotosAprovadas.map(async (foto) => {
      const chaveFicheiro = foto.urlImagem.split('/').pop() || '';
      return await gerarUrlAssinada(chaveFicheiro, env.IMAGE_SECRET, 12);
    })
  );

  // 4. LÓGICA DO AVISO DE EXPIRAÇÃO
  const dataDoEvento = new Date(evento.dataEvento);
  const dataExpiracao = new Date(dataDoEvento);
  dataExpiracao.setDate(dataExpiracao.getDate() + diasExpiracao);

  const hoje = new Date();
  const msRestantes = dataExpiracao.getTime() - hoje.getTime();
  const diasRestantes = Math.ceil(msRestantes / (1000 * 60 * 60 * 24));
  
  const estaExpirado = diasRestantes < 0;

  // 5. Variáveis de Roteamento
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8787' 
    : 'https://flashfest.com.br';
  const urlCamera = `${baseUrl}/e/${id}`;

  return (
    <div className="space-y-10 mt-8 mb-12">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-8 gap-4">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">{evento.nomeEvento}</h2>
          <div className="flex items-center gap-2 text-zinc-400 mt-2">
            <span className="text-lg">📅</span>
            <span className="text-lg">{dataDoEvento.toLocaleDateString('pt-BR')}</span>
          </div>
        </div>
        <Link href="/dashboard" className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-full transition-all border border-white/10 hover:border-white/20 text-center flex items-center gap-2">
          <span>←</span>
          Voltar ao Painel
        </Link>
      </div>

      {/* BANNER DE EXPIRAÇÃO INTELIGENTE */}
      <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-lg backdrop-blur-sm ${estaExpirado ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
        <div className="flex items-start sm:items-center gap-5">
          <span className="text-4xl bg-black/20 p-3 rounded-xl border border-white/5 shadow-inner">{estaExpirado ? '⚠️' : '⏳'}</span>
          <div>
            <h3 className={`font-bold text-xl mb-1 ${estaExpirado ? 'text-red-400' : 'text-amber-400'}`}>
              {estaExpirado ? 'Evento Expirado!' : 'Atenção ao Prazo de Download'}
            </h3>
            <p className="text-zinc-300 text-base leading-relaxed">
              {estaExpirado 
                ? 'O prazo para baixar as fotos terminou. O sistema fará a limpeza automática dos arquivos em breve.' 
                : `Você tem ${diasRestantes} dia(s) restante(s) após o evento para baixar o ZIP antes da exclusão automática das fotos.`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* QR CODE - SIDEBAR */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center hover:border-white/20 transition-all hover:shadow-2xl">
            <div className="w-full flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white">QR Code da Festa</h3>
              <span className="bg-white/10 text-white text-xs px-3 py-1 rounded-full font-medium">Digitalize</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 mb-2">
              <QRCodeCard url={urlCamera} />
            </div>

            <p className="text-sm text-zinc-400 mt-6 text-center leading-relaxed">
              Imprima este código e coloque nas mesas para os convidados escanearem e abrirem a câmera no celular.
            </p>
            <div className="w-full border-t border-white/10 mt-8 pt-6">
              <BotaoBaixarPDF url={urlCamera} nomeEvento={evento.nomeEvento} />
            </div>
          </div>
        </div>

        {/* CONTROLES E BOTÕES - MAIN AREA */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STATS CARD */}
          <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all hover:shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <span className="text-9xl">📸</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-6 relative z-10">Uso do Plano</h3>
            <div className="flex items-baseline gap-3 mb-4 relative z-10">
              <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{totalFotos}</span>
              <span className="text-zinc-400 text-lg font-medium">/ {limiteFotos} fotos capturadas</span>
            </div>
            
            <div className="w-full bg-black/40 rounded-full h-5 mt-8 border border-white/5 relative z-10 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-1000 relative"
                style={{ width: `${Math.min((totalFotos / limiteFotos) * 100, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-3 text-right">
              {Math.round((totalFotos / limiteFotos) * 100)}% da capacidade atingida
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* BOTÃO DO TELÃO */}
            <Link
              href={estaExpirado ? '#' : `/e/${id}/telao`}
              target={estaExpirado ? '_self' : '_blank'}
              className={`flex flex-col items-center justify-center border border-white/10 rounded-3xl p-10 transition-all group hover:shadow-2xl relative overflow-hidden ${
                estaExpirado 
                  ? 'bg-zinc-900/30 opacity-50 pointer-events-none cursor-not-allowed'
                  : 'bg-zinc-900/60 hover:bg-zinc-800 hover:border-emerald-500/50'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-6xl mb-4 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 relative z-10 filter drop-shadow-lg">📺</span>
              <span className="font-bold text-white text-xl relative z-10">Abrir Telão</span>
              <span className="text-sm text-zinc-400 mt-2 relative z-10">Inicia o Slideshow</span>
            </Link>

            {/* BOTÃO DE MODERAÇÃO */}
            <Link
              href={estaExpirado ? '#' : `/dashboard/evento/${id}/moderacao`}
              className={`flex flex-col items-center justify-center border border-white/10 rounded-3xl p-10 transition-all group hover:shadow-2xl relative overflow-hidden ${
                estaExpirado 
                  ? 'bg-zinc-900/30 opacity-50 pointer-events-none cursor-not-allowed'
                  : 'bg-zinc-900/60 hover:bg-zinc-800 hover:border-amber-500/50'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-6xl mb-4 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 relative z-10 filter drop-shadow-lg">🛡️</span>
              <span className="font-bold text-white text-xl relative z-10">Moderação</span>
              <span className="text-sm text-zinc-400 mt-2 relative z-10">Aprovar ou rejeitar</span>
            </Link>

            {/* CARTÃO DA GALERIA PÚBLICA */}
            <div className="sm:col-span-2 bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-white/20 transition-all hover:shadow-xl group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-3xl group-hover:scale-110 transition-transform shadow-inner">🔗</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Galeria Pública</h3>
                  <p className="text-base text-zinc-400">
                    O link oficial para os convidados verem as fotos no dia seguinte.
                  </p>
                </div>
              </div>
              <Link 
                href={`/g/${evento.id}`} 
                target="_blank"
                className="shrink-0 px-8 py-4 bg-white text-black font-bold rounded-xl transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center gap-2"
              >
                Abrir Galeria
                <span>→</span>
              </Link>
            </div>

            {/* BOTÃO DE DOWNLOAD (Já contém a lógica de bloqueio interno) */}
            <div className="sm:col-span-2">
               <BotaoDownloadZip fotosUrls={fotosUrls} nomeEvento={evento.nomeEvento} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}