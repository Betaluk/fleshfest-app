'use client';

import { useState, useEffect } from 'react';
import { Camera, Video, Send, RefreshCcw, Sparkles, AlertCircle, X, CheckCircle2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

// --- DEFINIÇÃO DOS FILTROS (Mantidos intactos) ---
const FILTROS = [
  { id: 'none', nome: 'Original', css: 'none' },
  { id: 'pb', nome: 'P&B', css: 'grayscale(100%)' },
  { id: 'sepia', nome: 'Sépia', css: 'sepia(100%)' },
  { id: 'vintage', nome: 'Vintage', css: 'contrast(1.2) saturate(1.2) sepia(0.4) hue-rotate(-10deg)' },
];

export default function CameraClient({ id, nomeEvento }: { id: string; nomeEvento: string }) {
  const [modo, setModo] = useState<'imagem' | 'video'>('imagem'); // Chave seletora
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [arquivoOriginal, setArquivoOriginal] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);
  const [etapaEnvio, setEtapaEnvio] = useState<string>('');
  const [mensagem, setMensagem] = useState('');
  const [filtroAtual, setFiltroAtual] = useState('none');
  const [tipoMediaCapturada, setTipoMediaCapturada] = useState<'imagem' | 'video'>('imagem');

  // Estados de feedback visual (Substituem os alerts nativos)
  const [sucessoModal, setSucessoModal] = useState<{ visivel: boolean; mensagem: string } | null>(null);
  const [erroToast, setErroToast] = useState<string | null>(null);

  // Helper de vibração háptica no smartphone
  const vibrar = (padrao: number | number[] = 40) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(padrao);
      } catch (_) {}
    }
  };

  // Auto-fechamento do toast de erro após 5 segundos
  useEffect(() => {
    if (erroToast) {
      const timer = setTimeout(() => setErroToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [erroToast]);

  const capturarMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      vibrar(30);
      const isVideo = file.type.startsWith('video/');
      setTipoMediaCapturada(isVideo ? 'video' : 'imagem');
      
      setArquivoOriginal(file);
      const url = URL.createObjectURL(file);
      setMediaUrl(url);
      setFiltroAtual('none');
    }
  };

  const enviarMedia = async () => {
    if (!arquivoOriginal || !mediaUrl) return;
    vibrar(30);
    setProcessando(true);
    setEtapaEnvio(tipoMediaCapturada === 'imagem' ? 'Otimizando imagem...' : 'Processando vídeo...');

    try {
      let arquivoParaProcessar = arquivoOriginal;

      // 1. PROCESSAMENTO DE IMAGEM (Canvas e Compressão)
      if (tipoMediaCapturada === 'imagem') {
        if (filtroAtual !== 'none') {
          arquivoParaProcessar = await new Promise<File>((resolve) => {
            const img = new Image();
            img.src = mediaUrl;
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.filter = filtroAtual;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                  if (blob) resolve(new File([blob], arquivoOriginal.name, { type: arquivoOriginal.type }));
                  else resolve(arquivoOriginal);
                }, arquivoOriginal.type);
              } else {
                resolve(arquivoOriginal);
              }
            };
          });
        }

        const options = { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true };
        arquivoParaProcessar = await imageCompression(arquivoParaProcessar, options);
      } else {
        // 2. PROCESSAMENTO DE VÍDEO (Hardware do Celular)
        if (arquivoOriginal.size > 25 * 1024 * 1024) {
          vibrar([60, 60, 60]);
          setErroToast('Este vídeo é muito pesado. Tente gravar um clipe mais curto (10 a 15 segundos).');
          setProcessando(false);
          return;
        }
      }

      setEtapaEnvio('Enviando para o telão...');

      // 3. EMPACOTAMENTO
      const formData = new FormData();
      formData.append('foto', arquivoParaProcessar, arquivoOriginal.name);
      formData.append('eventoId', id);
      formData.append('tipoMedia', tipoMediaCapturada);
      if (mensagem.trim()) formData.append('mensagem', mensagem.trim());

      const resposta = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const dados = (await resposta.json()) as { mensagem?: string; erro?: string };

      if (resposta.ok) {
        vibrar([40, 60, 60]);
        setSucessoModal({
          visivel: true,
          mensagem: dados.mensagem || 'Sua lembrança foi enviada com sucesso!'
        });
        setMediaUrl(null);
        setArquivoOriginal(null);
        setMensagem(''); 
        setFiltroAtual('none');
      } else {
        vibrar([80, 50, 80]);
        setErroToast(dados.erro || 'Não foi possível enviar sua lembrança.');
      }
    } catch (error) {
      console.error("Erro ao enviar a mídia:", error);
      vibrar([80, 50, 80]);
      setErroToast("Houve uma falha na conexão. Tente novamente em alguns segundos.");
    } finally {
      setProcessando(false);
      setEtapaEnvio('');
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* BACKGROUND GRADIENTE */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950/40 to-black pointer-events-none"></div>

      {/* TOAST DE ERRO FLUTUANTE */}
      {erroToast && (
        <div className="fixed top-6 inset-x-4 max-w-md mx-auto z-50 flex items-center justify-between gap-3 p-4 bg-red-950/90 border border-red-500/40 text-red-100 rounded-2xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="text-sm font-medium">{erroToast}</span>
          </div>
          <button
            onClick={() => setErroToast(null)}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
            aria-label="Fechar alerta"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* MODAL COMEMORATIVO DE SUCESSO (COM EFEITO DE CELEBRAÇÃO) */}
      {sucessoModal?.visivel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border border-emerald-500/40 rounded-3xl p-8 text-center shadow-[0_0_60px_-10px_rgba(16,185,129,0.35)] flex flex-col items-center animate-in zoom-in-95 duration-300">
            
            {/* Ícone Pulsante Comemorativo */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce">
              <span className="text-4xl">🎉</span>
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-2 font-[family-name:var(--font-jakarta)]">
              Lembrança Enviada!
            </h3>
            
            <p className="text-zinc-300 text-sm mb-5 leading-relaxed">
              {sucessoModal.mensagem}
            </p>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3.5 mb-7 w-full flex items-center justify-center gap-2 text-emerald-400 text-xs font-semibold">
              <span className="text-base">👀</span>
              <span>Olhe para a tela! Sua foto já está no ar.</span>
            </div>

            <button
              type="button"
              onClick={() => {
                vibrar(25);
                setSucessoModal(null);
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-zinc-950 font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              Tirar Mais Fotos 📸
            </button>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-md flex flex-col items-center gap-6 p-6 sm:p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 tracking-tight leading-tight font-[family-name:var(--font-jakarta)]">
            {nomeEvento}
          </h1>
          <p className="text-zinc-400 text-sm font-medium">Deixe sua marca na festa!</p>
        </div>

        {!mediaUrl ? (
          <div className="w-full flex flex-col items-center py-4 gap-6">
            
            {/* CHAVE SELETORA FOTO/VÍDEO */}
            <div className="flex bg-zinc-950/80 p-1 rounded-full border border-zinc-800 shadow-inner w-full max-w-[200px]">
              <button 
                type="button"
                onClick={() => {
                  vibrar(25);
                  setModo('imagem');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer ${
                  modo === 'imagem' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Camera size={16} /> Foto
              </button>
              <button 
                type="button"
                onClick={() => {
                  vibrar(25);
                  setModo('video');
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-full transition-all cursor-pointer ${
                  modo === 'video' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Video size={16} /> Vídeo
              </button>
            </div>

            <label className="group relative flex flex-col items-center justify-center w-48 h-48 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.3)]"></div>
              <div className="absolute inset-[4px] bg-zinc-900 rounded-full border border-emerald-500/50 flex flex-col items-center justify-center gap-3 group-hover:bg-zinc-800 transition-colors">
                {modo === 'imagem' ? <Camera size={48} className="text-emerald-400" /> : <Video size={48} className="text-emerald-400" />}
                <span className="text-white font-bold text-lg tracking-wide">
                  {modo === 'imagem' ? 'Tirar Foto' : 'Gravar 15s'}
                </span>
              </div>
              <input
                type="file"
                accept={modo === 'imagem' ? "image/*" : "video/*"}
                capture="environment"
                className="hidden"
                onChange={capturarMedia}
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full gap-5 animate-in fade-in zoom-in duration-300">
            
            {/* PREVIEW DINÂMICO (IMAGEM OU VÍDEO) */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black group">
              {tipoMediaCapturada === 'video' ? (
                <video 
                  src={mediaUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="object-contain w-full h-full bg-black"
                />
              ) : (
                <img 
                  src={mediaUrl} 
                  alt="Sua foto" 
                  className="object-contain w-full h-full transition-all duration-300 bg-black"
                  style={{ filter: filtroAtual }}
                />
              )}

              {/* OVERLAY COM ETAPA DE PROCESSAMENTO */}
              {processando && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-emerald-400 font-medium z-50">
                  <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                  <span className="animate-pulse text-sm font-semibold">{etapaEnvio || 'Enviando para o telão...'}</span>
                </div>
              )}
            </div>

            {/* SELEÇÃO DE FILTROS (Escondido se for vídeo) */}
            {tipoMediaCapturada === 'imagem' && (
              <div className="w-full animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={16} className="text-emerald-400" />
                  <span className="text-sm font-semibold text-zinc-300">Estilo da Foto</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
                  {FILTROS.map((filtro) => (
                    <button
                      key={filtro.id}
                      type="button"
                      onClick={() => {
                        vibrar(20);
                        setFiltroAtual(filtro.css);
                      }}
                      disabled={processando}
                      className={`snap-center shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                        filtroAtual === filtro.css
                          ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)] font-bold'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-white'
                      }`}
                    >
                      {filtro.nome}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="w-full">
              <textarea 
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                maxLength={120}
                placeholder={tipoMediaCapturada === 'imagem' ? "Deixe uma mensagem ou seu nome (opcional)" : "Legenda do vídeo (opcional)"}
                disabled={processando}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none h-20 transition-all text-base sm:text-sm"
              />
            </div>
            
            <div className="flex w-full gap-3">
              <button 
                type="button"
                onClick={() => {
                  vibrar(25);
                  setMediaUrl(null);
                  setArquivoOriginal(null);
                  setMensagem('');
                }}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-semibold text-sm sm:text-base transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <RefreshCcw size={18} />
                Refazer
              </button>
              <button 
                type="button"
                onClick={enviarMedia}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-zinc-950 font-bold text-sm sm:text-base transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <Send size={18} />
                <span>{processando ? "Enviando..." : "Enviar"}</span>
              </button>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}