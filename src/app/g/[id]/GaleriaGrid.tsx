'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface FotoGaleriaItem {
  id: string;
  eventoId: string;
  urlImagem: string;
  nomeConvidado?: string | null;
  mensagem?: string | null;
  status: string;
  dataCaptura: string;
  tipoMedia?: string;
}

interface GaleriaGridProps {
  fotos: FotoGaleriaItem[];
  nomeEvento: string;
}

export default function GaleriaGrid({ fotos, nomeEvento }: GaleriaGridProps) {
  const [indiceAtivo, setIndiceAtivo] = useState<number | null>(null);
  const [baixando, setBaixando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // Controle de Swipe Mobile no Lightbox
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const fotoAtual = indiceAtivo !== null ? fotos[indiceAtivo] : null;

  const proximaFoto = useCallback(() => {
    if (fotos.length <= 1) return;
    setIndiceAtivo((atual) => (atual === null ? null : (atual + 1) % fotos.length));
  }, [fotos.length]);

  const fotoAnterior = useCallback(() => {
    if (fotos.length <= 1) return;
    setIndiceAtivo((atual) => (atual === null ? null : (atual - 1 + fotos.length) % fotos.length));
  }, [fotos.length]);

  const fecharLightbox = useCallback(() => {
    setIndiceAtivo(null);
  }, []);

  // Atalhos de teclado e trava de scroll no body
  useEffect(() => {
    if (indiceAtivo === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharLightbox();
      if (e.key === 'ArrowRight') proximaFoto();
      if (e.key === 'ArrowLeft') fotoAnterior();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [indiceAtivo, fecharLightbox, proximaFoto, fotoAnterior]);

  // Gestos de Swipe para Celular
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (diff > minSwipeDistance) {
      proximaFoto(); // Swipe para esquerda -> próxima foto
    } else if (diff < -minSwipeDistance) {
      fotoAnterior(); // Swipe para direita -> foto anterior
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Função para baixar qualquer mídia com segurança e feedback
  const baixarMidia = async (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setBaixando(true);
      const resposta = await fetch(`${url}?download=true`, {
        mode: 'cors',
        cache: 'no-cache',
      });
      const blob = await resposta.blob();
      const urlBlob = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = urlBlob;
      const extensao = url.toLowerCase().includes('.mp4') || blob.type.includes('mp4') ? 'mp4' : 'jpg';
      link.download = `flashfest-${Date.now()}.${extensao}`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) {
      console.error('Erro ao baixar mídia', error);
    } finally {
      setBaixando(false);
    }
  };

  // Compartilhamento nativo ou cópia de link
  const compartilharFoto = async (foto: FotoGaleriaItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lembrança de ${nomeEvento}`,
          text: foto.mensagem ? `"${foto.mensagem}" - Foto de ${nomeEvento}` : `Olha essa lembrança de ${nomeEvento}!`,
          url: foto.urlImagem,
        });
        return;
      } catch (err) {
        // Usuário cancelou ou navegador rejeitou o share nativo; fallback para cópia
      }
    }

    try {
      await navigator.clipboard.writeText(foto.urlImagem);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Ignora erro de clipboard se bloqueado
    }
  };

  if (fotos.length === 0) {
    return (
      <div className="text-center py-24 text-zinc-500 flex flex-col items-center">
        <span className="text-5xl mb-4 opacity-50">📷</span>
        <p className="text-lg font-medium text-zinc-400">Nenhuma foto disponível para exibição no momento.</p>
        <p className="text-sm text-zinc-600 mt-1">As fotos enviadas pelos convidados aparecerão aqui.</p>
      </div>
    );
  }

  return (
    <>
      {/* GRID MASONRY INTERATIVO */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {fotos.map((foto, index) => {
          const isVideo = foto.tipoMedia === 'video';

          return (
            <div
              key={foto.id}
              onClick={() => setIndiceAtivo(index)}
              className="relative group break-inside-avoid rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/80 cursor-pointer shadow-md hover:shadow-2xl hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIndiceAtivo(index);
                }
              }}
              title="Clique para ver em tela cheia"
            >
              {/* BADGE DE TIPO OU MENSAGEM */}
              <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 pointer-events-none">
                {isVideo && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white rounded-lg border border-white/10 flex items-center gap-1 shadow">
                    <span>📹</span> Vídeo
                  </span>
                )}
                {foto.mensagem && !isVideo && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-black/70 backdrop-blur-md text-amber-300 rounded-lg border border-amber-500/20 flex items-center gap-1 shadow">
                    <span>💬</span> Recado
                  </span>
                )}
              </div>

              {/* MÍDIA */}
              {isVideo ? (
                <video
                  src={foto.urlImagem}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-contain bg-black transform group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={foto.urlImagem}
                  alt={`Lembrança de ${nomeEvento}`}
                  className="w-full h-auto object-contain bg-black transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              )}

              {/* OVERLAY COM INFORMAÇÕES E BOTÃO DE DOWNLOAD */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                {foto.mensagem && (
                  <p className="text-xs text-white line-clamp-2 mb-2 font-light drop-shadow">
                    💬 &ldquo;{foto.mensagem}&rdquo;
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-300 font-medium truncate pr-2">
                    {foto.nomeConvidado ? `👤 ${foto.nomeConvidado}` : 'FlashFest'}
                  </span>
                  <button
                    onClick={(e) => baixarMidia(foto.urlImagem, e)}
                    disabled={baixando}
                    className="p-2 rounded-full bg-white/20 hover:bg-emerald-500 hover:text-zinc-950 text-white backdrop-blur-md transition-all shadow-md active:scale-95"
                    title="Baixar foto"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Botão de download permanente no mobile para facilitar acesso ao toque */}
              <div className="md:hidden absolute bottom-2 right-2 z-10">
                <button
                  onClick={(e) => baixarMidia(foto.urlImagem, e)}
                  disabled={baixando}
                  className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 active:scale-90 transition"
                  title="Baixar foto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL LIGHTBOX FULLSCREEN */}
      {fotoAtual !== null && indiceAtivo !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between select-none animate-fade-in"
          onClick={fecharLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* TOAST FEEDBACK DE LINK COPIADO */}
          {copiado && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-full shadow-2xl flex items-center gap-1.5 animate-bounce">
              <span>✓</span> Link da foto copiado!
            </div>
          )}

          {/* BARRA SUPERIOR DO LIGHTBOX */}
          <div
            className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent relative z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CONTADOR */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300">
                {indiceAtivo + 1} de {fotos.length}
              </span>
              {fotoAtual.tipoMedia === 'video' && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  Vídeo
                </span>
              )}
            </div>

            {/* AÇÕES DA BARRA SUPERIOR */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* BOTÃO COMPARTILHAR */}
              <button
                onClick={() => compartilharFoto(fotoAtual)}
                className="p-2.5 sm:px-4 sm:py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700 transition flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                title="Compartilhar foto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                  <polyline points="16 6 12 2 8 6"></polyline>
                  <line x1="12" y1="2" x2="12" y2="15"></line>
                </svg>
                <span className="hidden sm:inline">Compartilhar</span>
              </button>

              {/* BOTÃO DOWNLOAD */}
              <button
                onClick={(e) => baixarMidia(fotoAtual.urlImagem, e)}
                disabled={baixando}
                className="p-2.5 sm:px-4 sm:py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 disabled:opacity-50"
                title="Baixar em alta resolução"
              >
                {baixando ? (
                  <span className="animate-spin text-sm">⏳</span>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                )}
                <span className="hidden sm:inline">{baixando ? 'Baixando...' : 'Baixar'}</span>
              </button>

              {/* BOTÃO FECHAR */}
              <button
                onClick={fecharLightbox}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10 cursor-pointer hover:rotate-90 duration-200"
                title="Fechar (Esc)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* ÁREA CENTRAL COM NAVEGAÇÃO E MÍDIA */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 min-h-0">
            {/* SETA ANTERIOR */}
            {fotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fotoAnterior();
                }}
                className="absolute left-2 sm:left-6 z-30 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="Foto anterior (Seta esquerda)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}

            {/* CONTAINER DA MÍDIA */}
            <div
              className="relative max-h-full max-w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {fotoAtual.tipoMedia === 'video' ? (
                <video
                  key={fotoAtual.id}
                  src={fotoAtual.urlImagem}
                  controls
                  autoPlay
                  playsInline
                  loop
                  className="max-h-[70vh] sm:max-h-[76vh] max-w-[92vw] sm:max-w-4xl rounded-2xl shadow-2xl object-contain bg-black"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={fotoAtual.id}
                  src={fotoAtual.urlImagem}
                  alt={fotoAtual.mensagem || `Lembrança de ${nomeEvento}`}
                  className="max-h-[70vh] sm:max-h-[76vh] max-w-[92vw] sm:max-w-4xl rounded-2xl shadow-2xl object-contain transition-transform duration-300"
                />
              )}
            </div>

            {/* SETA PRÓXIMA */}
            {fotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  proximaFoto();
                }}
                className="absolute right-2 sm:right-6 z-30 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="Próxima foto (Seta direita)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </div>

          {/* BARRA INFERIOR COM DETALHES DA FOTO / RECADO */}
          <div
            className="p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent relative z-20 flex flex-col items-center text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {(fotoAtual.nomeConvidado || fotoAtual.mensagem) ? (
              <div className="max-w-xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl mb-2">
                {fotoAtual.nomeConvidado && (
                  <p className="text-xs font-bold text-emerald-400 mb-1 flex items-center justify-center gap-1.5">
                    <span>👤</span> {fotoAtual.nomeConvidado}
                  </p>
                )}
                {fotoAtual.mensagem && (
                  <p className="text-sm sm:text-base text-white font-medium italic">
                    &ldquo;{fotoAtual.mensagem}&rdquo;
                  </p>
                )}
              </div>
            ) : (
              <div className="text-xs text-zinc-500 mb-1">
                Lembrança registrada no telão
              </div>
            )}

            <p className="text-[11px] text-zinc-500 hidden sm:block">
              Dica: Use as setas <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">←</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">→</kbd> do teclado para navegar ou <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">Esc</kbd> para fechar
            </p>
          </div>
        </div>
      )}
    </>
  );
}
