import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutsResult extends Document {
  userId: string;
  weekOf: string;
  workoutSummary: string;
  dailyWorkouts: {
    day: string;
    workoutType: string;
    location: string;
    workoutDetails: string;
    focusAreas: string;
    aiNotes?: string;
  }[];
  updatedAt: Date;
}

const WorkoutsResultSchema = new Schema<IWorkoutsResult>(
  {
    userId: { type: String, required: true },
    weekOf: { type: String, required: true },
    workoutSummary: { type: String, default: "" },
    dailyWorkouts: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

WorkoutsResultSchema.index({ userId: 1, weekOf: 1 }, { unique: true });

export default mongoose.models.WorkoutsResult ||
  mongoose.model<IWorkoutsResult>("WorkoutsResult", WorkoutsResultSchema);
