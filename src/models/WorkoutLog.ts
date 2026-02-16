import mongoose, { Schema, Document } from "mongoose";
import { CompletionType, SetType } from "@/types";

export interface IWorkoutLog extends Document {
  date: string;
  weekOf: string;
  completionType: CompletionType;
  plannedWorkoutId?: string;
  workoutType: string;
  location: string;
  exercises: {
    exerciseName: string;
    sets: {
      setNumber: number;
      type: SetType;
      weight: number;
      reps: number;
      rpe?: number;
    }[];
    notes: string;
  }[];
  rawDetails: string;
  notes: string;
  duration?: number;
  rpe?: number;
  completedAt: string;
  updatedAt: Date;
}

const WorkoutLogSchema = new Schema<IWorkoutLog>(
  {
    date: { type: String, required: true },
    weekOf: { type: String, required: true },
    completionType: {
      type: String,
      enum: ["as_planned", "modified", "unplanned"],
      required: true,
    },
    plannedWorkoutId: { type: String },
    workoutType: { type: String, required: true },
    location: { type: String, required: true },
    exercises: [
      {
        exerciseName: String,
        sets: [
          {
            setNumber: Number,
            type: {
              type: String,
              enum: ["working", "warmup", "drop", "failure"],
              default: "working",
            },
            weight: Number,
            reps: Number,
            rpe: Number,
          },
        ],
        notes: String,
      },
    ],
    rawDetails: { type: String, default: "" },
    notes: { type: String, default: "" },
    duration: { type: Number },
    rpe: { type: Number },
    completedAt: { type: String, required: true },
  },
  { timestamps: true }
);

WorkoutLogSchema.index({ weekOf: 1, date: 1 });

export default mongoose.models.WorkoutLog ||
  mongoose.model<IWorkoutLog>("WorkoutLog", WorkoutLogSchema);
