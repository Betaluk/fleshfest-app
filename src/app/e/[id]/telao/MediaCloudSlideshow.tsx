'use client';

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Função para gerar posições e animações aleatórias para o fundo
const generateRandomCloudStyle = () => {
  const isLeft = Math.random() > 0.5;
  const isTop = Math.random() > 0.5;

  const baseXY = {
    x: (Math.random() * 40 + 20) * (isLeft ? -1 : 1) + 'vw',
    y: (Math.random() * 40 + 20) * (isTop ? -1 : 1) + 'vh',
  };

  const floatTarget = {
    x: (Math.random() * 50 + 10) * (isLeft ? -1 : 1) + 'vw',
    y: (Math.random() * 50 + 10) * (isTop ? -1 : 1) + 'vh',
  };

  return {
    initial: {
      x: baseXY.x,
      y: baseXY.y,
      scale: Math.random() * 0.3 + 0.2, // Escala entre 0.2 e 0.5
      opacity: Math.random() * 0.3 + 0.1, // Opacidade entre 0.1 e 0.4
      filter: `blur(${Math.random() * 4 + 4}px)`, // Blur entre 4px e 8px
      zIndex: 0,
      rotate: Math.random() * 10 - 5,
    },
    animate: {
      x: [baseXY.x, floatTarget.x, baseXY.x],
      y: [baseXY.y, floatTarget.y, baseXY.y],
      transition: {
        duration: Math.random() * 20 + 20, // Movimento bem lento
        repeat: Infinity,
        ease: "linear",
      }
    }
  };
};

