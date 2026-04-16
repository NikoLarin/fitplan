'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FitnessInput, WeeklyPlan } from '@/lib/types';

const defaults: FitnessInput = {
  email: '',
  age: 28,
  gender: 'male',
  heightCm: 175,
  weightKg: 75,
  fitnessLevel: 'beginner',
  goal: 'lose fat',
  bodyType: 'average',
  equipment: ['dumbbells'],
  trainingDays: 4,
  sessionMinutes: 45,
  dietType: 'omnivore',
  monthlyFoodBudget: 180,
  injuries: ''
};

export function PlanForm() {
  const [input, setInput] = useState<FitnessInput>(defaults);
  const [previewPlan, setPreviewPlan] = useState<WeeklyPlan | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const priceLabel = useMemo(() => {
    const cents = Number(process.env.NEXT_PUBLIC_ONE_TIME_PRICE_CENTS ?? 899);
    return `$${(cents / 100).toFixed(2)}`;
  }, []);

  async function onPreview() {
    setLoadingPreview(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, preview: true })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to generate preview');
      setPreviewPlan(json.plan);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoadingPreview(false);
    }
  }

  async function onCheckout() {
    setLoadingCheckout(true);
    setError(null);
    try {
      const res = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to start checkout');
      window.location.href = json.url;
    } catch (e) {
      setError((e as Error).message);
      setLoadingCheckout(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <Card>
        <h2 className="text-2xl font-bold mb-2">Build your plan</h2>
        <p className="text-muted mb-6">No generic templates. Your goal, body, equipment, schedule, and food budget.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Email" type="email" value={input.email} onChange={(e) => setInput({ ...input, email: e.target.value })} />
          <Input placeholder="Age" type="number" value={input.age} onChange={(e) => setInput({ ...input, age: Number(e.target.value) })} />
          <Select value={input.gender} onChange={(e) => setInput({ ...input, gender: e.target.value })}>
            <option>male</option><option>female</option><option>non-binary</option>
          </Select>
          <Select value={input.fitnessLevel} onChange={(e) => setInput({ ...input, fitnessLevel: e.target.value as FitnessInput['fitnessLevel'] })}>
            <option value="beginner">beginner</option><option value="intermediate">intermediate</option><option value="advanced">advanced</option>
          </Select>
          <Input placeholder="Height (cm)" type="number" value={input.heightCm} onChange={(e) => setInput({ ...input, heightCm: Number(e.target.value) })} />
          <Input placeholder="Weight (kg)" type="number" value={input.weightKg} onChange={(e) => setInput({ ...input, weightKg: Number(e.target.value) })} />
          <Input placeholder="Main goal" value={input.goal} onChange={(e) => setInput({ ...input, goal: e.target.value })} />
          <Input placeholder="Body type / physique" value={input.bodyType} onChange={(e) => setInput({ ...input, bodyType: e.target.value })} />
          <Input placeholder="Equipment (comma-separated)" value={input.equipment.join(', ')} onChange={(e) => setInput({ ...input, equipment: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
          <Input placeholder="Training days / week" type="number" value={input.trainingDays} onChange={(e) => setInput({ ...input, trainingDays: Number(e.target.value) })} />
          <Input placeholder="Minutes per session" type="number" value={input.sessionMinutes} onChange={(e) => setInput({ ...input, sessionMinutes: Number(e.target.value) })} />
          <Select value={input.dietType} onChange={(e) => setInput({ ...input, dietType: e.target.value })}>
            <option>omnivore</option><option>vegetarian</option><option>vegan</option><option>keto</option>
          </Select>
          <Input placeholder="Monthly food budget (USD)" type="number" value={input.monthlyFoodBudget} onChange={(e) => setInput({ ...input, monthlyFoodBudget: Number(e.target.value) })} />
        </div>
        <Textarea className="mt-3" rows={3} placeholder="Injuries or limitations (optional)" value={input.injuries} onChange={(e) => setInput({ ...input, injuries: e.target.value })} />
        <div className="flex flex-wrap gap-3 mt-4">
          <Button onClick={onPreview} disabled={loadingPreview || !input.email}>{loadingPreview ? 'Generating...' : 'Generate Free Preview'}</Button>
          {previewPlan && (
            <Button className="bg-white text-black" onClick={onCheckout} disabled={loadingCheckout}>{loadingCheckout ? 'Redirecting...' : `Unlock Full 7-Day Plan (${priceLabel})`}</Button>
          )}
        </div>
        {error && <p className="text-red-400 mt-3 text-sm">{error}</p>}
      </Card>

      <Card>
        <h3 className="text-xl font-semibold mb-4">Free Preview</h3>
        {!previewPlan && <p className="text-muted">Generate your free preview to see a 3-day sample, calorie targets, and budget-smart meal ideas.</p>}
        {previewPlan && (
          <div className="space-y-3">
            <p className="text-sm text-muted">{previewPlan.userSummary}</p>
            <p className="text-sm">Calories: <strong>{previewPlan.calorieTarget}</strong> | Macros: P{previewPlan.macroTargets.protein}/C{previewPlan.macroTargets.carbs}/F{previewPlan.macroTargets.fats}</p>
            {previewPlan.days.slice(0, 3).map((day) => (
              <div key={day.day} className="rounded-xl border border-border p-3">
                <p className="font-semibold">{day.day}</p>
                <p className="text-sm text-muted">Top workout: {day.workout.exercises[0]?.name ?? 'Recovery day'}</p>
                <p className="text-sm text-muted">Meal sample: {day.meals[0]?.name ?? 'Meal prep day'}</p>
              </div>
            ))}
            <p className="text-xs text-muted">Upgrade for detailed sets/reps, full recipes, grocery list, and downloadable PDF.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
