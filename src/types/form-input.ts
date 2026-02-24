import {
  GymSession,
  OneOffItem,
  RecurringItem,
  BufferRule,
  Location,
} from "./schedule";
import { PantryItem, MealEntry } from "./meals";
import { WorkoutEntry, LiftMax, EventNight } from "./health";

// ============================================================================
// PAGE-SPECIFIC TYPES
// ============================================================================

export interface UserProfile {
  // Calendar
  workStartTime: string;
  workEndTime: string;
  wakeTime: string;
  bedTime: string;
  schedulingPreferences: string;
  timezone: string;
  homeAddress: string;
  workAddress: string;
  bufferRules: BufferRule[];
  locations: Location[];

  // Meals
  targetCalories: string;
  targetProtein: string;
  targetCarbs: string;
  targetFats: string;
  foodsToAvoid: string;
  cravingsPreferences: string;
  allergies: string;
  dietaryStyle: string;
  cookingAppliances: string;

  // Workouts — Equipment
  gymEquipment: string[];
  homeEquipment: string[];
  crossfitEquipment: string[];

  // Workouts — Body
  height: string;
  weight: string;
  trainingAge: string;
  hipMeasurement: string;
  waistMeasurement: string;
  chestMeasurement: string;
  thighMeasurement: string;
  armMeasurement: string;
  liftMaxes: LiftMax[];

  // Workouts — Goals
  fitnessGoals: string;
  injuriesLimitations: string;

  // Pantry
  pantryItems: PantryItem[];
}

export interface CalendarFormInput {
  weekOf: string;
  oneOffItems: OneOffItem[];
  recurringItems: RecurringItem[];
  eventNights: EventNight[];
  workFromHomeDays: string[];
  weeklyNotes: string;
}

export interface MealsFormInput {
  weeklyFocus: string;
  meals: MealEntry[];
}

export interface WorkoutsFormInput {
  weeklyFocus: string;
  workouts: WorkoutEntry[];
}

// ============================================================================
// LEGACY (kept during migration)
// ============================================================================

export interface WeeklyFormInput {
  // Basic info
  weekOf: string;
  workStartTime: string;
  workEndTime: string;

  // Weekly focus
  mustDo1: string;
  mustDo2: string;
  mustDo3: string;
  hobby1: string;
  hobby2: string;
  hobby3: string;
  weekendProject1: string;
  weekendProject2: string;
  weekendProject3: string;
  weekendProject1Duration: string;
  weekendProject2Duration: string;
  weekendProject3Duration: string;
  chore1: string;
  chore2: string;
  chore3: string;

  // Schedule management
  gymSessions: GymSession[];
  oneOffItems: OneOffItem[];
  recurringItems: RecurringItem[];
  bufferRules: BufferRule[];
  locations: Location[];

  // Meals & nutrition
  meals: MealEntry[];
  pantryItems: PantryItem[];
  targetProtein: string;
  dailyAlcohol: string;
  foodsToAvoid: string;
  cravingsPreferences: string;

  // Workout & health tracking
  eventNights: EventNight[];
  workoutSchedule: WorkoutEntry[];

  // Misc
  scheduleConflicts: string;
}
