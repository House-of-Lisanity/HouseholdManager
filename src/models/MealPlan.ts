import mongoose, { Schema, Document } from "mongoose";

export interface IMealPlan extends Document {
  weekOf: string;
  weeklyFocus: string;
  meals: {
    id: string;
    mealName: string;
    mealSlot: string;
    day: string;
    pinnedToDay: boolean;
    recipeUrl?: string;
    nutrition?: {
      calories?: string;
      protein?: string;
      carbs?: string;
      fat?: string;
      servings?: string;
    };
    ingredients?: string;
    notes?: string;
  }[];
  updatedAt: Date;
}

const MealPlanSchema = new Schema<IMealPlan>(
  {
    weekOf: { type: String, required: true, index: true, unique: true },
    weeklyFocus: { type: String, default: "" },
    meals: [
      {
        id: String,
        mealName: String,
        mealSlot: String,
        day: String,
        pinnedToDay: Boolean,
        recipeUrl: String,
        nutrition: {
          calories: String,
          protein: String,
          carbs: String,
          fat: String,
          servings: String,
        },
        ingredients: String,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);
