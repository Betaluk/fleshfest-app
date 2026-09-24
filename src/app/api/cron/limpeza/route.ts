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

    // Mapeamento do Cloudflare R2 sincronizado com wrangler.jsonc (BUCKET_FOTOS)
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
      env: Env & { CRON_SECRET: string, BUCKET_FOTOS: any } 
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
    const logosParaApagar: string[] = [];

    for (const ev of todosEventos) {
      if (ev.id === idDemo) continue; // Pula a Demo (ela é imortal)
      
      const diasExp = ev.planoId === 'plano-gratis' ? 1 : (mapaPlanos.get(ev.planoId) || 2);
      let dataLimite: Date;

      // Para eventos gratuitos de teste: expiração estrita de 24h a partir da data de criação
      if (ev.planoId === 'plano-gratis') {
        const dataBase = ev.dataCriacao ? new Date(ev.dataCriacao) : new Date(ev.dataEvento);
        dataLimite = new Date(dataBase.getTime() + (24 * 60 * 60 * 1000));
      } else {
        // Para eventos pagos: prazo conta a partir da data da festa
        dataLimite = new Date(ev.dataEvento);
        dataLimite.setDate(dataLimite.getDate() + diasExp);
      }

      if (hoje > dataLimite) {
        eventosExpiradosIds.push(ev.id);
        if (ev.urlLogo) {
          const chaveLogo = ev.urlLogo.split('/').pop();
          if (chaveLogo) logosParaApagar.push(chaveLogo);
        }
      }
    }

    let fotosExpiradas: any[] = [];
    if (eventosExpiradosIds.length > 0) {
      fotosExpiradas = await db.select().from(fotos).where(inArray(fotos.eventoId, eventosExpiradosIds));
    }

    // Junta todas as fotos condenadas (Demo + Expiradas)
    const todasAsFotosParaApagar = [...fotosDemo, ...fotosExpiradas];

    // 4. A FAXINA FÍSICA NO BUCKET R2
    let fotosApagadasR2 = 0;
    for (const foto of todasAsFotosParaApagar) {
      const nomeArquivo = foto.urlImagem.split('/').pop();
      if (nomeArquivo) {
        await env.BUCKET_FOTOS.delete(nomeArquivo); 
        fotosApagadasR2++;
      }
    }

    let logosApagadasR2 = 0;
    for (const chaveLogo of logosParaApagar) {
      await env.BUCKET_FOTOS.delete(chaveLogo);
      logosApagadasR2++;
    }

    // 5. A FAXINA NO BANCO DE DADOS (D1)
    // 5.1 Apagamos as fotos em lotes de 50 para não sobrecarregar o D1
    let fotosApagadasD1 = 0;
    if (todasAsFotosParaApagar.length > 0) {
      const idsParaApagar = todasAsFotosParaApagar.map(f => f.id);
      
      for (let i = 0; i < idsParaApagar.length; i += 50) {
        const chunk = idsParaApagar.slice(i, i + 50);
        await db.delete(fotos).where(inArray(fotos.id, chunk));
        fotosApagadasD1 += chunk.length;
      }
    }

    // 5.2 Apagamos os registros dos eventos expirados (A Demo nunca é apagada)
    let eventosApagadosD1 = 0;
    if (eventosExpiradosIds.length > 0) {
      for (let i = 0; i < eventosExpiradosIds.length; i += 50) {
        const chunk = eventosExpiradosIds.slice(i, i + 50);
        await db.delete(eventos).where(inArray(eventos.id, chunk));
        eventosApagadosD1 += chunk.length;
      }
    }

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: `Faxina concluída! ${fotosApagadasR2} fotos e ${logosApagadasR2} logos removidas do R2. ${eventosApagadosD1} eventos expirados removidos do banco.`,
      fotosRemovidas: fotosApagadasR2,
      logosRemovidas: logosApagadasR2,
      eventosExpirados: eventosApagadosD1
    }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no robô de limpeza:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}