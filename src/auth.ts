import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, Env } from "@/db";

// Ensinamos ao TypeScript que o cofre da Cloudflare contém essas senhas
interface CloudflareEnv extends Env {
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
  AUTH_SECRET: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  // Puxamos o contexto nativo (env), que é onde a Cloudflare guarda os segredos de produção
  const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: CloudflareEnv };
  const db = getDb(env);

  return {
    adapter: DrizzleAdapter(db),
    providers: [
      Google({
        clientId: env.AUTH_GOOGLE_ID,      // Agora puxamos direto do cofre!
        clientSecret: env.AUTH_GOOGLE_SECRET, // Agora puxamos direto do cofre!
      }),
    ],
    secret: env.AUTH_SECRET, // Senha de criptografia puxada do cofre
    trustHost: true,
  };
});