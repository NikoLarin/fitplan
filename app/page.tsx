import { Dumbbell, Wallet, Zap } from 'lucide-react';
import { PlanForm } from '@/components/plan-form';

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-8">
      <section className="mx-auto max-w-6xl space-y-8">
        <div className="text-center space-y-4">
          <p className="inline-flex rounded-full border border-primary/50 px-3 py-1 text-xs">ForgeFit AI • Personalized on your budget</p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">Custom training + diet plans in 60 seconds.</h1>
          <p className="text-muted max-w-3xl mx-auto">Get a custom training + diet plan based on your goals, body, equipment & budget — for under $10. Beginner-friendly, practical, and built for real life.</p>
          <div className="flex items-center justify-center gap-5 text-sm text-muted">
            <span className="inline-flex items-center gap-1"><Zap size={14} /> AI-personalized</span>
            <span className="inline-flex items-center gap-1"><Wallet size={14} /> Budget-aware meals</span>
            <span className="inline-flex items-center gap-1"><Dumbbell size={14} /> Equipment-specific workouts</span>
          </div>
        </div>

        <PlanForm />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="glass rounded-2xl p-4"><p className="font-semibold">"Finally, a plan I can afford."</p><p className="text-sm text-muted">— Social proof placeholder</p></div>
          <div className="glass rounded-2xl p-4"><p className="font-semibold">"No more random YouTube workouts."</p><p className="text-sm text-muted">— Social proof placeholder</p></div>
          <div className="glass rounded-2xl p-4"><p className="font-semibold">"Clear meals, clear progress."</p><p className="text-sm text-muted">— Social proof placeholder</p></div>
        </div>

        <p className="text-xs text-muted text-center">Not medical advice. Consult a qualified physician before starting exercise or nutrition changes.</p>
      </section>
    </main>
  );
}
