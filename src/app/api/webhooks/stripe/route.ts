import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDb, Env } from '@/db';
import { eventos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    // 1. Puxa as senhas do cofre da Cloudflare
    const { env } = (await getCloudflareContext({ async: true })) as unknown as { 
      env: Env & { STRIPE_SECRET_KEY: string, STRIPE_WEBHOOK_SECRET: string } 
    };

    // 2. Prepara o Stripe com as configurações da Cloudflare
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-07-29.dahlia', 
      httpClient: Stripe.createFetchHttpClient(),
    });

    // 3. Verifica a Assinatura (para termos certeza de que quem chamou foi o Stripe e não um hacker)
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Assinatura ausente', { status: 400 });
    }

    const body = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error(`Erro de Assinatura do Webhook: ${err.message}`);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    // 4. Se o pagamento foi concluído, libertamos a festa!
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Apanhamos o ID da festa que enviámos antes
      const eventoId = session.client_reference_id;

      if (eventoId) {
        const db = getDb(env);
        
        // Atualiza o estado no D1 para 'pago'
        await db.update(eventos)
          .set({ statusPagamento: 'pago' })
          .where(eq(eventos.id, eventoId));
          
        console.log(`Festa ${eventoId} libertada com sucesso!`);
      }
    }

    // 5. Diz ao Stripe: "Mensagem recebida, obrigado!"
    return new Response(JSON.stringify({ recebido: true }), { status: 200 });

  } catch (error) {
    console.error("Erro interno no Webhook:", error);
    return new Response("Erro interno do servidor", { status: 500 });
  }
}