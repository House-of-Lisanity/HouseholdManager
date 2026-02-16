import mongoose, { Schema, Document } from "mongoose";

export interface IMealPlan extends Document {
  weekOf: string;
  tovalaMeals: {
    day: string;
    mealName: string;
    protein: string;
    calories: string;
    notes: string;
  }[];
  customMeals: {
    id: string;
    mealName: string;
    preferredDay: string;
    recipeLink?: string;
    ingredientsList: string;
  }[];
  updatedAt: Date;
}

const MealPlanSchema = new Schema<IMealPlan>(
  {
    weekOf: { type: String, required: true, index: true, unique: true },
    tovalaMeals: [
      {
        day: String,
        mealName: String,
        protein: String,
        calories: String,
        notes: String,
      },
    ],
    customMeals: [
      {
        id: String,
        mealName: String,
        preferredDay: String,
        recipeLink: String,
        ingredientsList: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.MealPlan ||
  mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);
