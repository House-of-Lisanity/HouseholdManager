import mongoose, { Schema, Document } from "mongoose";

export interface IMealsResult extends Document {
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
    weekOf: { type: String, required: true, index: true, unique: true },
    proteinTarget: { type: String, default: "" },
    dailyMeals: { type: Schema.Types.Mixed, default: [] },
    shoppingList: { type: Schema.Types.Mixed, default: { fromPantry: [], toBuy: [] } },
  },
  { timestamps: true }
);

export default mongoose.models.MealsResult ||
  mongoose.model<IMealsResult>("MealsResult", MealsResultSchema);
