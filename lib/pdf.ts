import { PDFDocument, StandardFonts, rgb, PDFPage } from 'pdf-lib';
import { WeeklyPlan } from './types';

export async function buildPlanPdf(plan: WeeklyPlan) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let page: PDFPage = pdfDoc.addPage([595, 842]);
  let y = 800;

  const draw = (text: string, size = 10) => {
    const chunks = text.match(/.{1,100}/g) || [''];
    for (const chunk of chunks) {
      if (y < 60) {
        page = pdfDoc.addPage([595, 842]);
        y = 800;
      }
      page.drawText(chunk, { x: 40, y, size, font, color: rgb(0, 0, 0) });
      y -= size + 6;
    }
  };

  draw(plan.title, 18);
  draw(plan.userSummary, 11);
  draw(`Calories ${plan.calorieTarget} | Macros ${plan.macroTargets.protein}/${plan.macroTargets.carbs}/${plan.macroTargets.fats}`);
  draw(`Split: ${plan.weeklySplit}`);

  plan.days.forEach((d) => {
    draw(` ${d.day}`, 13);
    d.workout.exercises.forEach((e) => draw(`- ${e.name}: ${e.sets} x ${e.reps} (${e.rest})`));
    d.meals.forEach((m) => draw(`Meal ${m.name}: ${m.calories} kcal, $${m.estimatedCostUsd}`));
  });

  draw(' Grocery list', 13);
  plan.groceryList.forEach((g) => draw(`- ${g.item}: ${g.quantity} ($${g.estimatedCostUsd})`));

  return Buffer.from(await pdfDoc.save());
}
