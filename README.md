# ForgeFit AI (MVP)

AI-powered micro-SaaS that generates personalized training + diet plans in ~60 seconds.

## Stack
- Next.js 15 + TypeScript (App Router)
- Tailwind + lightweight shadcn-style UI components
- Supabase (plan request + purchased plans data)
- Stripe Checkout (one-time unlock)
- OpenAI/Anthropic pluggable provider
- PDF-lib for server-side generated downloadable plan PDF
- Optional Resend email delivery

## Quick start
1. Install deps:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env.local
   ```
3. Fill `.env.local` keys.
4. Run migration in Supabase SQL editor:
   - `migrations/001_init.sql`
5. Start dev server:
   ```bash
   npm run dev
   ```

## Payment test flow (Stripe test mode)
1. Set `STRIPE_SECRET_KEY` with test key.
2. Start app and fill form.
3. Click **Generate Free Preview**.
4. Click **Unlock Full 7-Day Plan**.
5. In Stripe checkout use test card `4242 4242 4242 4242` with any future date/CVC.
6. On success page, backend verifies payment, generates full plan, and triggers PDF download.

## AI provider swap
- Default: OpenAI (`AI_PROVIDER=openai`)
- Anthropic: set `AI_PROVIDER=anthropic` and API key/model.
- Prompt is centralized in `lib/prompt.ts`.

## Deploy to Vercel
1. Push repo to GitHub.
2. Import project in Vercel.
3. Add all env vars from `.env.example`.
4. Set `NEXT_PUBLIC_APP_URL` to your production URL.
5. Deploy.

## Notes
- Dashboard is a simple MVP lookup by email.
- Not medical advice disclaimer included in UI.
- Consider adding Stripe webhook for stronger fulfillment guarantees in production.
