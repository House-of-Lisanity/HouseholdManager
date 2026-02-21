import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutsResult extends Document {
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
    weekOf: { type: String, required: true, index: true, unique: true },
    workoutSummary: { type: String, default: "" },
    dailyWorkouts: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.WorkoutsResult ||
  mongoose.model<IWorkoutsResult>("WorkoutsResult", WorkoutsResultSchema);
