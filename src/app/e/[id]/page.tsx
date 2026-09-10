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
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center text-white bg-gradient-to-br from-zinc-950 to-black">
        <h1 className="text-3xl font-extrabold mb-2 tracking-tight">Evento não encontrado</h1>
        <p className="text-zinc-500">Verifique o link e tente novamente.</p>
      </div>
    );
  }
  const isDemo = evento.id === 'e0f9535f-d7b3-465d-8b61-b3fb70722656';
  // --- NOVA LÓGICA: Bloqueio de Evento Expirado ---
  const dataLimite = new Date(evento.dataEvento);
  dataLimite.setDate(dataLimite.getDate() + 2); // Soma 2 dias (48h) à data da festa
  const hoje = new Date();

  if (hoje > dataLimite && !isDemo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center bg-[url('/bg-noise.png')] bg-repeat relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-zinc-950/80 to-transparent"></div>
        <div className="relative z-10 p-10 backdrop-blur-md bg-black/40 border border-white/10 rounded-3xl max-w-lg shadow-2xl flex flex-col items-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-inner">
            <span className="text-5xl filter drop-shadow-lg">🔒</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Evento Encerrado</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            A captação de fotos para este evento já foi finalizada. Obrigado por participar e compartilhar momentos inesquecíveis!
          </p>
        </div>
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
  if (dataHoje < dataFesta && !isDemo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950/0 to-transparent opacity-50"></div>
        <div className="relative z-10 p-10 backdrop-blur-xl bg-black/40 border border-white/10 rounded-3xl max-w-lg shadow-2xl flex flex-col items-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-inner animate-pulse">
            <span className="text-5xl filter drop-shadow-lg">⏳</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">A festa ainda não começou!</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Guarde a sua energia! A captura de fotos para <strong className="text-white">{evento.nomeEvento}</strong> só será liberada no dia <span className="text-emerald-400 font-semibold">{dataFesta.toLocaleDateString('pt-BR')}</span>.
          </p>
        </div>
      </div>
    );
  }
  // ----------------------------------------

  // Se a data for igual ou maior, liberamos o componente da câmera!
  return <CameraClient id={id} nomeEvento={evento.nomeEvento} />;
}