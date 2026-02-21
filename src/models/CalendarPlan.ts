import mongoose, { Schema, Document } from "mongoose";

export interface ICalendarPlan extends Document {
  weekOf: string;
  oneOffItems: {
    id: string;
    type: string;
    description: string;
    day: string;
    startTime: string;
    endTime: string;
  }[];
  recurringItems: {
    id: string;
    type: string;
    description: string;
    day: string;
    startTime?: string;
    endTime?: string;
    includeThisWeek: boolean;
  }[];
  eventNights: {
    day: string;
    isEvent: boolean;
    drinkNote: string;
  }[];
  weeklyNotes: string;
  updatedAt: Date;
}

const CalendarPlanSchema = new Schema<ICalendarPlan>(
  {
    weekOf: { type: String, required: true, index: true, unique: true },
    oneOffItems: [
      {
        id: String,
        type: String,
        description: String,
        day: String,
        startTime: String,
        endTime: String,
      },
    ],
    recurringItems: [
      {
        id: String,
        type: String,
        description: String,
        day: String,
        startTime: String,
        endTime: String,
        includeThisWeek: Boolean,
      },
    ],
    eventNights: [
      {
        day: String,
        isEvent: Boolean,
        drinkNote: String,
      },
    ],
    weeklyNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.CalendarPlan ||
  mongoose.model<ICalendarPlan>("CalendarPlan", CalendarPlanSchema);
