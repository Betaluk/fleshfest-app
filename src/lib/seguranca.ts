// src/lib/seguranca.ts

// Gera uma URL do tipo: /api/fotos/arquivo.jpg?exp=123456&sig=abcdef
export async function gerarUrlAssinada(chaveArquivo: string, secret: string, horasExpiracao: number = 12) {
  // Define o tempo limite (em milissegundos)
  const exp = Date.now() + (horasExpiracao * 60 * 60 * 1000);
  const payload = `${chaveArquivo}:${exp}`;
  
  // Usa o motor de criptografia nativo da Web (zero dependências)
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', 
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, 
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  // Converte a assinatura binária para texto legível (Hexadecimal)
  const sigHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `/api/fotos/${chaveArquivo}?exp=${exp}&sig=${sigHex}`;
}

// O segurança da porta: verifica se a assinatura bate e se não expirou
export async function validarUrlAssinada(chaveArquivo: string, exp: string, sig: string, secret: string) {
  if (Date.now() > parseInt(exp)) return false; // Expirou!
  
  const payload = `${chaveArquivo}:${exp}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', 
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, 
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const expectedSigHex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  
  return sig === expectedSigHex; // Só deixa passar se a assinatura for idêntica
}