import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, Env } from "@/db";

interface CloudflareEnv extends Env {
  AUTH_GOOGLE_ID?: string;
  AUTH_GOOGLE_SECRET?: string;
  AUTH_SECRET?: string;
}

export const { handlers, auth, signIn, signOut } = NextAuth(async () => {
  let cloudflareEnv: CloudflareEnv | undefined;

  try {
    const ctx = await getCloudflareContext({ async: true });
    cloudflareEnv = ctx.env as CloudflareEnv;
  } catch (e) {
    console.error("Erro ao obter contexto Cloudflare:", e);
  }

  const googleId = cloudflareEnv?.AUTH_GOOGLE_ID || process.env.AUTH_GOOGLE_ID;
  const googleSecret = cloudflareEnv?.AUTH_GOOGLE_SECRET || process.env.AUTH_GOOGLE_SECRET;
  const authSecret = cloudflareEnv?.AUTH_SECRET || process.env.AUTH_SECRET || "FlashFestSuperSecretKey2026!@#";

  const db = cloudflareEnv ? getDb(cloudflareEnv) : null;

  return {
    adapter: db ? DrizzleAdapter(db) : undefined,
    providers: [
      Google({
        clientId: googleId || "",
        clientSecret: googleSecret || "",
      }),
    ],
    secret: authSecret,
    trustHost: true,
    session: {
      strategy: "jwt", 
    },
    // --- A MÁGICA ESTÁ AQUI: Ensinando o Auth.js a repassar o ID ---
    callbacks: {
      jwt({ token, user }) {
        // Se for o momento do login, injeta o ID no token
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      session({ session, token }) {
        // Transfere o ID do token para a sessão que o Dashboard vai usar
        if (session.user && token.id) {
          session.user.id = token.id as string;
        }
        return session;
      }
    }
    // ----------------------------------------------------------------
  };
});