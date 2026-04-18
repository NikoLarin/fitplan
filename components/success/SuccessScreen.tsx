import { WeeklyPlan } from '@/lib/types';

export function SuccessScreen({ plan }: { plan: WeeklyPlan | null }) {
  return (
    <div className="space-y-4 rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-6">
      <h2 className="text-2xl font-bold">Your plan is ready ✅</h2>
      <p className="text-sm text-muted">PDF download should start automatically, and we’ll email a copy if email delivery is configured.</p>

      {plan && (
        <>
          <div className="rounded-xl border border-border/70 bg-card/70 p-4 text-sm">
            <p className="font-semibold">{plan.title}</p>
            <p className="text-muted">{plan.userSummary}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="Calories" value={`${plan.calorieTarget}`} />
            <Metric label="Protein" value={`${plan.macroTargets.protein}g`} />
            <Metric label="Carbs" value={`${plan.macroTargets.carbs}g`} />
          </div>
        </>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/70 p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
