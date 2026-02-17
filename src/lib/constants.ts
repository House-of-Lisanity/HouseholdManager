export const DAYS_SUNDAY_START = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const DAYS_MONDAY_START = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const WORKOUT_TYPES = [
  "Lifting",
  "CrossFit WOD",
  "Cardio",
  "HIIT",
  "Yoga / Stretching",
  "Other",
] as const;

export const LOCATIONS = ["Gym", "Home", "CrossFit Box"] as const;

export const MEAL_SLOTS = ["Breakfast", "Lunch", "Dinner", "Snack"] as const;

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
