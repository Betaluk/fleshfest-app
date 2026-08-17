import { NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { sql } from 'drizzle-orm';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Pega os seus dados logados do Google
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ erro: "Por favor, faça login no painel primeiro." }, { status: 401 });
    }

    // 2. Conecta ao Banco D1 garantidamente ativo
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
    const db = getDb(env);

    // 3. Força a criação do Plano na tabela 'planos'
    await db.run(sql`
      INSERT OR IGNORE INTO planos (id, nome_plano, limite_fotos, dias_expiracao, preco) 
      VALUES ('plano-falso', 'Plano Padrão', 500, 2, 0)
    `);

    // 4. Força a criação do seu Usuário na tabela original 'usuarios'
    await db.run(sql`
      INSERT OR IGNORE INTO usuarios (id, nome, email) 
      VALUES (${session.user.id}, ${session.user.name}, ${session.user.email})
    `);

    return NextResponse.json({
      sucesso: true,
      mensagem: "Banco de dados curado com sucesso! As chaves estrangeiras agora existem.",
      usuarioId: session.user.id
    });
  } catch (error: any) {
    return NextResponse.json({ erro: error.message, stack: error.stack }, { status: 500 });
  }
}