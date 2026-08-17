import { auth, signOut } from '@/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Puxa a sessão do usuário logado
  const session = await auth();

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Cabeçalho do Painel */}
      <header className="bg-zinc-900 border-b border-zinc-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">
            FlashFest <span className="text-zinc-400 font-normal">Painel</span>
          </h1>
          
          {/* Se estiver logado, mostra a foto, nome e botão de sair */}
          {session?.user && (
            <div className="flex items-center gap-4">
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt="Foto de perfil" 
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer" /* O truque que libera a foto do Google */
                />
              )}
              {/* Mostra apenas o primeiro nome para ficar elegante */}
              <span className="text-sm font-medium text-white">
                Olá, {session.user.name?.split(' ')[0]}
              </span>
              
              <form action={async () => { 'use server'; await signOut(); }}>
                <button type="submit" className="text-xs text-red-400 hover:text-red-300 transition px-2">
                  Sair
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
      
      {/* Área de Conteúdo */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}