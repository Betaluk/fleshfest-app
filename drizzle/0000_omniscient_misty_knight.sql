CREATE TABLE `eventos` (
	`id` text PRIMARY KEY NOT NULL,
	`usuario_id` text NOT NULL,
	`plano_id` text NOT NULL,
	`nome_evento` text NOT NULL,
	`data_evento` integer NOT NULL,
	`mural_ativo` integer DEFAULT true NOT NULL,
	`modo_moderacao` text NOT NULL,
	`status_pagamento` text NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`plano_id`) REFERENCES `planos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `fotos` (
	`id` text PRIMARY KEY NOT NULL,
	`evento_id` text NOT NULL,
	`url_imagem` text NOT NULL,
	`nome_convidado` text,
	`status` text NOT NULL,
	`data_captura` integer NOT NULL,
	FOREIGN KEY (`evento_id`) REFERENCES `eventos`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `planos` (
	`id` text PRIMARY KEY NOT NULL,
	`nome_plano` text NOT NULL,
	`limite_fotos` integer NOT NULL,
	`dias_expiracao` integer NOT NULL,
	`preco` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usuarios` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`email` text NOT NULL,
	`data_criacao` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `usuarios_email_unique` ON `usuarios` (`email`);