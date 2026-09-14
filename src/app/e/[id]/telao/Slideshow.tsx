'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function Slideshow({ fotos, urlCamera }: { fotos: any[], urlCamera: string }) {
  const [indexAtual, setIndexAtual] = useState(0);

  // Efeito para trocar de fotografia a cada 5 segundos de forma automática
  useEffect(() => {
    if (fotos.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndexAtual((prev) => (prev + 1) % fotos.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [fotos.length]);

  // Efeito para recarregar a página a cada 30 segundos e puxar fotografias novas
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      window.location.reload();
    }, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Ecrã de espera caso o evento ainda não tenha fotografias
  if (fotos.length === 0) {
    return (
      <div className="h-screen w-full bg-zinc-950 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-8 text-center px-4">Aguardando a primeira fotografia...</h1>
        <div className="bg-white p-4 rounded-xl shadow-2xl">
          <QRCodeSVG value={urlCamera} size={250} />
        </div>
        <p className="mt-4 text-xl text-zinc-400">Faça o scan do código para participar!</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex items-center justify-center">
      
      {/* Imagem Atual e Mensagem com Transição Suave (Fade) */}
      {fotos.map((foto, index) => (
        <div
          key={foto.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === indexAtual ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={foto.urlImagem}
            alt="Fotografia do evento"
            className="w-full h-full object-contain"
          />
          
          {/* --- A CAIXA DA MENSAGEM DO GUESTBOOK --- */}
          {foto.mensagem && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none px-4">
              <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full max-w-3xl text-center shadow-2xl">
                <p className="text-2xl font-medium tracking-wide">"{foto.mensagem}"</p>
              </div>
            </div>
          )}
          {/* ---------------------------------------- */}
        </div>
      ))}

      {/* QR Code Fixo no Canto Inferior Direito (z-20 garante que fique acima de tudo) */}
      <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center border border-white/20 shadow-2xl z-20">
        <div className="bg-white p-2 rounded-lg mb-2">
          <QRCodeSVG value={urlCamera} size={120} />
        </div>
        <span className="text-white font-bold text-sm drop-shadow-md mt-1">Tire a sua foto!</span>
      </div>
      
    </div>
  );
}