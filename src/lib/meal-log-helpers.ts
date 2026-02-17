import { MealEntry, MealLog } from "@/types";
import { getTodayISO } from "./workout-log-helpers";

/** Flow 1: Quick-log a planned meal (one-click) */
export function createMealLogFromPlan(
  entry: MealEntry,
  weekOf: string,
  date?: string
): Omit<MealLog, "_id"> {
  return {
    date: date || getTodayISO(),
    weekOf,
    mealSlot: entry.mealSlot,
    completionType: "as_planned",
    plannedMealId: entry.id,
    mealName: entry.mealName,
    description: entry.ingredients || "",
    nutrition: entry.nutrition ? { ...entry.nutrition } : undefined,
    notes: entry.notes || "",
    completedAt: new Date().toISOString(),
  };
}

/** Flow 2: Pre-filled template for logging with modifications */
export function createModifiedMealLogTemplate(
  entry: MealEntry,
  weekOf: string
): Omit<MealLog, "_id"> {
  return {
    date: getTodayISO(),
    weekOf,
    mealSlot: entry.mealSlot,
    completionType: "modified",
    plannedMealId: entry.id,
    mealName: entry.mealName,
    description: entry.ingredients || "",
    nutrition: entry.nutrition ? { ...entry.nutrition } : undefined,
    notes: "",
    completedAt: new Date().toISOString(),
  };
}

/** Flow 3: Blank template for unplanned meals */
export function createUnplannedMealLogTemplate(
  weekOf: string
): Omit<MealLog, "_id"> {
  return {
    date: getTodayISO(),
    weekOf,
    mealSlot: "",
    completionType: "unplanned",
    mealName: "",
    description: "",
    notes: "",
    completedAt: new Date().toISOString(),
  };
}
