export type CompletionType = "as_planned" | "modified" | "unplanned";

export type SetType = "working" | "warmup" | "drop" | "failure";

export interface SetLog {
  setNumber: number;
  type: SetType;
  weight: number;
  reps: number;
  rpe?: number;
}

export interface ExerciseLog {
  exerciseName: string;
  sets: SetLog[];
  notes: string;
}

export interface WorkoutLog {
  _id?: string;
  date: string;
  weekOf: string;
  completionType: CompletionType;
  plannedWorkoutId?: string;
  workoutType: string;
  location: string;
  exercises: ExerciseLog[];
  rawDetails: string;
  notes: string;
  duration?: number;
  rpe?: number;
  completedAt: string;
}
