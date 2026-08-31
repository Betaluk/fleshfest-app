import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import CameraClient from './CameraClient'; // Importa a câmera que criamos no Passo 1

export const dynamic = 'force-dynamic';

export default async function PageConvidadoWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Conecta ao banco de dados na nuvem
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
  const db = getDb(env);

  const evento = await db.select().from(eventos).where(eq(eventos.id, id)).get();

  if (!evento) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white">
        <h1 className="text-2xl font-bold mb-2">Evento não encontrado</h1>
      </div>
    );
  }
  // --- NOVA LÓGICA: Bloqueio de Evento Expirado ---
  const dataLimite = new Date(evento.dataEvento);
  dataLimite.setDate(dataLimite.getDate() + 2); // Soma 2 dias (48h) à data da festa
  const hoje = new Date();

  if (hoje > dataLimite) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Evento Encerrado</h1>
        <p className="text-zinc-400 max-w-md">
          A captação de fotos para este evento já foi finalizada pelo sistema. Obrigado por participar!
        </p>
      </div>
    );
  }
  // ------------------------------------------------

  // --- O SEGURANÇA NA PORTA (TIME-GATE) ---
  const dataHoje = new Date();
  const dataFesta = new Date(evento.dataEvento);
  
  // Zeramos as horas para comparar apenas os dias exatos
  dataHoje.setHours(0, 0, 0, 0);
  dataFesta.setHours(0, 0, 0, 0);

  // Se a data de hoje for MENOR que a data da festa, mostra a tela de bloqueio
  if (dataHoje < dataFesta) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="text-6xl mb-6">⏳</div>
        <h1 className="text-2xl font-bold text-white mb-2">A festa ainda não começou!</h1>
        <p className="text-zinc-400 max-w-sm">
          Guarde a sua energia! A captura de fotos para <strong>{evento.nomeEvento}</strong> só será liberada no dia {dataFesta.toLocaleDateString('pt-BR')}.
        </p>
      </div>
    );
  }
  // ----------------------------------------

  // Se a data for igual ou maior, liberamos o componente da câmera!
  return <CameraClient id={id} nomeEvento={evento.nomeEvento} />;
}