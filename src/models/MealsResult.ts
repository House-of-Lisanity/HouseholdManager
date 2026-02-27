import mongoose, { Schema, Document } from "mongoose";

export interface IMealsResult extends Document {
  userId: string;
  weekOf: string;
  proteinTarget: string;
  dailyMeals: {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string;
  }[];
  shoppingList: {
    fromPantry: { category: string; items: unknown[] }[];
    toBuy: { category: string; items: unknown[] }[];
  };
  updatedAt: Date;
}

const MealsResultSchema = new Schema<IMealsResult>(
  {
    userId: { type: String, required: true },
    weekOf: { type: String, required: true },
    proteinTarget: { type: String, default: "" },
    dailyMeals: { type: Schema.Types.Mixed, default: [] },
    shoppingList: { type: Schema.Types.Mixed, default: { fromPantry: [], toBuy: [] } },
  },
  { timestamps: true }
);

MealsResultSchema.index({ userId: 1, weekOf: 1 }, { unique: true });

export default mongoose.models.MealsResult ||
  mongoose.model<IMealsResult>("MealsResult", MealsResultSchema);
