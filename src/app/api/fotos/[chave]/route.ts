import { getCloudflareContext } from '@opennextjs/cloudflare';
import { validarUrlAssinada } from '@/lib/seguranca';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chave: string }> }
) {
  const { chave } = await params;
  
  // Extrai a data de expiração e a assinatura da URL
  const { searchParams } = new URL(request.url);
  const exp = searchParams.get('exp');
  const sig = searchParams.get('sig');

  if (!exp || !sig) {
    return new Response('Acesso negado: Assinatura ausente', { status: 403 });
  }

  // Acessa as variáveis de ambiente da Cloudflare (Balde R2 e o nosso Segredo)
  // Usamos "any" no BUCKET_FOTOS provisoriamente para facilitar a integração
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
    env: { BUCKET_FOTOS: any, IMAGE_SECRET: string } 
  };

  // Chama o nosso segurança
  const isValido = await validarUrlAssinada(chave, exp, sig, env.IMAGE_SECRET);
  if (!isValido) {
    return new Response('Acesso negado: Assinatura inválida ou expirada', { status: 403 });
  }

  try {
    // Busca a foto no balde R2
    const objetoFicheiro = await env.BUCKET_FOTOS.get(chave);

    if (!objetoFicheiro) {
      return new Response('Foto não encontrada', { status: 404 });
    }

    // Prepara os cabeçalhos para o navegador exibir a imagem corretamente
    const headers = new Headers();
    objetoFicheiro.writeHttpMetadata(headers);
    headers.set('etag', objetoFicheiro.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000'); // Cache otimizado

    return new Response(objetoFicheiro.body, { headers });
  } catch (error) {
    console.error("Erro ao buscar foto no R2:", error);
    return new Response("Erro interno", { status: 500 });
  }
}