import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { Env } from '@/db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // Pega o caminho passado na URL e junta tudo (ex: teste123/arquivo.png)
  const { path } = await params;
  const caminhoDoArquivo = path.join('/');

  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };

  // Busca o arquivo seguro direto do Cloudflare R2
  const arquivo = await env.BUCKET_FOTOS.get(caminhoDoArquivo);

  if (!arquivo) {
    return new NextResponse('Imagem não encontrada no R2', { status: 404 });
  }

  // Prepara os cabeçalhos para o navegador entender que é uma imagem
  const headers = new Headers();
  arquivo.writeHttpMetadata(headers as any);
  headers.set('etag', arquivo.httpEtag);
  
  if (!headers.has('content-type')) {
    headers.set('content-type', 'image/jpeg');
  }

  // Devolve a imagem descompactada para a tela
  return new NextResponse(arquivo.body as any, { headers });
}