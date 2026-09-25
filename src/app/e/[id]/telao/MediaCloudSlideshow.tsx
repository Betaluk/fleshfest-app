'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Maximize2, Pause, Play } from 'lucide-react';

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
  const [isPausado, setIsPausado] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const seenIdsRef = useRef<Set<string>>(new Set());
  const cloudStylesRef = useRef<Record<string, ReturnType<typeof generateRandomCloudStyle>>>({});

  const avancarFoco = useCallback(() => {
    if (fotos.length <= 1) return;

    let proximoFoco;
    do {
      const randomIndex = Math.floor(Math.random() * fotos.length);
      proximoFoco = fotos[randomIndex].id;
    } while (proximoFoco === focusedId && fotos.length > 1);

    setFocusedId(proximoFoco);
  }, [fotos, focusedId]);

  // Detecção precisa de novas chegadas em tempo real
  useEffect(() => {
    setIsMounted(true);
    const isFirstRun = seenIdsRef.current.size === 0;
    let hasNew = false;
    let latestNewId: string | null = null;

    fotos.forEach(foto => {
      if (!cloudStylesRef.current[foto.id]) {
        cloudStylesRef.current[foto.id] = generateRandomCloudStyle();
      }
      if (!seenIdsRef.current.has(foto.id)) {
        seenIdsRef.current.add(foto.id);
        if (!isFirstRun) {
          hasNew = true;
          latestNewId = foto.id;
        }
      }
    });

    if (isFirstRun && fotos.length > 0 && !focusedId) {
      setFocusedId(fotos[0].id);
    } else if (hasNew && latestNewId) {
      setNewArrivalId(latestNewId);
      setFocusedId(latestNewId);
    }
  }, [fotos, focusedId]);

  // Atalhos de teclado para o Apresentador / DJ
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPausado((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        avancarFoco();
      } else if (e.key === 'f' || e.key === 'F') {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [avancarFoco]);

  // Temporizador dinâmico de exibição no telão
  useEffect(() => {
    if (fotos.length <= 1 || isPausado) return;

    let timer: NodeJS.Timeout;
    const fotoAtual = fotos.find(f => f.id === focusedId);

    const holdTime = newArrivalId === focusedId ? 7500 : 6000;

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
  }, [focusedId, fotos, newArrivalId, isPausado, avancarFoco]);

  // Revalidação em segundo plano sem recarregar a janela
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

      {/* TOAST DE CELEBRAÇÃO FLUTUANTE DE NOVA FOTO */}
      <AnimatePresence>
        {newArrivalId && (() => {
          const fotoRecente = fotos.find(f => f.id === newArrivalId);
          if (!fotoRecente) return null;
          return (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="fixed top-8 left-8 z-50 flex items-center gap-4 bg-zinc-950/90 backdrop-blur-2xl border border-emerald-500/50 px-6 py-4 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.35)] pointer-events-none"
            >
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-2xl shadow-inner">
                📸
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5">
                  Nova lembrança no telão!
                </p>
                <p className="text-white text-base font-extrabold tracking-tight">
                  {fotoRecente.nomeConvidado ? `Enviada por ${fotoRecente.nomeConvidado}` : 'Foto recém-chegada!'}
                </p>
                {fotoRecente.mensagem && (
                  <p className="text-zinc-300 text-xs italic line-clamp-1 max-w-sm mt-0.5">
                    &ldquo;{fotoRecente.mensagem}&rdquo;
                  </p>
                )}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* BADGE DE PAUSA */}
      {isPausado && (
        <div className="fixed top-8 right-8 z-50 bg-amber-500/20 backdrop-blur-xl border border-amber-500/40 text-amber-300 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Telão Pausado (Pressione Espaço para retomar)
        </div>
      )}

      {/* CONTROLES DO APRESENTADOR (Canto Inferior Esquerdo) */}
      <div className="absolute bottom-6 left-6 flex items-center gap-3 z-30 opacity-40 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsPausado((prev) => !prev)}
          className="p-3 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-2xl text-white border border-white/10 transition cursor-pointer hover:scale-105 active:scale-95"
          title={isPausado ? "Retomar (Espaço)" : "Pausar (Espaço)"}
          aria-label={isPausado ? "Retomar apresentação" : "Pausar apresentação"}
        >
          {isPausado ? <Play size={18} /> : <Pause size={18} />}
        </button>

        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            } else {
              document.exitFullscreen().catch(() => {});
            }
          }}
          className="p-3 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded-2xl text-white border border-white/10 transition cursor-pointer hover:scale-105 active:scale-95"
          title="Tela Cheia (F)"
          aria-label="Alternar tela cheia"
        >
          <Maximize2 size={18} />
        </button>
      </div>

      {/* QR CODE FLUTUANTE (Canto Inferior Direito) */}
      <div className="absolute bottom-8 right-8 bg-black/30 backdrop-blur-xl p-4 rounded-2xl flex flex-col items-center border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 transition-transform hover:scale-105">
        <div className="bg-white p-2 rounded-xl mb-2 shadow-inner">
          <QRCodeSVG value={urlCamera} size={100} />
        </div>
        <span className="text-white/80 font-medium text-xs tracking-wider uppercase mt-1">Participe</span>
      </div>

    </div>
  );
}