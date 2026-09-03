import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos, planos } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const secret = url.searchParams.get('secret');

    // Mapeamento do Cloudflare (Substitua BUCKET pelo nome exato que está no seu painel, caso seja diferente)
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
      env: Env & { CRON_SECRET: string, BUCKET: any } 
    };

    // 1. SEGURANÇA: Verifica o crachá
    if (secret !== env.CRON_SECRET) {
      return NextResponse.json({ error: 'Acesso negado ao Robô de Limpeza' }, { status: 401 });
    }

    const db = getDb(env);
    const hoje = new Date();
    
    // ATENÇÃO: Cole o ID do seu Evento Demo aqui!
    const idDemo = 'e0f9535f-d7b3-465d-8b61-b3fb70722656'; 

    // 2. MISSÃO 1: ZERAR A DEMO
    const fotosDemo = await db.select().from(fotos).where(eq(fotos.eventoId, idDemo));

    // 3. MISSÃO 2: VARRER EVENTOS REAIS EXPIRADOS
    const todosEventos = await db.select().from(eventos);
    const todosPlanos = await db.select().from(planos);
    
    // Cria um dicionário rápido para saber quantos dias cada plano dá de limite
    const mapaPlanos = new Map(todosPlanos.map(p => [p.id, p.diasExpiracao]));
    const eventosExpiradosIds: string[] = [];

    for (const ev of todosEventos) {
      if (ev.id === idDemo) continue; // Pula a Demo (ela é imortal)
      
      const diasExp = mapaPlanos.get(ev.planoId) || 2;
      const dataLimite = new Date(ev.dataEvento);
      dataLimite.setDate(dataLimite.getDate() + diasExp);

      if (hoje > dataLimite) {
        eventosExpiradosIds.push(ev.id);
      }
    }

    let fotosExpiradas: any[] = [];
    if (eventosExpiradosIds.length > 0) {
      fotosExpiradas = await db.select().from(fotos).where(inArray(fotos.eventoId, eventosExpiradosIds));
    }

    // Junta todas as fotos condenadas (Demo + Expiradas)
    const todasAsFotosParaApagar = [...fotosDemo, ...fotosExpiradas];

    // 4. A FAXINA FÍSICA NO BUCKET R2
    let apagadasR2 = 0;
    for (const foto of todasAsFotosParaApagar) {
      const nomeArquivo = foto.urlImagem.split('/').pop();
      if (nomeArquivo) {
        await env.BUCKET.delete(nomeArquivo); 
        apagadasR2++;
      }
    }

    // 5. A FAXINA NO BANCO DE DADOS (D1)
    let apagadasD1 = 0;
    if (todasAsFotosParaApagar.length > 0) {
      const idsParaApagar = todasAsFotosParaApagar.map(f => f.id);
      
      // Apagamos em lotes de 50 para não sobrecarregar o D1
      for (let i = 0; i < idsParaApagar.length; i += 50) {
        const chunk = idsParaApagar.slice(i, i + 50);
        await db.delete(fotos).where(inArray(fotos.id, chunk));
        apagadasD1 += chunk.length;
      }
    }

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: `Faxina concluída! ${apagadasR2} fotos removidas fisicamente.`,
      eventosExpirados: eventosExpiradosIds.length
    }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no robô de limpeza:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}