'use server';

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateDisplayMode(eventoId: string, mode: 'simple' | 'cloud') {
  try {
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { env: Env };
    const db = getDb(env);

    await db.update(eventos)
      .set({ displayMode: mode })
      .where(eq(eventos.id, eventoId));

    // Atualiza o cache da página atual e da página do telão
    revalidatePath(`/dashboard/evento/${eventoId}`);
    revalidatePath(`/e/${eventoId}/telao`);
    
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar modo de exibição:', error);
    return { success: false };
  }
}