import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos, planos } from '@/db/schema';
import { eq, count, and } from 'drizzle-orm';
import Link from 'next/link';
import QRCodeCard from './QRCodeCard';
import BotaoDownloadZip from './BotaoDownloadZip';
import { gerarUrlAssinada } from '@/lib/seguranca';

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
    : 'https://flashfest.lucasregesbarros.workers.dev';
  const urlCamera = `${baseUrl}/e/${id}`;

  return (
    <div className="space-y-8 mt-4">
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-zinc-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{evento.nomeEvento}</h2>
          <p className="text-zinc-400 mt-1">Data: {dataDoEvento.toLocaleDateString('pt-BR')}</p>
        </div>
        <Link href="/dashboard" className="px-5 py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition text-center">
          Voltar ao Painel
        </Link>
      </div>

      {/* BANNER DE EXPIRAÇÃO INTELIGENTE */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${estaExpirado ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
        <div className="flex items-center gap-4">
          <span className="text-3xl">{estaExpirado ? '⚠️' : '⏳'}</span>
          <div>
            <h3 className={`font-bold text-lg ${estaExpirado ? 'text-red-400' : 'text-amber-400'}`}>
              {estaExpirado ? 'Evento Expirado!' : 'Atenção ao Prazo de Download'}
            </h3>
            <p className="text-zinc-300 text-sm mt-1">
              {estaExpirado 
                ? 'O prazo para baixar as fotos terminou. O sistema fará a limpeza automática dos arquivos em breve.' 
                : `Você tem ${diasRestantes} dia(s) restante(s) após o evento para baixar o ZIP antes da exclusão automática das fotos.`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* QR CODE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-white mb-6">QR Code da Festa</h3>
          <QRCodeCard url={urlCamera} />
          <p className="text-sm text-zinc-500 mt-6 text-center leading-relaxed">
            Imprima este código e coloque nas mesas para os convidados escanearem e abrirem a câmera.
          </p>
        </div>

        {/* CONTROLES E BOTÕES */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Uso do Plano</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-bold text-emerald-400">{totalFotos}</span>
              <span className="text-zinc-400 mb-1 font-medium">/ {limiteFotos} fotos capturadas</span>
            </div>
            
            <div className="w-full bg-zinc-950 rounded-full h-4 mt-6 border border-zinc-800">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((totalFotos / limiteFotos) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href={`/e/${id}/telao`}
              target="_blank"
              className="flex flex-col items-center justify-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl p-8 transition group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📺</span>
              <span className="font-bold text-white text-lg">Abrir Telão</span>
              <span className="text-sm text-zinc-400 mt-1">Inicia o Slideshow</span>
            </Link>

            <Link
                href={`/dashboard/evento/${id}/moderacao`}
                className="flex flex-col items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl p-8 transition group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🛡️</span>
              <span className="font-bold text-white text-lg">Moderação</span>
              <span className="text-sm text-zinc-400 mt-1">Aprovar ou rejeitar</span>
            </Link>

            <BotaoDownloadZip fotosUrls={fotosUrls} nomeEvento={evento.nomeEvento} />
          </div>
        </div>
      </div>
    </div>
  );
}