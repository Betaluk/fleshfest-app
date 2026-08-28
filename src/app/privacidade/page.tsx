import Link from 'next/link';

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 py-20 px-6">
      <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-800 p-10 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-6">Política de Privacidade</h1>
        <p className="mb-4 text-sm text-zinc-500">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Informações que Coletamos</h2>
            <p>Coletamos informações básicas de perfil quando você faz login via Google (Nome, E-mail e Foto de Perfil) exclusivamente para criar e gerenciar a sua conta na plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Privacidade das Fotos</h2>
            <p>As fotos capturadas nos eventos são de propriedade do anfitrião. Elas são armazenadas em infraestrutura segura mediante URLs criptografadas e não são indexadas por motores de busca ou expostas em galerias públicas globais.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Compartilhamento de Dados</h2>
            <p>Nós não vendemos, alugamos ou compartilhamos seus dados pessoais ou as fotos dos seus eventos com terceiros para fins publicitários ou comerciais.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Exclusão de Dados</h2>
            <p>O anfitrião tem o direito de excluir imagens individualmente no painel de moderação ou solicitar a exclusão completa da sua conta e de todos os dados associados a qualquer momento.</p>
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