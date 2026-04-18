import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { insertRow } from '@/lib/supabase';
import { FitnessInput } from '@/lib/types';

type PlanRequest = { id: string };

export async function POST(req: Request) {
  try {
    const { input } = (await req.json()) as { input: FitnessInput };
    const data = await insertRow<PlanRequest>('plan_requests', {
      email: input.email,
      payload: input,
      status: 'pending'
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: input.email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: 'ForgeFit AI Full 7-Day Plan' },
            unit_amount: Number(process.env.NEXT_PUBLIC_ONE_TIME_PRICE_CENTS ?? '899')
          },
          quantity: 1
        }
      ],
      metadata: { planRequestId: data.id },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=1`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
