import { NextResponse } from 'next/server';
import { generatePlan } from '@/lib/ai';
import { FitnessInput } from '@/lib/types';

export async function POST(req: Request) {
  try {
    const { input, preview } = (await req.json()) as { input: FitnessInput; preview?: boolean };
    const plan = await generatePlan(input, preview ?? true);
    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
