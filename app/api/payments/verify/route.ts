import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { insertRow, selectOne, updateRows } from '@/lib/supabase';
import { generatePlan } from '@/lib/ai';
import { buildPlanPdf } from '@/lib/pdf';
import { Resend } from 'resend';
import { FitnessInput, WeeklyPlan } from '@/lib/types';

type RequestRow = {
  id: string;
  email: string;
  payload: FitnessInput;
  plan_json: WeeklyPlan | null;
};

export async function POST(req: Request) {
  try {
    const { sessionId } = (await req.json()) as { sessionId: string };
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const planRequestId = session.metadata?.planRequestId;
    if (!planRequestId) {
      return NextResponse.json({ error: 'Missing plan request metadata' }, { status: 400 });
    }

    const requestRow = await selectOne<RequestRow>('plan_requests', `?id=eq.${planRequestId}&select=*`);
    const fullPlan = requestRow.plan_json ?? (await generatePlan(requestRow.payload as FitnessInput, false));
    const pdf = Buffer.from(await buildPlanPdf(fullPlan));

    const planRow = await insertRow<{ id: string }>('plans', {
      email: requestRow.email,
      plan_json: fullPlan,
      stripe_session_id: sessionId,
      status: 'paid'
    });

    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'ForgeFit <plans@example.com>',
        to: requestRow.email,
        subject: 'Your ForgeFit AI Full Plan is Ready',
        html: '<p>Your personalized plan is attached as PDF.</p>',
        attachments: [{ filename: 'forgefit-plan.pdf', content: pdf }]
      });
    }

    await updateRows('plan_requests', `?id=eq.${planRequestId}`, { status: 'completed', plan_json: fullPlan });

    return NextResponse.json({
      plan: fullPlan,
      planId: planRow.id,
      pdfBase64: pdf.toString('base64')
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
