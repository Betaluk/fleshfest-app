import Link from 'next/link';

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6">Termos de Uso</h1>
        <p className="mb-4 text-sm text-zinc-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Aceitação dos Termos</h2>
            <p>Ao acessar e usar a plataforma FlashFest, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se não concordar com alguma parte, não utilize nossos serviços.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Uso do Serviço</h2>
            <p>O FlashFest oferece um sistema de captura e projeção de fotos para eventos. O usuário é o único responsável pelo conteúdo (fotos) gerado em seu evento e pelas aprovações no modo de moderação.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Armazenamento e Limpeza</h2>
            <p>As fotos enviadas são armazenadas temporariamente. Nós nos reservamos o direito de excluir permanentemente os arquivos dos eventos após o período de expiração do plano contratado.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Responsabilidade</h2>
            <p>Não nos responsabilizamos por perdas de dados causadas por exclusões efetuadas pelo anfitrião ou pela limpeza automática pós-evento. Faça o download do seu arquivo ZIP dentro do prazo estipulado.</p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-800">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 font-medium">
            &larr; Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}