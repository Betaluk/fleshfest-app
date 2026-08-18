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

  // Pega as variáveis do contexto da Cloudflare ou do process.env
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
      strategy: "jwt", // Usa JWT na Edge/Cloudflare para garantir estabilidade
    },
  };
});