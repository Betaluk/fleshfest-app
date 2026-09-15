const fs = require('fs');

let content = fs.readFileSync('src/app/e/[id]/telao/page.tsx', 'utf8');

const toReplace = `  const fotosTratadas = await Promise.all(fotosAprovadas.map(async (foto) => {
    const chaveFicheiro = foto.urlImagem.split('/').pop() || '';
    // Assina a URL para durar 12 horas
    const urlSegura = await gerarUrlAssinada(chaveFicheiro, env.IMAGE_SECRET, 12);`;

const replacement = `  const fotosTratadas = await Promise.all(fotosAprovadas.map(async (foto) => {
    const chaveFicheiro = foto.urlImagem.split('/').pop() || '';
    // Assina a URL para durar 12 horas
    const secret = env.IMAGE_SECRET || 'dummy-secret-for-dev';
    const urlSegura = await gerarUrlAssinada(chaveFicheiro, secret, 12);`;

content = content.replace(toReplace, replacement);

const toReplace2 = `    urlLogoSegura = await gerarUrlAssinada(chaveLogo, env.IMAGE_SECRET, 12);`;
const replacement2 = `    const secret = env.IMAGE_SECRET || 'dummy-secret-for-dev';
    urlLogoSegura = await gerarUrlAssinada(chaveLogo, secret, 12);`;

content = content.replace(toReplace2, replacement2);

fs.writeFileSync('src/app/e/[id]/telao/page.tsx', content);
