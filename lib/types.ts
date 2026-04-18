export type FitnessInput = {
  email: string;
  age: number;
  gender: string;
  heightCm: number;
  weightKg: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  bodyType: string;
  equipment: string[];
  trainingDays: number;
  sessionMinutes: number;
  dietType: string;
  monthlyFoodBudget: number;
  injuries?: string;
};

export type PlanDay = {
  day: string;
  workout: {
    warmup: string[];
    exercises: Array<{
      name: string;
      sets: string;
      reps: string;
      rest: string;
      notes: string;
      alternatives?: string[];
    }>;
    cooldown: string[];
  };
  meals: Array<{
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    ingredients: string[];
    instructions: string;
    estimatedCostUsd: number;
  }>;
};

export type WeeklyPlan = {
  title: string;
  userSummary: string;
  calorieTarget: number;
  macroTargets: { protein: number; carbs: number; fats: number };
  weeklySplit: string;
  days: PlanDay[];
  groceryList: Array<{ item: string; quantity: string; estimatedCostUsd: number }>;
  progressionTips: string[];
  safetyNotes: string[];
  motivation: string;
};
