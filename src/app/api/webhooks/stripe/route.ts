import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
      env: Env & { STRIPE_SECRET_KEY: string, STRIPE_WEBHOOK_SECRET: string } 
    };

    // --- A CURA 1: Forçar o Stripe a usar o Fetch API da Cloudflare ---
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-07-29.dahlia', 
      httpClient: Stripe.createFetchHttpClient(), 
    });

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Falta assinatura do Webhook' }, { status: 400 });
    }

    // --- A CURA 2: Usar constructEventAsync (compatível com a criptografia da Edge) ---
    const event = await stripe.webhooks.constructEventAsync(body, signature, env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const eventoId = session.client_reference_id;
      
      if (eventoId) {
        // Agora essa chamada de rede vai funcionar perfeitamente
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceIdPago = lineItems.data[0]?.price?.id;

        if (priceIdPago) {
          const db = getDb(env);
          
          await db.update(eventos)
            .set({ 
              statusPagamento: 'pago',
              planoId: priceIdPago 
            })
            .where(eq(eventos.id, eventoId));
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}