import {
  CalendarFormInput,
  CalendarPlanResult,
  MealsFormInput,
  MealsPlanResult,
  WorkoutsFormInput,
  WorkoutsPlanResult,
} from "@/types";

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
