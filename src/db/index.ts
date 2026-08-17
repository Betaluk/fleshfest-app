import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

// Tipagem para o TypeScript reconhecer as variáveis de ambiente da Cloudflare
export interface Env {
  DB: D1Database;
  BUCKET_FOTOS: R2Bucket;
}

// Função que inicia o banco de dados passando as configurações do ambiente
export function getDb(env: Env) {
  return drizzle(env.DB, { schema });
}