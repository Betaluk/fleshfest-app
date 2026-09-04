'use client';

import { useState } from 'react';

export default function BotaoDownload({ url }: { url: string }) {
  const [baixando, setBaixando] = useState(false);

  const fazerDownload = async () => {
    try {
      setBaixando(true);
      // Busca a imagem e transforma em Blob para forçar o download no navegador
      const resposta = await fetch(url);
      const blob = await resposta.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `flashfest-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error('Erro ao baixar a imagem', error);
    } finally {
      setBaixando(false);
    }
  };

  return (
    <button
      onClick={fazerDownload}
      disabled={baixando}
      className="bg-black/60 hover:bg-emerald-500 hover:text-zinc-950 text-white backdrop-blur-md p-2 rounded-full transition-all duration-300"
      title="Baixar Foto"
    >
      {baixando ? (
        <span className="animate-pulse">⏳</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      )}
    </button>
  );
}