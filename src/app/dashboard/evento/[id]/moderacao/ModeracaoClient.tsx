'use client';

import { useState, useEffect, useCallback, useTransition } from 'react';

export interface MidiaModeracao {
  id: string;
  eventoId: string;
  urlImagem: string;
  chaveFicheiro: string;
  nomeConvidado?: string | null;
  mensagem?: string | null;
  status: 'pendente' | 'aprovada' | string;
  dataCaptura: string;
  tipoMedia?: string;
}

interface ModeracaoClientProps {
  fotosPendentes: MidiaModeracao[];
  fotosAprovadas: MidiaModeracao[];
  nomeEvento: string;
  aprovarFotoAction: (formData: FormData) => Promise<void>;
  rejeitarFotoAction: (formData: FormData) => Promise<void>;
  aprovarTodasAction: () => Promise<void>;
}

export default function ModeracaoClient({
  fotosPendentes,
  fotosAprovadas,
  nomeEvento,
  aprovarFotoAction,
  rejeitarFotoAction,
  aprovarTodasAction,
}: ModeracaoClientProps) {
  // Lista ativa para o modal (pendentes ou aprovadas) e índice
  const [listaModal, setListaModal] = useState<'pendentes' | 'aprovadas' | null>(null);
  const [indiceModal, setIndiceModal] = useState<number>(0);
  const [isPending, startTransition] = useTransition();
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  const fotosAtuais = listaModal === 'pendentes' ? fotosPendentes : fotosAprovadas;
  const fotoModal = listaModal !== null && fotosAtuais.length > 0 ? fotosAtuais[indiceModal] : null;

  const fecharModal = useCallback(() => {
    setListaModal(null);
  }, []);

  const proximaMidia = useCallback(() => {
    if (fotosAtuais.length <= 1) return;
    setIndiceModal((atual) => (atual + 1) % fotosAtuais.length);
  }, [fotosAtuais.length]);

  const midiaAnterior = useCallback(() => {
    if (fotosAtuais.length <= 1) return;
    setIndiceModal((atual) => (atual - 1 + fotosAtuais.length) % fotosAtuais.length);
  }, [fotosAtuais.length]);

  // Teclado no modal
  useEffect(() => {
    if (!fotoModal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fecharModal();
      if (e.key === 'ArrowRight') proximaMidia();
      if (e.key === 'ArrowLeft') midiaAnterior();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fotoModal, fecharModal, proximaMidia, midiaAnterior]);

  // Se a foto modal for removida por aprovação/rejeição, ajusta o índice
  useEffect(() => {
    if (listaModal !== null && fotosAtuais.length === 0) {
      fecharModal();
    } else if (indiceModal >= fotosAtuais.length) {
      setIndiceModal(Math.max(0, fotosAtuais.length - 1));
    }
  }, [fotosAtuais.length, indiceModal, listaModal, fecharModal]);

  // Funções de Ação com transição fluida
  const handleAprovar = (foto: MidiaModeracao, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProcessandoId(foto.id);
    const formData = new FormData();
    formData.append('fotoId', foto.id);

    startTransition(async () => {
      try {
        await aprovarFotoAction(formData);
      } finally {
        setProcessandoId(null);
      }
    });
  };

  const handleRejeitar = (foto: MidiaModeracao, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setProcessandoId(foto.id);
    const formData = new FormData();
    formData.append('fotoId', foto.id);
    formData.append('chaveFicheiro', foto.chaveFicheiro);

    startTransition(async () => {
      try {
        await rejeitarFotoAction(formData);
      } finally {
        setProcessandoId(null);
      }
    });
  };

  const handleAprovarTodas = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      await aprovarTodasAction();
      fecharModal();
    });
  };

  return (
    <div className="space-y-10">
      {/* 1. FILA DE APROVAÇÃO PENDENTE */}
      {fotosPendentes.length > 0 && (
        <section className="bg-zinc-900/60 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl bg-amber-500/10 p-2.5 rounded-2xl border border-amber-500/20 shadow-sm">⏳</span>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-amber-400">Fila de Aprovação ({fotosPendentes.length})</h3>
                <p className="text-xs sm:text-sm text-zinc-400">Toque em qualquer foto para ampliar e inspecionar detalhes</p>
              </div>
            </div>

            <button
              onClick={handleAprovarTodas}
              disabled={isPending}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              <span>✅</span>
              <span>{isPending ? 'Processando...' : `Aprovar Todas (${fotosPendentes.length})`}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {fotosPendentes.map((foto, index) => {
              const estaProcessando = processandoId === foto.id;
              const isVideo = foto.tipoMedia === 'video';

              return (
                <div
                  key={foto.id}
                  onClick={() => {
                    setListaModal('pendentes');
                    setIndiceModal(index);
                  }}
                  className="relative group rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-400/50 bg-black aspect-[3/4] shadow-lg flex flex-col justify-end cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  title="Clique para inspecionar em tela cheia"
                >
                  {/* MÍDIA */}
                  {isVideo ? (
                    <video
                      src={foto.urlImagem}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain absolute inset-0"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={foto.urlImagem}
                      alt="Pendente de moderação"
                      className="w-full h-full object-contain absolute inset-0"
                      loading="lazy"
                    />
                  )}

                  {/* BADGES NO TOPO */}
                  <div className="absolute top-2 inset-x-2 z-10 flex items-center justify-between gap-1 pointer-events-none">
                    <span className="text-[10px] bg-amber-500/80 backdrop-blur-md text-zinc-950 font-bold px-2 py-0.5 rounded-md shadow">
                      {isVideo ? '📹 Vídeo' : '⏳ Pendente'}
                    </span>
                    <span className="text-[10px] bg-black/60 backdrop-blur-md text-zinc-300 px-1.5 py-0.5 rounded-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      🔍 Ampliar
                    </span>
                  </div>

                  {/* RECADO DO CONVIDADO */}
                  {foto.mensagem && (
                    <div className="absolute top-8 inset-x-2 z-10 pointer-events-none">
                      <p className="text-[11px] bg-black/85 backdrop-blur-md text-zinc-200 px-2.5 py-1 rounded-xl line-clamp-2 border border-white/10 shadow">
                        💬 {foto.mensagem}
                      </p>
                    </div>
                  )}

                  {/* BARRA DE AÇÕES INFERIOR */}
                  <div className="relative z-20 w-full p-2.5 bg-gradient-to-t from-black via-black/80 to-transparent flex gap-2">
                    <button
                      onClick={(e) => handleAprovar(foto, e)}
                      disabled={estaProcessando}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold py-2 rounded-xl shadow-md transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {estaProcessando ? <span className="animate-spin">⏳</span> : <span>✓</span>}
                      <span>Aprovar</span>
                    </button>
                    <button
                      onClick={(e) => handleRejeitar(foto, e)}
                      disabled={estaProcessando}
                      className="flex-1 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-xl shadow-md transition flex items-center justify-center gap-1 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      {estaProcessando ? <span className="animate-spin">⏳</span> : <span>✕</span>}
                      <span>Rejeitar</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. GALERIA DE MÍDIAS APROVADAS */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>✅</span> Galeria Ativa no Telão ({fotosAprovadas.length})
          </h3>
        </div>

        {fotosAprovadas.length === 0 ? (
          <div className="bg-zinc-900/40 border border-white/10 rounded-3xl p-12 text-center text-zinc-400">
            Ainda não há mídias aprovadas para esta festa.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fotosAprovadas.map((foto, index) => {
              const estaProcessando = processandoId === foto.id;
              const isVideo = foto.tipoMedia === 'video';

              return (
                <div
                  key={foto.id}
                  onClick={() => {
                    setListaModal('aprovadas');
                    setIndiceModal(index);
                  }}
                  className="relative group rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 bg-black aspect-[3/4] shadow-md cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                  title="Clique para inspecionar em tela cheia"
                >
                  {/* MÍDIA */}
                  {isVideo ? (
                    <video
                      src={foto.urlImagem}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={foto.urlImagem}
                      alt="Aprovada"
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  )}

                  {/* RECADO DO CONVIDADO */}
                  {foto.mensagem && (
                    <div className="absolute bottom-2 inset-x-2 z-10 pointer-events-none">
                      <p className="text-[10px] bg-black/80 backdrop-blur-md text-zinc-300 px-2 py-0.5 rounded-md truncate border border-white/10">
                        💬 {foto.mensagem}
                      </p>
                    </div>
                  )}

                  {/* BOTÃO EXCLUIR */}
                  <button
                    onClick={(e) => handleRejeitar(foto, e)}
                    disabled={estaProcessando}
                    className="absolute top-2 right-2 bg-black/80 hover:bg-red-600 text-white p-2 rounded-xl transition border border-white/10 backdrop-blur-md cursor-pointer z-20 active:scale-90"
                    title="Excluir Mídia"
                  >
                    {estaProcessando ? '⏳' : '🗑️'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. MODAL DE INSPEÇÃO / ZOOM EM ALTA RESOLUÇÃO */}
      {fotoModal !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between select-none animate-fade-in"
          onClick={fecharModal}
        >
          {/* HEADER DO INSPETOR */}
          <div
            className="flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/80 to-transparent relative z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                fotoModal.status === 'pendente'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {fotoModal.status === 'pendente' ? '⏳ Pendente de Aprovação' : '✅ Ativa no Telão'}
              </span>
              <span className="text-xs text-zinc-400">
                {indiceModal + 1} de {fotosAtuais.length}
              </span>
            </div>

            <button
              onClick={fecharModal}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10 cursor-pointer hover:rotate-90 duration-200"
              title="Fechar (Esc)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* ÁREA CENTRAL DE MÍDIA COM SETAS */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 min-h-0">
            {fotosAtuais.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  midiaAnterior();
                }}
                className="absolute left-2 sm:left-6 z-30 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="Anterior (Seta esquerda)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
            )}

            <div
              className="relative max-h-full max-w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {fotoModal.tipoMedia === 'video' ? (
                <video
                  key={fotoModal.id}
                  src={fotoModal.urlImagem}
                  controls
                  autoPlay
                  playsInline
                  loop
                  className="max-h-[68vh] sm:max-h-[74vh] max-w-[92vw] sm:max-w-4xl rounded-2xl shadow-2xl object-contain bg-black"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={fotoModal.id}
                  src={fotoModal.urlImagem}
                  alt="Inspeção de mídia"
                  className="max-h-[68vh] sm:max-h-[74vh] max-w-[92vw] sm:max-w-4xl rounded-2xl shadow-2xl object-contain"
                />
              )}
            </div>

            {fotosAtuais.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  proximaMidia();
                }}
                className="absolute right-2 sm:right-6 z-30 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                title="Próxima (Seta direita)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            )}
          </div>

          {/* FOOTER DO INSPETOR COM RECADO E BOTÕES DE AÇÃO RÁPIDA */}
          <div
            className="p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent relative z-20 flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {(fotoModal.nomeConvidado || fotoModal.mensagem) && (
              <div className="max-w-xl bg-zinc-900/90 border border-white/10 backdrop-blur-xl px-5 py-2.5 rounded-2xl shadow-2xl text-center">
                {fotoModal.nomeConvidado && (
                  <p className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                    <span>👤</span> {fotoModal.nomeConvidado}
                  </p>
                )}
                {fotoModal.mensagem && (
                  <p className="text-sm text-white italic mt-0.5">
                    &ldquo;{fotoModal.mensagem}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* BOTÕES DE APROVAÇÃO/REJEIÇÃO DENTRO DO MODAL */}
            <div className="flex items-center gap-3 w-full max-w-md">
              {fotoModal.status === 'pendente' ? (
                <>
                  <button
                    onClick={() => {
                      handleAprovar(fotoModal);
                      proximaMidia();
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>✓</span> Aprovar e Próxima
                  </button>
                  <button
                    onClick={() => {
                      handleRejeitar(fotoModal);
                      proximaMidia();
                    }}
                    className="flex-1 py-3 px-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>✕</span> Rejeitar
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleRejeitar(fotoModal);
                    proximaMidia();
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                >
                  <span>🗑️</span> Excluir Mídia do Telão
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
