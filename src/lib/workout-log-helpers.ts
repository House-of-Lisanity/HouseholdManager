import { WorkoutEntry, WorkoutLog, SetLog, ExerciseLog } from "@/types";

export function getWeekOf(date: Date = new Date()): string {
  const day = date.getDay();
  const sunday = new Date(date);
  sunday.setDate(date.getDate() - day);
  return sunday.toISOString().split("T")[0];
}

/** Shift a weekOf string by +/- N weeks */
export function shiftWeek(weekOf: string, direction: number): string {
  const date = new Date(weekOf + "T00:00:00");
  date.setDate(date.getDate() + direction * 7);
  return date.toISOString().split("T")[0];
}

/** Format a weekOf string for display */
export function formatWeekLabel(weekOf: string): string {
  return new Date(weekOf + "T00:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function createEmptySet(setNumber: number): SetLog {
  return { setNumber, type: "working", weight: 0, reps: 0 };
}

export function createEmptyExercise(): ExerciseLog {
  return { exerciseName: "", sets: [createEmptySet(1)], notes: "" };
}

/** Flow 1: Complete as planned — one-click log from a WorkoutEntry */
export function createLogFromPlan(
  entry: WorkoutEntry,
  weekOf: string,
  date?: string
): Omit<WorkoutLog, "_id"> {
  return {
    date: date || getTodayISO(),
    weekOf,
    completionType: "as_planned",
    plannedWorkoutId: entry.id,
    workoutType: entry.workoutType,
    location: entry.location,
    exercises: [],
    rawDetails: entry.details,
    notes: entry.notes,
    completedAt: new Date().toISOString(),
  };
}

/** Flow 2: Pre-filled template for logging with modifications */
export function createModifiedLogTemplate(
  entry: WorkoutEntry,
  weekOf: string
): Omit<WorkoutLog, "_id"> {
  return {
    date: getTodayISO(),
    weekOf,
    completionType: "modified",
    plannedWorkoutId: entry.id,
    workoutType: entry.workoutType,
    location: entry.location,
    exercises: [createEmptyExercise()],
    rawDetails: entry.details,
    notes: "",
    completedAt: new Date().toISOString(),
  };
}

/** Flow 3: Blank template for unplanned workouts */
export function createUnplannedLogTemplate(
  weekOf: string
): Omit<WorkoutLog, "_id"> {
  return {
    date: getTodayISO(),
    weekOf,
    completionType: "unplanned",
    workoutType: "",
    location: "",
    exercises: [createEmptyExercise()],
    rawDetails: "",
    notes: "",
    completedAt: new Date().toISOString(),
  };
}
