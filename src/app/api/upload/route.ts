import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// --- RATE LIMITING (Anti-Spam em Memória) ---
// Como a Cloudflare Edge é extremamente rápida, usamos um Map na memória do Worker
// para rastrear quantos envios cada IP fez recentemente.
const rateLimitMap = new Map<string, { quantidade: number; ultimoEnvio: number }>();
const JANELA_TEMPO_MS = 60 * 1000; // 1 minuto
const LIMITE_POR_MINUTO = 10; // Máximo de 10 fotos por minuto por IP

export async function POST(request: Request) {
  try {
    // 1. VERIFICAÇÃO DE RATE LIMITING (Anti-Spam)
    // A Cloudflare injeta o IP real do usuário neste cabeçalho
    const ipConvidado = request.headers.get('cf-connecting-ip') || 'ip-desconhecido';
    const agora = Date.now();
    
    const historicoIp = rateLimitMap.get(ipConvidado) || { quantidade: 0, ultimoEnvio: agora };

    // Se já passou 1 minuto desde o último envio contabilizado, zera a contagem
    if (agora - historicoIp.ultimoEnvio > JANELA_TEMPO_MS) {
      historicoIp.quantidade = 1;
      historicoIp.ultimoEnvio = agora;
    } else {
      historicoIp.quantidade++;
      if (historicoIp.quantidade > LIMITE_POR_MINUTO) {
        console.warn(`[ANTI-SPAM] IP bloqueado temporariamente: ${ipConvidado}`);
        return Response.json(
          { erro: 'Você está enviando fotos rápido demais. Aguarde um minuto e tente novamente.' },
          { status: 429 }
        );
      }
    }
    rateLimitMap.set(ipConvidado, historicoIp);


    // 2. PROCESSAMENTO DO FORMULÁRIO
    const formData = await request.formData();
    const arquivo = formData.get('foto') as File;
    const eventoId = formData.get('eventoId') as string;

    if (!arquivo || !eventoId) {
      return Response.json({ erro: 'Dados incompletos' }, { status: 400 });
    }

    // 3. CONEXÃO COM O BANCO DE DADOS
    // Usamos "any" provisoriamente no BUCKET_FOTOS para evitar erros de tipagem
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env & { BUCKET_FOTOS: any } };
    const db = getDb(env);

    // Verifica se o evento existe e está ativo
    const evento = await db.select().from(eventos).where(eq(eventos.id, eventoId)).get();
    // --- NOVA LÓGICA: Bloqueio de Upload Expirado ---
    // 1. Garante ao TypeScript que o evento existe
    if (!evento) {
      return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    }

    const isDemo = evento.id === 'e0f9535f-d7b3-465d-8b61-b3fb70722656';

    // 2. NOVA LÓGICA: Bloqueio de Upload Expirado
    const dataLimite = new Date(evento.dataEvento);
    dataLimite.setDate(dataLimite.getDate() + 2); // Regra de 48h
    const hoje = new Date();

    if (hoje > dataLimite && !isDemo) {
      return NextResponse.json(
        { error: 'Este evento já foi encerrado e não aceita mais fotos.' },
        { status: 403 }
      );
    }
    
    if (!evento || evento.statusPagamento !== 'pago') {
      return Response.json({ erro: 'Evento inválido ou inativo.' }, { status: 403 });
    }


    // 4. TRAVA DO LIMITE DE FOTOS DO PLANO (Regra de Negócio)
    const limiteFotosDoPlano = 500; // Como estamos usando o "plano-falso", o limite fixo é 500
    
    const contagemResult = await db.select({ valor: count() }).from(fotos).where(eq(fotos.eventoId, eventoId)).get();
    const totalFotosAtuais = contagemResult?.valor || 0;

    if (totalFotosAtuais >= limiteFotosDoPlano) {
      return Response.json(
        { erro: 'O limite máximo de fotos desta festa já foi atingido! Nenhuma foto a mais pode ser enviada.' },
        { status: 403 }
      );
    }


    // 5. UPLOAD PARA A CLOUDFLARE R2
    // Gera um nome único para o arquivo
    const extensao = arquivo.name.split('.').pop() || 'jpg';
    const nomeFicheiroUnico = `${eventoId}_${Date.now()}-${crypto.randomUUID()}.${extensao}`;
    const arrayBuffer = await arquivo.arrayBuffer();

    await env.BUCKET_FOTOS.put(nomeFicheiroUnico, arrayBuffer, {
      httpMetadata: { contentType: arquivo.type },
    });

    // Como bloqueamos o balde público, a URL que salvamos no banco agora é a nossa Rota Segura local!
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8787' : 'https://flashfest.com.br';
    const urlSeguraAcesso = `${baseUrl}/api/fotos/${nomeFicheiroUnico}`;

    // 6. SALVA O REGISTRO NO D1
    // Se o evento estiver configurado como 'auto', a foto já nasce 'aprovada'
    const statusInicial = evento.modoModeracao === 'auto' ? 'aprovada' : 'pendente';

    await db.insert(fotos).values({
      id: crypto.randomUUID(),
      eventoId: eventoId,
      urlImagem: urlSeguraAcesso,
      status: statusInicial,
      dataCaptura: new Date()
    });

    return Response.json({ mensagem: 'Foto enviada com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error("Erro no upload:", error);
    return Response.json({ erro: 'Erro interno no servidor' }, { status: 500 });
  }
}