export default function MediaCloudSlideshow({ fotos, urlCamera }: { fotos: any[], urlCamera: string }) {
  const router = useRouter();
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [newArrivalId, setNewArrivalId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const seenIdsRef = useRef<Set<string>>(new Set());
  const cloudStylesRef = useRef<Record<string, ReturnType<typeof generateRandomCloudStyle>>>({});

  useEffect(() => {
    setIsMounted(true);
    let hasNew = false;
    let latestNewId: string | null = null;

    fotos.forEach(foto => {
      if (!cloudStylesRef.current[foto.id]) {
        cloudStylesRef.current[foto.id] = generateRandomCloudStyle();
      }
      if (!seenIdsRef.current.has(foto.id)) {
        seenIdsRef.current.add(foto.id);
        if (seenIdsRef.current.size > fotos.length) {
          hasNew = true;
          latestNewId = foto.id;
        }
      }
    });

    if (seenIdsRef.current.size === fotos.length && !focusedId && fotos.length > 0) {
      setFocusedId(fotos[0].id);
      seenIdsRef.current = new Set(fotos.map(f => f.id));
    } else if (hasNew && latestNewId) {
      setNewArrivalId(latestNewId);
      setFocusedId(latestNewId);
    }
  }, [fotos, focusedId]);

  const avancarFoco = () => {
    if (fotos.length <= 1) return;

    let proximoFoco;
    do {
      const randomIndex = Math.floor(Math.random() * fotos.length);
      proximoFoco = fotos[randomIndex].id;
    } while (proximoFoco === focusedId && fotos.length > 1);

    setFocusedId(proximoFoco);
  };

  useEffect(() => {
    if (fotos.length <= 1) return;

    let timer: NodeJS.Timeout;
    const fotoAtual = fotos.find(f => f.id === focusedId);

    const holdTime = newArrivalId === focusedId ? 7000 : 6000;

    if (fotoAtual?.tipoMedia !== 'video') {
      timer = setTimeout(() => {
        if (newArrivalId === focusedId) setNewArrivalId(null);
        avancarFoco();
      }, holdTime);
    } else {
      timer = setTimeout(() => {
        if (newArrivalId === focusedId) setNewArrivalId(null);
        avancarFoco();
      }, 16000);
    }

    return () => clearTimeout(timer);
  }, [focusedId, fotos, newArrivalId]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (!newArrivalId) {
        router.refresh();
      }
    }, 10000);
    return () => clearInterval(refreshInterval);
  }, [newArrivalId, router]);

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

  if (!isMounted) return <div className="h-screen w-full bg-[#050505]" />;

  return (
    <div className="relative h-screen w-full bg-[#050505] overflow-hidden flex items-center justify-center perspective-[1000px]">

      <AnimatePresence>
        {fotos.map((foto) => {
          const isFocused = foto.id === focusedId;
          const isNewArrival = isFocused && foto.id === newArrivalId;
          const cloudStyle = cloudStylesRef.current[foto.id] || generateRandomCloudStyle();

          return (
            <motion.div
              key={foto.id}
              className="absolute inset-0 w-full h-full flex items-center justify-center origin-center"
              initial={cloudStyle.initial as any}
              animate={(isFocused ? {
                x: 0,
                y: 0,
                scale: isNewArrival ? [0, 1.1, 1] : 1,
                opacity: 1,
                filter: "blur(0px)",
                rotate: 0,
                zIndex: 50,
                transition: {
                  duration: isNewArrival ? 0.8 : 1.2,
                  ease: isNewArrival ? [0.175, 0.885, 0.32, 1.275] : "easeInOut"
                }
              } : {
                x: cloudStyle.animate.x,
                y: cloudStyle.animate.y,
                scale: cloudStyle.initial.scale,
                opacity: cloudStyle.initial.opacity,
                filter: cloudStyle.initial.filter,
                rotate: cloudStyle.initial.rotate,
                zIndex: 0,
                transition: cloudStyle.animate.transition
              }) as any}
            >
              {/* CORREÇÃO AQUI: Mudamos para inline-flex e removemos larguras fixas */}
              <motion.div
                className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden shadow-2xl ${
                  isNewArrival ? 'shadow-white/50 border border-white/40' : 'border border-transparent'
                }`}
                animate={{
                  boxShadow: isNewArrival
                    ? ['0px 0px 0px rgba(255,255,255,0)', '0px 0px 100px rgba(255,255,255,0.6)', '0px 0px 40px rgba(255,255,255,0.2)']
                    : '0px 0px 0px rgba(0,0,0,0)',
                }}
                transition={{ duration: 1.5 }}
              >
                {foto.tipoMedia === 'video' ? (
                  <video
                    ref={(el) => {
                      if (el && isFocused && el.paused) {
                        el.currentTime = 0;
                        el.play().catch(() => {});
                      } else if (el && !isFocused && !el.paused) {
                        el.pause();
                      }
                    }}
                    src={foto.urlImagem}
                    muted
                    playsInline
                    onEnded={() => {
                       if(isFocused) {
                           if (newArrivalId === focusedId) setNewArrivalId(null);
                           avancarFoco();
                       }
                    }}
                    /* CORREÇÃO AQUI: Altura e largura automáticas mas com limites de tela (vw/vh) */
                    className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain bg-black/40 backdrop-blur-sm rounded-xl"
                  />
                ) : (
                  <img
                    src={foto.urlImagem}
                    alt="Lembrança do evento"
                    /* CORREÇÃO AQUI: Altura e largura automáticas mas com limites de tela (vw/vh) */
                    className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain bg-black/40 backdrop-blur-sm rounded-xl"
                  />
                )}

                <AnimatePresence>
                  {foto.mensagem && isFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none px-4"
                    >
                      <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-2xl max-w-2xl text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                        <p className="text-2xl font-light tracking-wide text-white/95">"{foto.mensagem}"</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="absolute bottom-8 right-8 bg-black/30 backdrop-blur-xl p-4 rounded-2xl flex flex-col items-center border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 transition-transform hover:scale-105">
        <div className="bg-white p-2 rounded-xl mb-2 shadow-inner">
          <QRCodeSVG value={urlCamera} size={100} />
        </div>
        <span className="text-white/80 font-medium text-xs tracking-wider uppercase mt-1">Participe</span>
      </div>

    </div>
  );
}