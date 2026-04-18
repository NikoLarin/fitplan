import { ArrowRight, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-orange-500/10 p-6 sm:p-10">
      <div className="pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full bg-emerald-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl" />

      <div className="relative max-w-4xl space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
          <Sparkles size={14} /> Premium AI Fitness Planner
        </div>
        <h1 className="text-balance text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
          Get Your Personal AI Training & Diet Plan in 60 Seconds — Built for Your Budget & Body.
        </h1>
        <p className="max-w-3xl text-pretty text-base text-muted sm:text-lg">
          No more generic workouts. Answer a few questions and get a custom 7-day plan with workouts, meals, and a grocery list scaled to your real monthly budget.
        </p>

        <div className="flex flex-wrap gap-3">
          <a href="#wizard">
            <Button className="h-11 px-6 text-sm">Start Free Preview <ArrowRight size={16} className="ml-1" /></Button>
          </a>
          <div className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/70 px-4 text-xs text-muted">
            <ShieldCheck size={14} className="text-emerald-300" /> Backed by evidence-based training principles
          </div>
        </div>

        <div className="grid gap-3 pt-2 sm:grid-cols-3">
          <Stat label="Plans Generated" value="500+" />
          <Stat label="Avg. Setup Time" value="~60 sec" />
          <Stat label="One-Time Unlock" value="$8.99" />
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-sm text-muted">
          <Feature text="Build muscle on $80/month groceries." />
          <Feature text="Beginner-friendly with clear progressions." />
          <Feature text="No gym? No problem." />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  );
}

function Feature({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-border/70 bg-card/70 p-3">
      <Trophy size={15} className="text-orange-300" />
      <span>{text}</span>
    </div>
  );
}
