import mongoose, { Schema, Document } from "mongoose";

export interface ICalendarResult extends Document {
  userId: string;
  weekOf: string;
  strategyNotes: string;
  dailySchedules: {
    day: string;
    timeBlocks: {
      startTime: string;
      endTime: string;
      description: string;
      shortLabel: string;
      pinned?: boolean;
    }[];
    bigRocks: string[];
    choresAssigned: string[];
    hobbyAssigned: string;
  }[];
  updatedAt: Date;
}

const CalendarResultSchema = new Schema<ICalendarResult>(
  {
    userId: { type: String, required: true },
    weekOf: { type: String, required: true },
    strategyNotes: { type: String, default: "" },
    dailySchedules: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

CalendarResultSchema.index({ userId: 1, weekOf: 1 }, { unique: true });

export default mongoose.models.CalendarResult ||
  mongoose.model<ICalendarResult>("CalendarResult", CalendarResultSchema);
