'use client';

import { useState, useEffect } from 'react';

export default function BotaoExcluir({
  isPago,
  nomeEvento,
}: {
  isPago: boolean;
  nomeEvento: string;
}) {
  const [modalAberto, setModalAberto] = useState(false);
  const [contador, setContador] = useState(5);
  const [carregando, setCarregando] = useState(false);

  // Lógica do temporizador de 5 segundos
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (modalAberto && contador > 0) {
      timer = setTimeout(() => setContador(contador - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [modalAberto, contador]);

  // Função que decide o que fazer ao clicar no Lixo principal
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); 
    
    if (!isPago) {
      // Eventos Pendentes
      if (window.confirm(`Tem certeza que deseja excluir o evento pendente "${nomeEvento}"?`)) {
        setCarregando(true);
        const form = e.currentTarget.closest('form');
        if (form) form.requestSubmit();
      }
    } else {
      // Eventos Pagos
      setContador(5);
      setModalAberto(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm transition flex items-center justify-center h-full"
        title="Excluir Evento"
        disabled={carregando}
      >
        {carregando ? '⏳' : '🗑️ Excluir'}
      </button>

      {/* O Modal Dramático de Segurança */}
      {modalAberto && isPago && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-red-900/50 rounded-xl p-6 max-w-md w-full shadow-2xl">
            
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-white mb-2">Ação Irreversível!</h3>
              <p className="text-zinc-400">
                Está prestes a excluir permanentemente a festa <strong>{nomeEvento}</strong>.
              </p>
              <div className="text-red-400 text-sm mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left space-y-2">
                <p>• <strong>Todas as fotos</strong> transferidas pelos convidados serão destruídas.</p>
                <p>• O telão em tempo real deixará de funcionar imediatamente.</p>
                <p>• O valor pago <strong>não será reembolsado</strong>.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="flex-1 px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition"
                disabled={carregando}
              >
                Cancelar
              </button>

              {/* A CORREÇÃO ESTÁ AQUI: Botão modificado para enviar manualmente */}
              <button
                type="button" // Mudamos de "submit" para "button"
                disabled={contador > 0 || carregando}
                onClick={(e) => {
                  setCarregando(true);
                  // Disparamos o formulário manualmente via JavaScript
                  const form = e.currentTarget.closest('form');
                  if (form) form.requestSubmit();
                }}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center"
              >
                {contador > 0 ? `Aguarde (${contador}s)` : 'Sim, Excluir Festa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}