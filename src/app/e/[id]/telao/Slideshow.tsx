'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Slideshow({ fotos, urlCamera }: { fotos: any[], urlCamera: string }) {
  const [indexAtual, setIndexAtual] = useState(0);

  const avancarSlide = () => {
    setIndexAtual((prev) => (prev + 1) % fotos.length);
  };

  // 1. Temporizador Dinâmico (Fotos = 6s, Vídeos = Tempo real)
  useEffect(() => {
    if (fotos.length <= 1) return;

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
  }, [indexAtual, fotos]);

  // 2. Refresh automático da página a cada 30 segundos
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      window.location.reload();
    }, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  if (fotos.length === 0) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-8 text-center px-4">Aguardando a primeira lembrança...</h1>
        <div className="bg-white p-4 rounded-xl shadow-2xl">
          <QRCodeSVG value={urlCamera} size={250} />
        </div>
        <p className="mt-4 text-xl text-zinc-400">Faça o scan do código para participar!</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      
      {fotos.map((foto, index) => (
        <div
          key={foto.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === indexAtual ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* LÓGICA HÍBRIDA: IMAGEM OU VÍDEO */}
          {foto.tipoMedia === 'video' ? (
             <video
               ref={(el) => {
                 // Pausa os vídeos invisíveis e toca apenas o que está na tela
                 if (el) {
                   if (index === indexAtual) {
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
               onEnded={avancarSlide} // <-- Passa a foto assim que o vídeo acaba
               className="w-full h-full object-contain"
             />
          ) : (
             <img
               src={foto.urlImagem}
               alt="Lembrança do evento"
               className="w-full h-full object-contain"
             />
          )}
          
          {foto.mensagem && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none px-4 z-30">
              <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full max-w-3xl text-center shadow-2xl">
                <p className="text-2xl font-medium tracking-wide">"{foto.mensagem}"</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center border border-white/20 shadow-2xl z-40">
        <div className="bg-white p-2 rounded-lg mb-2">
          <QRCodeSVG value={urlCamera} size={120} />
        </div>
        <span className="text-white font-bold text-sm drop-shadow-md mt-1">Deixe sua marca!</span>
      </div>
      
    </div>
  );
}