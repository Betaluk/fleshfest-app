import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import Link from 'next/link';
import QRCodeCard from './QRCodeCard';

// Garante que a página carregue dados atualizados do banco toda vez
export const dynamic = 'force-dynamic';

export default async function GerenciarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Desempacota o ID da URL (Padrão do Next.js 15)
  const { id } = await params;

  // Conecta ao Banco D1
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
  const db = getDb(env);

  // Busca os dados do evento específico
  const evento = await db.select().from(eventos).where(eq(eventos.id, id)).get();

  if (!evento) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-white mb-4">Evento não encontrado</h2>
        <Link href="/dashboard" className="text-emerald-400 hover:underline">Voltar para o painel</Link>
      </div>
    );
  }

  // Faz a contagem de quantas fotos já foram tiradas neste evento
  const totalFotosResult = await db.select({ valor: count() }).from(fotos).where(eq(fotos.eventoId, id)).get();
  const totalFotos = totalFotosResult?.valor || 0;
  
  // Limite fixo simulando o plano escolhido
  const limiteFotos = 500; 

  // URL pública da câmera (usaremos localhost para o teste local)
  const urlCamera = `http://localhost:8787/e/${id}`;

  return (
    <div className="space-y-8 mt-4">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-zinc-800 pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{evento.nomeEvento}</h2>
          <p className="text-zinc-400 mt-1">Data: {new Date(evento.dataEvento).toLocaleDateString('pt-BR')}</p>
        </div>
        <Link href="/dashboard" className="px-5 py-2 bg-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-700 transition text-center">
          Voltar ao Painel
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Coluna 1: O QR Code */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold text-white mb-6">QR Code da Festa</h3>
          <QRCodeCard url={urlCamera} />
          <p className="text-sm text-zinc-500 mt-6 text-center leading-relaxed">
            Imprima este código e coloque nas mesas para os convidados escanearem e abrirem a câmera.
          </p>
        </div>

        {/* Coluna 2 e 3: Indicadores e Atalhos */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Indicador de Uso do Banco de Dados */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Uso do Plano</h3>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-5xl font-bold text-emerald-400">{totalFotos}</span>
              <span className="text-zinc-400 mb-1 font-medium">/ {limiteFotos} fotos capturadas</span>
            </div>
            
            {/* Barra de progresso visual */}
            <div className="w-full bg-zinc-950 rounded-full h-4 mt-6 border border-zinc-800">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min((totalFotos / limiteFotos) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Botões de Ação (Atalhos) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={`/e/${id}/telao`}
              target="_blank"
              className="flex flex-col items-center justify-center bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl p-8 transition group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📺</span>
              <span className="font-bold text-white text-lg">Abrir Telão</span>
              <span className="text-sm text-zinc-400 mt-1">Inicia o Slideshow animado</span>
            </Link>

            <Link
                href={`/dashboard/evento/${id}/moderacao`}
                className="flex flex-col items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl p-8 transition group"
            >
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">🛡️</span>
            <span className="font-bold text-white text-lg">Moderação</span>
            <span className="text-sm text-zinc-400 mt-1">Aprovar ou rejeitar fotos</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}