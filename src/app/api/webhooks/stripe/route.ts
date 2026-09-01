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

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-07-29.dahlia', // Mantemos a versão que o seu projeto já utiliza
    });

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Falta assinatura do Webhook' }, { status: 400 });
    }

    // O "Segurança" verificando se a mensagem veio mesmo da Stripe
    const event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);

    // Se o pagamento foi concluído com sucesso...
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const eventoId = session.client_reference_id;
      
      if (eventoId) {
        // Truque Mestre: Busca na Stripe qual foi o produto exato (Price ID) que o cliente acabou de pagar
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceIdPago = lineItems.data[0]?.price?.id;

        if (priceIdPago) {
          const db = getDb(env);
          
          // Libera o evento e atrela ele às regras de limite do plano escolhido!
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