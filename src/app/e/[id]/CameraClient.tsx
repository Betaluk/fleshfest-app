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
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Decorativo Premium */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950/40 to-black pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md flex flex-col items-center gap-8 p-8 sm:p-10 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl mb-2 border border-white/10 shadow-inner">
            <Camera className="text-emerald-400 w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 tracking-tight leading-tight">{nomeEvento}</h1>
          <p className="text-zinc-400 text-base font-medium">Capture momentos únicos e compartilhe no telão!</p>
        </div>

        {!fotoUrl ? (
          <div className="w-full flex justify-center py-6">
            <label className="group relative flex flex-col items-center justify-center w-56 h-56 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-pulse opacity-20 blur-xl"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] transition-shadow"></div>
              <div className="absolute inset-[4px] bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full border border-emerald-300/30 flex flex-col items-center justify-center gap-3">
                <Camera size={56} className="text-white filter drop-shadow-lg group-hover:-translate-y-1 transition-transform" />
                <span className="text-white font-bold text-xl tracking-wide shadow-black drop-shadow-md">Tirar Foto</span>
              </div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={capturarFoto}
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full gap-8 animate-in fade-in zoom-in duration-300">
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/50 backdrop-blur-sm group">
              <img src={fotoUrl} alt="Sua foto" className="object-contain w-full h-full" />
              {processando && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-emerald-400 font-medium">
                  <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                  <span className="animate-pulse text-lg">Enviando para o telão...</span>
                </div>
              )}
            </div>
            
            <div className="flex w-full gap-4">
              <button 
                onClick={() => {
                  setFotoUrl(null);
                  setArquivoOriginal(null);
                }}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                <RefreshCcw size={22} className={processando ? "animate-spin" : ""} />
                Tentar de novo
              </button>
              <button 
                onClick={enviarFoto}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] border border-emerald-400/30"
              >
                <Send size={22} className={processando ? "animate-bounce" : ""} />
                {processando ? "Enviando..." : "Enviar Foto"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}