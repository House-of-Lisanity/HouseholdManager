import mongoose, { Schema, Document } from "mongoose";

export interface ICalendarPlan extends Document {
  weekOf: string;
  mustDo1: string;
  mustDo2: string;
  mustDo3: string;
  hobby1: string;
  hobby2: string;
  hobby3: string;
  weekendProject1: string;
  weekendProject2: string;
  weekendProject3: string;
  weekendProject1Duration: string;
  weekendProject2Duration: string;
  weekendProject3Duration: string;
  chore1: string;
  chore2: string;
  chore3: string;
  gymSessions: {
    day: string;
    startTime: string;
    endTime: string;
    gymType: string;
  }[];
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
  scheduleConflicts: string;
  updatedAt: Date;
}

const CalendarPlanSchema = new Schema<ICalendarPlan>(
  {
    weekOf: { type: String, required: true, index: true, unique: true },
    mustDo1: { type: String, default: "" },
    mustDo2: { type: String, default: "" },
    mustDo3: { type: String, default: "" },
    hobby1: { type: String, default: "" },
    hobby2: { type: String, default: "" },
    hobby3: { type: String, default: "" },
    weekendProject1: { type: String, default: "" },
    weekendProject2: { type: String, default: "" },
    weekendProject3: { type: String, default: "" },
    weekendProject1Duration: { type: String, default: "2-4 hours" },
    weekendProject2Duration: { type: String, default: "2-4 hours" },
    weekendProject3Duration: { type: String, default: "2-4 hours" },
    chore1: { type: String, default: "" },
    chore2: { type: String, default: "" },
    chore3: { type: String, default: "" },
    gymSessions: [
      {
        day: String,
        startTime: String,
        endTime: String,
        gymType: String,
      },
    ],
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
    scheduleConflicts: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.CalendarPlan ||
  mongoose.model<ICalendarPlan>("CalendarPlan", CalendarPlanSchema);
