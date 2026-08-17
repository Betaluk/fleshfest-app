import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

// 1. Tabela: Usuarios (Os Anfitriões)
export const usuarios = sqliteTable('usuarios', {
  id: text('id').primaryKey(),
  nome: text('nome').notNull(),
  email: text('email').notNull().unique(),
  dataCriacao: integer('data_criacao', { mode: 'timestamp' }).notNull(),
});

// 2. Tabela: Planos
export const planos = sqliteTable('planos', {
  id: text('id').primaryKey(),
  nomePlano: text('nome_plano').notNull(),
  limiteFotos: integer('limite_fotos').notNull(),
  diasExpiracao: integer('dias_expiracao').notNull(),
  preco: integer('preco').notNull(), // Guardaremos o valor em centavos (ex: 9900 = R$ 99,00)
});

// 3. Tabela: Eventos
export const eventos = sqliteTable('eventos', {
  id: text('id').primaryKey(), // Este UUID longo será a base do link do QR Code
  usuarioId: text('usuario_id').notNull().references(() => usuarios.id),
  planoId: text('plano_id').notNull().references(() => planos.id),
  nomeEvento: text('nome_evento').notNull(),
  dataEvento: integer('data_evento', { mode: 'timestamp' }).notNull(),
  muralAtivo: integer('mural_ativo', { mode: 'boolean' }).notNull().default(true),
  modoModeracao: text('modo_moderacao').notNull(), // 'auto' ou 'manual'
  statusPagamento: text('status_pagamento').notNull(), // 'pendente' ou 'pago'
});

// 4. Tabela: Fotos
export const fotos = sqliteTable('fotos', {
  id: text('id').primaryKey(),
  eventoId: text('evento_id').notNull().references(() => eventos.id),
  urlImagem: text('url_imagem').notNull(),
  nomeConvidado: text('nome_convidado'),
  status: text('status').notNull(), // 'pendente', 'aprovada', 'rejeitada'
  dataCaptura: integer('data_captura', { mode: 'timestamp' }).notNull(),
});

// --- TABELAS OBRIGATÓRIAS DO AUTH.JS (NEXTAUTH) ---
import type { AdapterAccountType } from 'next-auth/adapters';

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});