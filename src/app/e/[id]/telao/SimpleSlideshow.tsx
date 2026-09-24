'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { Maximize2, Pause, Play } from 'lucide-react';

export default function SimpleSlideshow({ fotos, urlCamera }: { fotos: any[]; urlCamera: string }) {
  const router = useRouter();
  const [indexAtual, setIndexAtual] = useState(0);
  const [isPausado, setIsPausado] = useState(false);

  const avancarSlide = () => {
    if (fotos.length <= 1) return;
    setIndexAtual((prev) => (prev + 1) % fotos.length);
  };

  const voltarSlide = () => {
    if (fotos.length <= 1) return;
    setIndexAtual((prev) => (prev - 1 + fotos.length) % fotos.length);
  };

  // 1. Temporizador Dinâmico (Fotos = 6s, Vídeos = Tempo real)
  useEffect(() => {
    if (fotos.length <= 1 || isPausado) return;

    let timer: NodeJS.Timeout;
    const fotoAtual = fotos[indexAtual];

    // Se for imagem, passa em 6 segundos. Se for vídeo, o evento onEnded fará a transição.
    if (fotoAtual?.tipoMedia !== 'video') {
      timer = setTimeout(() => {
        avancarSlide();
      }, 6000);
    } else {
      // Backup de segurança para vídeos: se falhar o play, força a troca em 16 segundos
      timer = setTimeout(() => {
        avancarSlide();
      }, 16000);
    }

    return () => clearTimeout(timer);
  }, [indexAtual, fotos, isPausado]);

  // 2. Revalidação em segundo plano sem piscar nem recarregar a janela
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      router.refresh();
    }, 12000); // Revalida a cada 12 segundos em background
    return () => clearInterval(refreshInterval);
  }, [router]);

  // 3. Atalhos do Teclado para o Apresentador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPausado((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        avancarSlide();
      } else if (e.code === 'ArrowLeft') {
        voltarSlide();
      } else if (e.code === 'KeyF') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fotos.length]);

  if (fotos.length === 0) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Telão ao Vivo Pronto
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Aguardando a primeira lembrança...
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mb-10 font-light">
            Aponte a câmera do celular para o código abaixo para enviar a primeira foto da festa!
          </p>

          <div className="relative group p-2 rounded-3xl bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="bg-white p-5 rounded-2xl shadow-2xl">
              <QRCodeSVG value={urlCamera} size={260} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center select-none">
      
      {/* Indicador de Pausa Discreto */}
      {isPausado && (
        <div className="absolute top-8 left-8 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/75 border border-white/20 text-white backdrop-blur-md shadow-2xl animate-pulse">
          <Pause size={14} className="text-amber-400" />
          <span className="text-xs font-semibold">Pausado (Espaço para retomar)</span>
        </div>
      )}

      {/* Renderização das Fotos e Vídeos com Transição Suave */}
      {fotos.map((foto, index) => (
        <div
          key={foto.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === indexAtual ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {foto.tipoMedia === 'video' ? (
            <video
              ref={(el) => {
                if (el) {
                  if (index === indexAtual && !isPausado) {
                    el.currentTime = 0;
                    el.play().catch(() => {});
                  } else {
                    el.pause();
                  }
                }
              }}
              src={foto.urlImagem}
              muted
              playsInline
              onEnded={avancarSlide}
              className="w-full h-full object-contain"
            />
          ) : (
            <img
              src={foto.urlImagem}
              alt="Lembrança do evento"
              className="w-full h-full object-contain"
            />
          )}

          {/* Legenda / Mensagem do Convidado */}
          {foto.mensagem && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none px-6 z-30">
              <div className="bg-black/70 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-3xl max-w-3xl text-center shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                <p className="text-2xl md:text-3xl font-medium tracking-wide drop-shadow-md">
                  "{foto.mensagem}"
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* QR Code Flutuante no Canto com Estilo Glassmorphism */}
      <div className="absolute bottom-8 left-8 bg-black/50 backdrop-blur-xl p-3.5 rounded-2xl flex flex-col items-center border border-white/15 shadow-[0_0_30px_rgba(0,0,0,0.6)] z-40 group hover:scale-105 transition-transform duration-300">
        <div className="bg-white p-2 rounded-xl mb-1.5 shadow-lg">
          <QRCodeSVG value={urlCamera} size={110} />
        </div>
        <span className="text-white font-bold text-xs tracking-wide drop-shadow">
          Aponte e Participe!
        </span>
      </div>

    </div>
  );
}
