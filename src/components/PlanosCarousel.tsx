'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export interface PlanoItem {
  nome: string;
  preco: string;
  fotos: string;
  dias: string;
  ideal: string;
  videos?: boolean;
  destaque?: boolean;
}

interface PlanosCarouselProps {
  planos: PlanoItem[];
  isLogado: boolean;
  loginAction: () => Promise<void>;
}

export default function PlanosCarousel({ planos, isLogado, loginAction }: PlanosCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    // Identifica o card mais próximo do centro da visão
    const cards = Array.from(el.children) as HTMLElement[];
    const containerCenter = scrollLeft + clientWidth / 2;
    let closestIdx = 0;
    let minDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = index;
      }
    });

    setActiveIndex(closestIdx);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollState();
    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);

    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
    };
  }, [checkScrollState]);

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 24 : 360;
    el.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth'
    });
  };

  const scrollToIndex = (index: number) => {
    const el = scrollContainerRef.current;
    if (!el || !el.children[index]) return;

    const targetCard = el.children[index] as HTMLElement;
    const offset = targetCard.offsetLeft - (el.clientWidth - targetCard.offsetWidth) / 2;

    el.scrollTo({
      left: Math.max(0, offset),
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto">
      {/* Botões de Navegação Flutuantes no Desktop */}
      <button
        type="button"
        onClick={() => scrollTo('left')}
        disabled={!canScrollLeft}
        aria-label="Plano anterior"
        className={`hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full items-center justify-center backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
          canScrollLeft
            ? 'bg-zinc-900/90 border-white/20 text-white hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-400 hover:scale-110 active:scale-95'
            : 'bg-zinc-900/40 border-white/5 text-zinc-600 cursor-not-allowed opacity-30'
        }`}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        type="button"
        onClick={() => scrollTo('right')}
        disabled={!canScrollRight}
        aria-label="Próximo plano"
        className={`hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full items-center justify-center backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
          canScrollRight
            ? 'bg-zinc-900/90 border-white/20 text-white hover:bg-emerald-500 hover:text-zinc-950 hover:border-emerald-400 hover:scale-110 active:scale-95'
            : 'bg-zinc-900/40 border-white/5 text-zinc-600 cursor-not-allowed opacity-30'
        }`}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Trilho do Carrossel com Snap Scroll Suave */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pt-10 pb-12 px-4 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden items-stretch"
        style={{ scrollBehavior: 'smooth' }}
      >
        {planos.map((plano, index) => {
          const isGratis = plano.preco === '0';

          return (
            <div
              key={plano.nome}
              className={`snap-center shrink-0 w-[84vw] sm:w-[320px] md:w-[350px] lg:w-[360px] flex flex-col p-8 rounded-[2rem] transition-all duration-500 ${
                plano.destaque
                  ? 'bg-zinc-900/90 backdrop-blur-2xl border-2 border-emerald-500/70 shadow-[0_0_50px_-10px_rgba(52,211,153,0.35)] relative transform md:-translate-y-3 hover:-translate-y-5'
                  : 'bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:bg-zinc-900/60 hover:border-white/20 hover:-translate-y-2'
              }`}
            >
              {plano.destaque && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-zinc-950 text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  Mais Escolhido
                </div>
              )}

              {isGratis && (
                <div className="inline-block self-start mb-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                  Sem Cartão de Crédito
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-zinc-200 mb-3 font-[family-name:var(--font-jakarta)]">
                  Plano {plano.nome}
                </h3>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-lg text-zinc-500 font-medium">R$</span>
                  <span className="text-6xl font-extrabold text-white tracking-tighter font-[family-name:var(--font-jakarta)]">
                    {plano.preco}
                  </span>
                  <span className="text-sm text-zinc-500 font-medium">/evento</span>
                </div>

                <div className="space-y-4 text-sm text-zinc-300 font-light">
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>
                      Até <strong>{plano.fotos} fotos</strong>
                    </span>
                  </div>
                  {plano.videos ? (
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>
                        Suporte a <strong>Vídeos Curtos (15s)</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-zinc-500">
                      <span className="text-zinc-600">✕</span>
                      <span>Sem suporte a vídeos</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>
                      <strong>{plano.dias} {plano.dias === '1' ? 'dia (24h)' : 'dias'}</strong> para baixar memórias
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>Telão, Filtros e QR Code inclusos</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span className="text-zinc-400 font-normal">{plano.ideal}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-10">
                {isLogado ? (
                  <Link
                    href="/dashboard"
                    className={`block w-full py-4 rounded-xl font-semibold text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md ${
                      plano.destaque
                        ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] font-bold'
                        : isGratis
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                    }`}
                  >
                    {isGratis ? 'Testar Gratuitamente' : 'Começar Agora'}
                  </Link>
                ) : (
                  <form action={loginAction} className="w-full">
                    <button
                      type="submit"
                      className={`w-full py-4 rounded-xl font-semibold text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer ${
                        plano.destaque
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] font-bold'
                          : isGratis
                          ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30'
                          : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                      }`}
                    >
                      {isGratis ? 'Testar Gratuitamente' : 'Começar Agora'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicadores de Ponto (Dots) e Navegação Mobile */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          {planos.map((plano, idx) => (
            <button
              key={plano.nome}
              type="button"
              onClick={() => scrollToIndex(idx)}
              aria-label={`Ir para ${plano.nome}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-8 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                  : 'w-2.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Botões para Celular/Tablet */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={() => scrollTo('left')}
            disabled={!canScrollLeft}
            aria-label="Plano anterior"
            className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-zinc-500">
            {activeIndex + 1} de {planos.length}
          </span>
          <button
            type="button"
            onClick={() => scrollTo('right')}
            disabled={!canScrollRight}
            aria-label="Próximo plano"
            className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
