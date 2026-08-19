'use client';

import { useState } from 'react';
import { Camera, Send, RefreshCcw } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function CameraClient({ id, nomeEvento }: { id: string, nomeEvento: string }) {
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [arquivoOriginal, setArquivoOriginal] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);

  const capturarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setArquivoOriginal(file);
      const url = URL.createObjectURL(file);
      setFotoUrl(url);
    }
  };

  const enviarFoto = async () => {
    if (!arquivoOriginal) return;

    setProcessando(true);

    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const fotoComprimida = await imageCompression(arquivoOriginal, options);

      const formData = new FormData();
      formData.append('foto', fotoComprimida, arquivoOriginal.name);
      formData.append('eventoId', id);

      const resposta = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const dados = (await resposta.json()) as { mensagem?: string; erro?: string };

      if (resposta.ok) {
        alert('🎉 ' + dados.mensagem);
        setFotoUrl(null);
        setArquivoOriginal(null);
      } else {
        alert('Erro: ' + dados.erro);
      }
    } catch (error) {
      console.error("Erro ao enviar a imagem:", error);
      alert("Houve um erro de conexão. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md flex flex-col items-center gap-8 border border-zinc-800 p-8 rounded-2xl bg-zinc-900 shadow-xl">
        
        <div className="text-center">
          {/* Agora o nome real da festa vai aparecer na tela do convidado! */}
          <h1 className="text-2xl font-bold text-emerald-400 mb-2">{nomeEvento}</h1>
          <p className="text-zinc-400 text-sm">Deixe sua lembrança para os noivos!</p>
        </div>

        {!fotoUrl ? (
          <label className="flex flex-col items-center justify-center w-48 h-48 bg-emerald-600 hover:bg-emerald-500 rounded-full cursor-pointer transition-all shadow-lg shadow-emerald-900/50 hover:scale-105 active:scale-95">
            <Camera size={48} className="text-white mb-2" />
            <span className="text-white font-semibold">Tirar Foto</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
              onChange={capturarFoto}
            />
          </label>
        ) : (
          <div className="flex flex-col items-center w-full gap-6">
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-zinc-700 shadow-inner bg-black">
              <img src={fotoUrl} alt="Sua foto" className="object-contain w-full h-full" />
            </div>
            
            <div className="flex w-full gap-4">
              <button 
                onClick={() => {
                  setFotoUrl(null);
                  setArquivoOriginal(null);
                }}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors disabled:opacity-50"
              >
                <RefreshCcw size={20} />
                Refazer
              </button>
              <button 
                onClick={enviarFoto}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-lg shadow-emerald-900/20 disabled:opacity-50"
              >
                <Send size={20} />
                {processando ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}