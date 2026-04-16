'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type DashPlan = { id: string; created_at: string; plan_json: { title: string; userSummary: string } };

export default function DashboardPage() {
  const [email, setEmail] = useState('');
  const [plans, setPlans] = useState<DashPlan[]>([]);

  async function loadPlans() {
    const res = await fetch(`/api/dashboard?email=${encodeURIComponent(email)}`);
    const json = await res.json();
    if (res.ok) setPlans(json.plans);
  }

  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Your ForgeFit Plans</h1>
      <div className="flex gap-3">
        <Input placeholder="Enter your purchase email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={loadPlans}>Load</Button>
      </div>
      <div className="space-y-3">
        {plans.map((p) => (
          <div key={p.id} className="glass rounded-xl p-4">
            <p className="font-semibold">{p.plan_json.title}</p>
            <p className="text-sm text-muted">{new Date(p.created_at).toLocaleString()}</p>
            <p className="text-sm">{p.plan_json.userSummary}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
