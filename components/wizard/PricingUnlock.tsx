import { Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PricingUnlock({
  priceLabel,
  loadingCheckout,
  onCheckout
}: {
  priceLabel: string;
  loadingCheckout: boolean;
  onCheckout: () => Promise<void>;
}) {
  return (
    <section className="rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">Upgrade to Full Plan</p>
      <h3 className="mt-2 text-2xl font-bold">Unlock your full 7-day transformation plan</h3>
      <p className="mt-1 text-sm text-muted">One-time payment. No subscription required to get your first complete plan.</p>
      <p className="mt-3 text-4xl font-black">{priceLabel}</p>

      <ul className="mt-4 space-y-2 text-sm">
        {[
          'Detailed workouts (sets/reps/rest + alternatives)',
          'Complete meal plan with budget-conscious recipes',
          'Printable PDF + email copy sent instantly',
          'Progression + safety notes for your level'
        ].map((item) => (
          <li key={item} className="flex items-start gap-2"><Check size={16} className="mt-0.5 text-emerald-300" /> {item}</li>
        ))}
      </ul>

      <Button className="mt-5 h-11 w-full" onClick={onCheckout} disabled={loadingCheckout}>
        <Lock size={14} className="mr-2" />
        {loadingCheckout ? 'Redirecting to secure checkout...' : 'Unlock Full 7-Day Plan'}
      </Button>
    </section>
  );
}
