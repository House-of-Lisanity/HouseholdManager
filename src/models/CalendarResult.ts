import mongoose, { Schema, Document } from "mongoose";

export interface ICalendarResult extends Document {
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
    weekOf: { type: String, required: true, index: true, unique: true },
    strategyNotes: { type: String, default: "" },
    dailySchedules: { type: Schema.Types.Mixed, default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.CalendarResult ||
  mongoose.model<ICalendarResult>("CalendarResult", CalendarResultSchema);
