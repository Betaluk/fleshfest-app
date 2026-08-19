'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Loader2 } from 'lucide-react';

export default function BotaoDownloadZip({ 
  fotosUrls, 
  nomeEvento 
}: { 
  fotosUrls: string[], 
  nomeEvento: string 
}) {
  const [baixando, setBaixando] = useState(false);
  const [progresso, setProgresso] = useState(0);

  const baixarZip = async () => {
    if (fotosUrls.length === 0) {
      alert('Não há fotos aprovadas para transferir.');
      return;
    }

    setBaixando(true);
    setProgresso(0);
    const zip = new JSZip();
    
    // Cria uma pasta dentro do ZIP com o nome da festa limpo de espaços
    const nomePasta = `FlashFest_${nomeEvento.replace(/\s+/g, '_')}`;
    const pasta = zip.folder(nomePasta);

    try {
      // Faz o download de cada foto sequencialmente e adiciona à pasta do ZIP
      for (let i = 0; i < fotosUrls.length; i++) {
        const url = fotosUrls[i];
        
        // Faz o fetch da imagem transformando-a num blob (dados binários)
        const response = await fetch(url);
        const blob = await response.blob();
        
        // Define a extensão (geralmente .jpg ou .png)
        const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
        const nomeArquivo = `foto_${i + 1}.${ext}`;
        
        pasta?.file(nomeArquivo, blob);
        
        // Atualiza a percentagem no botão
        setProgresso(Math.round(((i + 1) / fotosUrls.length) * 100));
      }

      // Gera o ficheiro ZIP final
      const conteudo = await zip.generateAsync({ type: 'blob' });
      
      // Aciona o download no navegador do utilizador
      saveAs(conteudo, `${nomePasta}.zip`);
      
    } catch (error) {
      console.error("Erro ao gerar ZIP", error);
      alert("Ocorreu um erro ao transferir as fotos.");
    } finally {
      setBaixando(false);
    }
  };

  return (
    <button
      onClick={baixarZip}
      disabled={baixando || fotosUrls.length === 0}
      className="flex flex-col items-center justify-center bg-zinc-800 hover:bg-emerald-600 border border-zinc-700 rounded-xl p-8 transition group disabled:opacity-50 disabled:hover:bg-zinc-800"
    >
      {baixando ? (
        <Loader2 className="animate-spin text-white mb-3" size={40} />
      ) : (
        <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">📥</span>
      )}
      <span className="font-bold text-white text-lg">
        {baixando ? `A transferir... ${progresso}%` : 'Baixar Todas (ZIP)'}
      </span>
      <span className="text-sm text-zinc-400 mt-1">
        {baixando ? 'A compactar ficheiros' : `${fotosUrls.length} fotos prontas`}
      </span>
    </button>
  );
}