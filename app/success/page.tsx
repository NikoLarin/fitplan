'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { WeeklyPlan } from '@/lib/types';

export default function SuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (!sessionId) return;
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Verification failed');
        setPlan(json.plan);

        const bytes = atob(json.pdfBase64);
        const arr = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
        const blob = new Blob([arr], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'forgefit-plan.pdf';
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [sessionId]);

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-3">Payment successful 🎉</h1>
      {loading && <p>Generating your complete plan and PDF...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {plan && (
        <div className="space-y-3">
          <p>{plan.userSummary}</p>
          <p>PDF download should start automatically. We also emailed it (if email is configured).</p>
        </div>
      )}
    </main>
  );
}
