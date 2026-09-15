'use client';

import { useState } from 'react';
import { Camera, Video, Send, RefreshCcw, Sparkles } from 'lucide-react';
import imageCompression from 'browser-image-compression';

// --- DEFINIÇÃO DOS FILTROS (Mantidos intactos) ---
const FILTROS = [
  { id: 'none', nome: 'Original', css: 'none' },
  { id: 'pb', nome: 'P&B', css: 'grayscale(100%)' },
  { id: 'sepia', nome: 'Sépia', css: 'sepia(100%)' },
  { id: 'vintage', nome: 'Vintage', css: 'contrast(1.2) saturate(1.2) sepia(0.4) hue-rotate(-10deg)' },
];

export default function CameraClient({ id, nomeEvento }: { id: string, nomeEvento: string }) {
  const [modo, setModo] = useState<'imagem' | 'video'>('imagem'); // Chave seletora
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [arquivoOriginal, setArquivoOriginal] = useState<File | null>(null);
  const [processando, setProcessando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [filtroAtual, setFiltroAtual] = useState('none');
  const [tipoMediaCapturada, setTipoMediaCapturada] = useState<'imagem' | 'video'>('imagem');

  const capturarMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Identifica se o celular retornou um vídeo ou imagem
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
    setProcessando(true);

    try {
      let arquivoParaProcessar = arquivoOriginal;

      // 1. PROCESSAMENTO DE IMAGEM (Mantém a mágica do Canvas e Compressão)
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
        // O SO já comprimiu, mas fazemos uma trava de segurança (ex: max 25MB)
        if (arquivoOriginal.size > 25 * 1024 * 1024) {
          alert('Este vídeo é muito pesado. Tente gravar um clipe mais curto (10 a 15 segundos).');
          setProcessando(false);
          return;
        }
      }

      // 3. EMPACOTAMENTO
      const formData = new FormData();
      formData.append('foto', arquivoParaProcessar, arquivoOriginal.name); // Mantemos a key 'foto' para não quebrar a API atual
      formData.append('eventoId', id);
      formData.append('tipoMedia', tipoMediaCapturada); // <--- NOVA FLAG
      if (mensagem.trim()) formData.append('mensagem', mensagem.trim());

      const resposta = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const dados = (await resposta.json()) as { mensagem?: string; erro?: string };

      if (resposta.ok) {
        alert('🎉 ' + dados.mensagem);
        setMediaUrl(null);
        setArquivoOriginal(null);
        setMensagem(''); 
        setFiltroAtual('none');
      } else {
        alert('Erro: ' + dados.erro);
      }
    } catch (error) {
      console.error("Erro ao enviar a mídia:", error);
      alert("Houve um erro de conexão. Tente novamente.");
    } finally {
      setProcessando(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-950/40 to-black pointer-events-none"></div>
      
      <div className="w-full max-w-md flex flex-col items-center gap-6 p-6 sm:p-8 rounded-3xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
        
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200 tracking-tight leading-tight">{nomeEvento}</h1>
          <p className="text-zinc-400 text-sm font-medium">Deixe sua marca na festa!</p>
        </div>

        {!mediaUrl ? (
          <div className="w-full flex flex-col items-center py-4 gap-6">
            
            {/* CHAVE SELETORA FOTO/VÍDEO */}
            <div className="flex bg-zinc-950/80 p-1 rounded-full border border-zinc-800 shadow-inner w-full max-w-[200px]">
              <button 
                onClick={() => setModo('imagem')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-full transition-all ${modo === 'imagem' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                <Camera size={16} /> Foto
              </button>
              <button 
                onClick={() => setModo('video')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-full transition-all ${modo === 'video' ? 'bg-emerald-500 text-zinc-950 shadow-md' : 'text-zinc-400 hover:text-white'}`}
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
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border border-white/20 shadow-2xl bg-black group">
              {tipoMediaCapturada === 'video' ? (
                <video 
                  src={mediaUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="object-cover w-full h-full"
                />
              ) : (
                <img 
                  src={mediaUrl} 
                  alt="Sua foto" 
                  className="object-cover w-full h-full transition-all duration-300"
                  style={{ filter: filtroAtual }}
                />
              )}

              {processando && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center gap-4 text-emerald-400 font-medium z-50">
                  <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
                  <span className="animate-pulse">Enviando para o telão...</span>
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
                      onClick={() => setFiltroAtual(filtro.css)}
                      disabled={processando}
                      className={`snap-center shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filtroAtual === filtro.css
                          ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
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
                placeholder={tipoMediaCapturada === 'imagem' ? "Deixe uma mensagem (opcional)" : "Legenda do vídeo (opcional)"}
                disabled={processando}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none h-20 transition-all text-sm"
              />
            </div>
            
            <div className="flex w-full gap-3">
              <button 
                onClick={() => {
                  setMediaUrl(null);
                  setArquivoOriginal(null);
                  setMensagem('');
                }}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-semibold transition-all disabled:opacity-50"
              >
                <RefreshCcw size={20} />
                Refazer
              </button>
              <button 
                onClick={enviarMedia}
                disabled={processando}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50"
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