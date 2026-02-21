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

// To Do
export const TODO_CATEGORIES = [
  "Home",
  "Health & Fitness",
  "Finance",
  "Personal",
  "Errands",
] as const;

export const HOME_ROOMS = [
  "Kitchen",
  "Bathroom",
  "Bedroom",
  "Living Room",
  "Office",
  "Garage",
  "Yard",
  "Other",
] as const;

export const WEEKLY_PRIORITIES = [
  { value: "must", label: "Must Do" },
  { value: "want", label: "Want To" },
  { value: "if_time", label: "If Time" },
] as const;

export const RECURRING_FREQUENCIES = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Every 2 Weeks" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
] as const;

// Shopping Store Types
import { StoreConfig } from "@/types/shopping";

export const STORE_CONFIGS: StoreConfig[] = [
  { id: "bigBox", label: "Big Box", shortLabel: "BB" },
  { id: "warehouse", label: "Warehouse Club", shortLabel: "WH" },
  { id: "grocery", label: "Grocery", shortLabel: "GR" },
  { id: "specialty", label: "Specialty", shortLabel: "SP" },
];
