export interface PantryItem {
  id: string;
  name: string;
  quantity?: string;
  category?: "dry_goods" | "frozen" | "refrigerated" | "spices";
  unit?: string;
  expiresInDays?: number;
  notes?: string;
}

export interface NutritionInfo {
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  servings?: string;
}

export interface MealEntry {
  id: string;
  mealName: string;
  mealSlot: string;
  day: string;
  pinnedToDay: boolean;
  recipeUrl?: string;
  nutrition?: NutritionInfo;
  ingredients?: string;
  notes?: string;
}
