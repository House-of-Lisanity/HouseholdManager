import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutPlan extends Document {
  userId: string;
  weekOf: string;
  weeklyFocus: string;
  workouts: {
    id: string;
    workoutType: string;
    location: string;
    day: string;
    pinnedToDay: boolean;
    startTime?: string;
    endTime?: string;
    details: string;
    notes: string;
  }[];
  updatedAt: Date;
}

const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    userId: { type: String, required: true },
    weekOf: { type: String, required: true },
    weeklyFocus: { type: String, default: "" },
    workouts: [
      {
        id: String,
        workoutType: String,
        location: String,
        day: String,
        pinnedToDay: { type: Boolean, default: false },
        startTime: String,
        endTime: String,
        details: String,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

WorkoutPlanSchema.index({ userId: 1, weekOf: 1 }, { unique: true });

export default mongoose.models.WorkoutPlan ||
  mongoose.model<IWorkoutPlan>("WorkoutPlan", WorkoutPlanSchema);
