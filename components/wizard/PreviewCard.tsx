import { WeeklyPlan } from '@/lib/types';

type DraftPreview = {
  goal: string;
  trainingDays: number;
  sessionMinutes: number;
  dietType: string;
  monthlyFoodBudget: number;
  equipment: string[];
};

export function PreviewCard({ previewPlan, draft }: { previewPlan: WeeklyPlan | null; draft: DraftPreview }) {
  const estCalories = Math.max(1600, 2100 + (draft.goal.toLowerCase().includes('muscle') ? 250 : -200));
  const estimatedDayCost = (draft.monthlyFoodBudget / 30).toFixed(2);

  return (
    <aside className="sticky top-6 rounded-3xl border border-border/70 bg-gradient-to-b from-card to-card/60 p-5">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-300">Live Plan Preview</p>

      <div className="space-y-3">
        <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
          <p className="text-sm text-muted">Goal</p>
          <p className="font-semibold capitalize">{draft.goal || 'General fitness improvement'}</p>
          <p className="mt-2 text-sm text-muted">Estimated calories</p>
          <p className="font-semibold">~{previewPlan?.calorieTarget ?? estCalories} kcal/day</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <MiniMetric title="Days" value={String(draft.trainingDays)} />
          <MiniMetric title="Minutes" value={String(draft.sessionMinutes)} />
          <MiniMetric title="Budget/day" value={`$${estimatedDayCost}`} />
        </div>

        <div className="rounded-2xl border border-border/70 bg-background/40 p-4">
          <p className="text-sm font-semibold">Weekly rhythm</p>
          <p className="text-sm text-muted">{previewPlan?.weeklySplit ?? `${draft.trainingDays} focused sessions + recovery + mobility`}</p>
          <p className="mt-2 text-sm text-muted">Equipment:</p>
          <p className="text-sm">{draft.equipment.length ? draft.equipment.join(', ') : 'Bodyweight only'}</p>
          <p className="mt-2 text-sm text-muted">Diet style:</p>
          <p className="text-sm capitalize">{draft.dietType}</p>
        </div>

        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
          <p className="text-sm font-semibold">What unlock includes</p>
          <ul className="mt-2 space-y-1 text-xs text-muted">
            <li>• 7-day workouts with sets, reps, rest, and form cues</li>
            <li>• Full meal plan + recipes + macro breakdown</li>
            <li>• Grocery list matched to your budget</li>
            <li>• Downloadable PDF + email delivery</li>
          </ul>
        </div>

        {previewPlan && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Your generated teaser days</p>
            {previewPlan.days.slice(0, 3).map((day) => (
              <div key={day.day} className="rounded-xl border border-border/70 bg-background/40 p-3 text-sm">
                <p className="font-semibold">{day.day}</p>
                <p className="text-muted">{day.workout.exercises[0]?.name ?? 'Active recovery'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

function MiniMetric({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-2">
      <p className="text-[10px] uppercase tracking-wider text-muted">{title}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
