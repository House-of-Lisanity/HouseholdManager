import mongoose, { Schema, Document } from "mongoose";
import { MealCompletionType } from "@/types";

export interface IMealLog extends Document {
  date: string;
  weekOf: string;
  mealSlot: string;
  completionType: MealCompletionType;
  plannedMealId?: string;
  mealName: string;
  description: string;
  nutrition?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  notes: string;
  completedAt: string;
  updatedAt: Date;
}

const MealLogSchema = new Schema<IMealLog>(
  {
    date: { type: String, required: true },
    weekOf: { type: String, required: true },
    mealSlot: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },
    completionType: {
      type: String,
      enum: ["as_planned", "modified", "unplanned"],
      required: true,
    },
    plannedMealId: { type: String },
    mealName: { type: String, required: true },
    description: { type: String, default: "" },
    nutrition: {
      calories: String,
      protein: String,
      carbs: String,
      fat: String,
    },
    notes: { type: String, default: "" },
    completedAt: { type: String, required: true },
  },
  { timestamps: true }
);

MealLogSchema.index({ weekOf: 1, date: 1 });

export default mongoose.models.MealLog ||
  mongoose.model<IMealLog>("MealLog", MealLogSchema);
