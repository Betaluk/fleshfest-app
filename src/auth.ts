import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, Env } from "@/db";

// Passamos uma função assíncrona para o NextAuth carregar o Banco D1 dinamicamente
export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
  const db = getDb(env);

  return {
    adapter: DrizzleAdapter(db),
    providers: [
      Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      }),
    ],
    secret: process.env.AUTH_SECRET,
    trustHost: true, // Obrigatório para rodar localmente e na nuvem
  };
});