'use client';

import { useState, useTransition } from 'react';
import { updateDisplayMode } from './actions';
import { useRouter } from 'next/navigation';

export default function DisplayModeToggle({ 
  eventoId, 
  currentMode 
}: { 
  eventoId: string; 
  currentMode: string; 
}) {
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState(currentMode || 'cloud');
  const router = useRouter();

  const handleToggle = (newMode: 'simple' | 'cloud') => {
    if (newMode === mode) return;
    
    // Atualização otimista na interface (muda na hora para o usuário)
    setMode(newMode);
    
    startTransition(async () => {
      const res = await updateDisplayMode(eventoId, newMode);
      if (!res.success) {
        setMode(mode); // Se der erro no banco, volta a chave
        alert('Erro ao alterar o modo de exibição. Tente novamente.');
      } else {
        router.refresh(); // Atualiza a página em segundo plano
      }
    });
  };

  return (
    <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 hover:border-white/20 transition-all duration-500 shadow-xl mb-8">
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-[family-name:var(--font-jakarta)]">Experiência do Telão</h3>
      <p className="text-zinc-400 font-light mb-5 sm:mb-6 text-xs sm:text-sm leading-relaxed">
        Escolha qual estilo visual será exibido no telão da festa. Você pode alterar isso a qualquer momento.
      </p>
      
      <div className="flex bg-black/40 p-1.5 rounded-full border border-white/10 relative gap-1">
        <button
          onClick={() => handleToggle('simple')}
          disabled={isPending}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
            mode === 'simple' 
              ? 'text-white bg-zinc-800 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-base sm:text-lg">🎞️</span>
          <span className="whitespace-nowrap">Slide Simples</span>
        </button>

        <button
          onClick={() => handleToggle('cloud')}
          disabled={isPending}
          className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
            mode === 'cloud' 
              ? 'text-white bg-emerald-500/20 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
          } ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span className="text-base sm:text-lg">🌌</span>
          <span className="whitespace-nowrap">
            Nuvem 3D <span className="hidden sm:inline font-normal text-emerald-400/80">(Premium)</span>
          </span>
        </button>
      </div>
    </div>
  );
}