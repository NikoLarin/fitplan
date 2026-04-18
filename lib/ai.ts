import OpenAI from 'openai';
import { FitnessInput, WeeklyPlan } from './types';
import { systemPrompt } from './prompt';

function parseJson<T>(text: string): T {
  const cleaned = text.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as T;
}

async function callAnthropic(userPrompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY || '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic error: ${response.status} ${await response.text()}`);
  }

  const json = await response.json();
  return json.content?.[0]?.text || '';
}

export async function generatePlan(input: FitnessInput, preview = false): Promise<WeeklyPlan> {
  const provider = process.env.AI_PROVIDER ?? 'openai';
  const userPrompt = `User profile:\n${JSON.stringify(input, null, 2)}\n\n${preview ? 'Generate only 3 days and keep detail moderate for free preview.' : 'Generate all 7 days with full detail.'}`;

  if (provider === 'anthropic') {
    const text = await callAnthropic(userPrompt);
    return parseJson<WeeklyPlan>(text);
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.responses.create({
    model: process.env.OPENAI_MODEL ?? 'gpt-4.1-mini',
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    max_output_tokens: 4000
  });

  const text = completion.output_text;
  return parseJson<WeeklyPlan>(text);
}
