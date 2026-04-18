'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FitnessInput, WeeklyPlan } from '@/lib/types';
import { PreviewCard } from './PreviewCard';
import { PricingUnlock } from './PricingUnlock';

const steps = ['Profile', 'Training', 'Nutrition', 'Preview'];

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

export function PlanWizard() {
  const [input, setInput] = useState<FitnessInput>(defaults);
  const [step, setStep] = useState(0);
  const [previewPlan, setPreviewPlan] = useState<WeeklyPlan | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = ((step + 1) / steps.length) * 100;
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
      setStep(3);
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
    <section id="wizard" className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <div className="rounded-3xl border border-border/70 bg-card/70 p-5 sm:p-7">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>Guided consultation</span>
            <span>Step {step + 1} / {steps.length}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-background/70">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm font-semibold">{steps[step]}</p>
        </div>

        {step === 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Input placeholder="Email" type="email" value={input.email} onChange={(e) => setInput({ ...input, email: e.target.value })} />
            <Input placeholder="Age" type="number" value={input.age} onChange={(e) => setInput({ ...input, age: Number(e.target.value) })} />
            <Select value={input.gender} onChange={(e) => setInput({ ...input, gender: e.target.value })}>
              <option value="male">Male</option><option value="female">Female</option><option value="non-binary">Non-binary</option>
            </Select>
            <Select value={input.fitnessLevel} onChange={(e) => setInput({ ...input, fitnessLevel: e.target.value as FitnessInput['fitnessLevel'] })}>
              <option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option>
            </Select>
            <Input placeholder="Height (cm)" type="number" value={input.heightCm} onChange={(e) => setInput({ ...input, heightCm: Number(e.target.value) })} />
            <Input placeholder="Weight (kg)" type="number" value={input.weightKg} onChange={(e) => setInput({ ...input, weightKg: Number(e.target.value) })} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <Input placeholder="Primary goal (build muscle, lose fat, etc.)" value={input.goal} onChange={(e) => setInput({ ...input, goal: e.target.value })} />
            <Input placeholder="Current physique/body type" value={input.bodyType} onChange={(e) => setInput({ ...input, bodyType: e.target.value })} />
            <Input placeholder="Equipment (comma separated)" value={input.equipment.join(', ')} onChange={(e) => setInput({ ...input, equipment: e.target.value.split(',').map((v) => v.trim()).filter(Boolean) })} />
            <div>
              <label className="mb-1 block text-xs text-muted">Training days/week: {input.trainingDays}</label>
              <input type="range" min={2} max={7} value={input.trainingDays} onChange={(e) => setInput({ ...input, trainingDays: Number(e.target.value) })} className="w-full" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Minutes/session: {input.sessionMinutes}</label>
              <input type="range" min={20} max={90} step={5} value={input.sessionMinutes} onChange={(e) => setInput({ ...input, sessionMinutes: Number(e.target.value) })} className="w-full" />
            </div>
            <Textarea rows={3} placeholder="Injuries/limitations (optional)" value={input.injuries} onChange={(e) => setInput({ ...input, injuries: e.target.value })} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <Select value={input.dietType} onChange={(e) => setInput({ ...input, dietType: e.target.value })}>
              <option value="omnivore">Omnivore</option><option value="vegetarian">Vegetarian</option><option value="vegan">Vegan</option><option value="keto">Keto</option>
            </Select>
            <div>
              <label className="mb-1 block text-xs text-muted">Monthly food budget: ${input.monthlyFoodBudget}</label>
              <input type="range" min={50} max={300} step={10} value={input.monthlyFoodBudget} onChange={(e) => setInput({ ...input, monthlyFoodBudget: Number(e.target.value) })} className="w-full" />
            </div>
            <div className="rounded-xl border border-border/70 bg-background/40 p-3 text-sm text-muted">
              We prioritize affordable staples like rice, eggs, oats, beans, potatoes, yogurt, and seasonal produce.
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {!previewPlan && (
              <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 p-4 text-sm">
                Generating your free preview... This usually takes ~10-20 seconds.
              </div>
            )}
            {previewPlan && (
              <PricingUnlock priceLabel={priceLabel} loadingCheckout={loadingCheckout} onCheckout={onCheckout} />
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {step > 0 && step < 3 && <Button className="bg-transparent text-foreground border border-border" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 2 && <Button onClick={() => setStep(step + 1)}>Continue</Button>}
          {step === 2 && (
            <Button onClick={onPreview} disabled={loadingPreview || !input.email}>
              {loadingPreview ? 'AI is thinking...' : 'Generate Free 3-Day Preview'}
            </Button>
          )}
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <p className="mt-5 text-xs text-muted">Not medical advice. Consult your physician before beginning new fitness or nutrition programs.</p>
      </div>

      <PreviewCard
        previewPlan={previewPlan}
        draft={{
          goal: input.goal,
          trainingDays: input.trainingDays,
          sessionMinutes: input.sessionMinutes,
          dietType: input.dietType,
          monthlyFoodBudget: input.monthlyFoodBudget,
          equipment: input.equipment
        }}
      />
    </section>
  );
}
