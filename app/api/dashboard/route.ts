import { NextResponse } from 'next/server';
import { selectMany } from '@/lib/supabase';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    const plans = await selectMany('plans', `?email=eq.${encodeURIComponent(email)}&select=id,created_at,plan_json&order=created_at.desc`);
    return NextResponse.json({ plans });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
