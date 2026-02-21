import {
  CalendarFormInput,
  CalendarPlanResult,
  MealsFormInput,
  MealsPlanResult,
  NutritionInfo,
  WorkoutsFormInput,
  WorkoutsPlanResult,
} from "@/types";
import { ScrapedRecipe } from "@/lib/recipe-scraper";

// Calendar — generate
export async function generateCalendarPlan(
  formData: CalendarFormInput
): Promise<CalendarPlanResult> {
  const response = await fetch("/api/generate/calendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to generate calendar plan");
  }

  return response.json();
}

// Meals — generate
export async function generateMealsPlan(
  formData: MealsFormInput,
  weekOf: string
): Promise<MealsPlanResult> {
  const response = await fetch("/api/generate/meals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, weekOf }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to generate meal plan");
  }

  return response.json();
}

// Recipe — parse URL for nutrition data
export async function parseRecipeUrl(url: string): Promise<ScrapedRecipe> {
  const response = await fetch("/api/parse-recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to parse recipe");
  }

  return response.json();
}

// Meal log — estimate nutrition from freeform text
export async function estimateNutrition(
  description: string
): Promise<NutritionInfo> {
  const response = await fetch("/api/estimate-nutrition", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to estimate nutrition");
  }

  return response.json();
}

// All sections — generate missing plans in parallel
type Section = "calendar" | "meals" | "workouts";

export async function generateAllPlans(
  weekOf: string,
  skip: Section[] = []
): Promise<{
  calendar: CalendarPlanResult | null;
  meals: MealsPlanResult | null;
  workouts: WorkoutsPlanResult | null;
}> {
  const response = await fetch("/api/generate/all", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ weekOf, skip }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to generate plans");
  }

  return response.json();
}

// Workouts — generate
export async function generateWorkoutsPlan(
  formData: WorkoutsFormInput,
  weekOf: string
): Promise<WorkoutsPlanResult> {
  const response = await fetch("/api/generate/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, weekOf }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Failed to generate workout plan");
  }

  return response.json();
}
