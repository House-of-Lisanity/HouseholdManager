import { NutritionInfo } from "./meals";

export type MealCompletionType = "as_planned" | "modified" | "unplanned";

export interface MealLog {
  _id?: string;
  date: string;
  weekOf: string;
  mealSlot: string;
  completionType: MealCompletionType;
  plannedMealId?: string;
  mealName: string;
  description: string;
  nutrition?: NutritionInfo;
  notes: string;
  completedAt: string;
}
