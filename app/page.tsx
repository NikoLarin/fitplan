import { Hero } from '@/components/sections/Hero';
import { PlanWizard } from '@/components/wizard/PlanWizard';

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 sm:py-10">
      <section className="mx-auto max-w-6xl space-y-8">
        <Hero />

        <PlanWizard />

        <section className="grid gap-4 md:grid-cols-3">
          <TrustCard quote="I finally stopped overthinking my routine." byline="Beta user" />
          <TrustCard quote="The budget meals were actually realistic." byline="Beta user" />
          <TrustCard quote="Perfect for beginners who want structure." byline="Beta user" />
        </section>
      </section>
    </main>
  );
}

function TrustCard({ quote, byline }: { quote: string; byline: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4">
      <p className="font-semibold">“{quote}”</p>
      <p className="mt-1 text-xs text-muted">— {byline}</p>
    </div>
  );
}
