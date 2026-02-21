export interface TimeBlock {
  startTime: string;
  endTime: string;
  description: string;
}

export interface DaySchedule {
  day: string;
  timeBlocks: TimeBlock[];
  bigRocks: string[];
  choresAssigned: string[];
  hobbyAssigned: string;
}

export interface DayMeals {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
}

export interface ShoppingListSection {
  category: string;
  items: string[];
}

// Legacy combined result (kept during migration)
export interface WeeklyPlanResult {
  weekOf: string;
  proteinTarget: string;
  strategyNotes: string;
  dailySchedules: DaySchedule[];
  dailyMeals: DayMeals[];
  shoppingList: {
    fromPantry: ShoppingListSection[];
    toBuy: ShoppingListSection[];
  };
}

// Per-section result types
export interface CalendarPlanResult {
  weekOf: string;
  strategyNotes: string;
  dailySchedules: DaySchedule[];
}

export interface MealsPlanResult {
  weekOf: string;
  proteinTarget: string;
  dailyMeals: DayMeals[];
  shoppingList: {
    fromPantry: ShoppingListSection[];
    toBuy: ShoppingListSection[];
  };
}

export interface WorkoutDayResult {
  day: string;
  workoutType: string;
  location: string;
  workoutDetails: string;
  focusAreas: string;
  aiNotes?: string;
}

export interface WorkoutsPlanResult {
  weekOf: string;
  workoutSummary: string;
  dailyWorkouts: WorkoutDayResult[];
}
