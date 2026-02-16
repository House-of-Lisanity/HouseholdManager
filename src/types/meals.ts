export interface PantryItem {
  id: string;
  name: string;
  quantity?: string;
  category?: "dry_goods" | "frozen" | "refrigerated" | "spices";
  unit?: string;
  expiresInDays?: number;
  notes?: string;
}

export interface TovalaMeal {
  day: string;
  mealName: string;
  protein: string;
  calories: string;
  notes: string;
}

export interface CustomMeal {
  id: string;
  mealName: string;
  preferredDay: string;
  recipeLink?: string;
  ingredientsList: string;
}
