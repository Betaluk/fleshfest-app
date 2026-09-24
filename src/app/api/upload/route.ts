import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos, fotos, planos } from '@/db/schema';
import { eq, count } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// --- RATE LIMITING (Anti-Spam em Memória) ---
const rateLimitMap = new Map<string, { quantidade: number; ultimoEnvio: number }>();
const JANELA_TEMPO_MS = 60 * 1000; // 1 minuto
const LIMITE_POR_MINUTO = 10; // Máximo de 10 envios por minuto por IP

export async function POST(request: Request) {
  try {
    // 1. VERIFICAÇÃO DE RATE LIMITING (Anti-Spam)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipConvidado = (forwardedFor ? forwardedFor.split(',')[0].trim() : null) ||
                        request.headers.get('x-real-ip') || 
                        request.headers.get('cf-connecting-ip') || 
                        'ip-desconhecido';

    const agora = Date.now();
    const historicoIp = rateLimitMap.get(ipConvidado) || { quantidade: 0, ultimoEnvio: agora };

    if (agora - historicoIp.ultimoEnvio > JANELA_TEMPO_MS) {
      historicoIp.quantidade = 1;
      historicoIp.ultimoEnvio = agora;
    } else {
      historicoIp.quantidade++;
      if (historicoIp.quantidade > LIMITE_POR_MINUTO) {
        console.warn(`[ANTI-SPAM] IP bloqueado temporariamente: ${ipConvidado}`);
        return NextResponse.json(
          { erro: 'Você está enviando mídia rápido demais. Aguarde um minuto e tente novamente.' },
          { status: 429 }
        );
      }
    }
    rateLimitMap.set(ipConvidado, historicoIp);

    // 2. PROCESSAMENTO DO FORMULÁRIO (Agora Híbrido)
    const formData = await request.formData();
    const arquivo = formData.get('foto') as File; // Mantemos a chave 'foto' para retrocompatibilidade
    const eventoId = formData.get('eventoId') as string;
    const mensagemForm = formData.get('mensagem') as string | null;
    
    // --- LÊ A NOVA FLAG DE MÍDIA ---
    const tipoMedia = formData.get('tipoMedia') as string || 'imagem'; 

    if (!arquivo || !eventoId) {
      return NextResponse.json({ erro: 'Dados incompletos' }, { status: 400 });
    }

    // Trava de segurança backend adaptável: 25MB para Vídeos, 5MB para Imagens
    const tamanhoMaximo = tipoMedia === 'video' ? 25 * 1024 * 1024 : 5 * 1024 * 1024;
    if (arquivo.size > tamanhoMaximo) {
      return NextResponse.json({ erro: 'O arquivo excedeu o limite máximo permitido.' }, { status: 400 });
    }

    // 3. CONEXÃO COM O BANCO DE DADOS
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env & { BUCKET_FOTOS: any } };
    const db = getDb(env);

    const evento = await db.select().from(eventos).where(eq(eventos.id, eventoId)).get();
    
    if (!evento) {
      return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    }

    const isDemo = evento.id === 'e0f9535f-d7b3-465d-8b61-b3fb70722656';

    // Bloqueio de Upload Expirado
    const dataLimite = new Date(evento.dataEvento);
    dataLimite.setDate(dataLimite.getDate() + 2); // Regra de 48h
    const hoje = new Date();

    if (hoje > dataLimite && !isDemo) {
      return NextResponse.json(
        { error: 'Este evento já foi encerrado e não aceita mais mídias.' },
        { status: 403 }
      );
    }
    
    if (evento.statusPagamento !== 'pago') {
      return NextResponse.json({ erro: 'Evento inválido ou inativo.' }, { status: 403 });
    }

    // 4. TRAVA DO LIMITE DE FOTOS DO PLANO (Dinâmico conforme o plano contratado)
    const plano = await db.select().from(planos).where(eq(planos.id, evento.planoId)).get();
    const limiteFotosDoPlano = plano?.limiteFotos ?? 500;
    
    const contagemResult = await db.select({ valor: count() }).from(fotos).where(eq(fotos.eventoId, eventoId)).get();
    const totalFotosAtuais = contagemResult?.valor || 0;

    if (totalFotosAtuais >= limiteFotosDoPlano) {
      return NextResponse.json(
        { erro: 'O limite máximo de lembranças desta festa já foi atingido!' },
        { status: 403 }
      );
    }

    // 5. UPLOAD PARA A CLOUDFLARE R2
    let extensao = arquivo.name.split('.').pop() || 'jpg';
    if (tipoMedia === 'video' && (!extensao || extensao.length > 4)) extensao = 'mp4'; // Fallback de segurança
    
    const nomeFicheiroUnico = `${eventoId}_${Date.now()}-${crypto.randomUUID()}.${extensao}`;
    const arrayBuffer = await arquivo.arrayBuffer();

    await env.BUCKET_FOTOS.put(nomeFicheiroUnico, arrayBuffer, {
      httpMetadata: { contentType: arquivo.type },
    });

    const urlSeguraAcesso = process.env.NODE_ENV === 'development' 
      ? `http://localhost:8787/api/fotos/${nomeFicheiroUnico}`
      : `https://galeria.flashfest.com.br/${nomeFicheiroUnico}`; 

    // 6. SALVA O REGISTRO NO D1
    const statusInicial = evento.modoModeracao === 'auto' ? 'aprovada' : 'pendente';

    await db.insert(fotos).values({
      id: crypto.randomUUID(),
      eventoId: eventoId,
      urlImagem: urlSeguraAcesso,
      mensagem: mensagemForm,
      tipoMedia: tipoMedia, // <--- SALVANDO O FORMATO NO BANCO AQUI!
      status: statusInicial,
      dataCaptura: new Date()
    });

    return NextResponse.json({ mensagem: 'Mídia enviada com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ erro: 'Erro interno no servidor' }, { status: 500 });
  }
}