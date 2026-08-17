import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { fotos } from '@/db/schema';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const foto = formData.get('foto') as File;
    const eventoId = formData.get('eventoId') as string;

    if (!foto || !eventoId) {
      return NextResponse.json({ erro: 'Dados incompletos. Faltou a foto ou o ID.' }, { status: 400 });
    }

    const { env } = getCloudflareContext() as unknown as { env: Env };
    const db = getDb(env);

    const arrayBuffer = await foto.arrayBuffer();
    const nomeArquivoUnico = `${eventoId}/${Date.now()}-${foto.name.replace(/\s+/g, '_')}`;

    // 1. Salva no R2
    await env.BUCKET_FOTOS.put(nomeArquivoUnico, arrayBuffer, {
      httpMetadata: { contentType: foto.type },
    });

    const urlImagem = `https://fotos.flashfest.com/${nomeArquivoUnico}`;

    // 2. Salva no D1
    const fotoId = crypto.randomUUID();
    
    await db.insert(fotos).values({
      id: fotoId,
      eventoId: eventoId,
      urlImagem: urlImagem,
      status: 'aprovada',
      dataCaptura: new Date(),
    });

    console.log(`[SUCESSO] Foto gravada no R2 e registrada no D1 com ID: ${fotoId}`);

    return NextResponse.json({ 
      sucesso: true, 
      mensagem: 'Foto salva e registrada permanentemente com sucesso!' 
    });

  } catch (error) {
    console.error('Erro catastrófico no Upload:', error);
    return NextResponse.json({ erro: 'Erro interno ao processar e salvar a foto' }, { status: 500 });
  }
}