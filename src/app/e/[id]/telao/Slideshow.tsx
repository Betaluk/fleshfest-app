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
      
      {/* Imagem Atual com Transição Suave (Fade) */}
      {fotos.map((foto, index) => (
        <img
          key={foto.id}
          src={foto.urlImagem}
          alt="Fotografia do evento"
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ${
            index === indexAtual ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* QR Code Fixo no Canto Inferior Direito */}
      <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-2xl flex flex-col items-center border border-white/20 shadow-2xl">
        <div className="bg-white p-2 rounded-lg mb-2">
          <QRCodeSVG value={urlCamera} size={120} />
        </div>
        <span className="text-white font-bold text-sm drop-shadow-md mt-1">Tire a sua foto!</span>
      </div>
      
    </div>
  );
}