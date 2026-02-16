export function fuzzyMatchIngredient(ingredient: string, pantryItemName: string): boolean {
  const normalizeString = (str: string): string => {
    return str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  };
  
  const normalizedIngredient = normalizeString(ingredient);
  const normalizedPantry = normalizeString(pantryItemName);
  
  // Exact match
  if (normalizedIngredient === normalizedPantry) {
    return true;
  }
  
  // One contains the other
  if (normalizedIngredient.includes(normalizedPantry) || normalizedPantry.includes(normalizedIngredient)) {
    return true;
  }
  
  // Split into words and check for significant overlap
  const ingredientWords = normalizedIngredient.split(/\s+/);
  const pantryWords = normalizedPantry.split(/\s+/);
  
  // Check if any significant word matches
  const significantWords = pantryWords.filter(word => word.length > 3);
  if (significantWords.length > 0) {
    for (const word of significantWords) {
      if (normalizedIngredient.includes(word)) {
        return true;
      }
    }
  }
  
  return false;
}

export interface IngredientMatch {
  ingredient: string;
  inPantry: boolean;
  pantryItemName?: string;
}

export function categorizeIngredients(
  ingredientsList: string,
  pantryItems: { name: string }[]
): IngredientMatch[] {
  const ingredients = ingredientsList
    .split(',')
    .map(i => i.trim())
    .filter(i => i.length > 0);
  
  return ingredients.map(ingredient => {
    const matchedPantryItem = pantryItems.find(item => 
      fuzzyMatchIngredient(ingredient, item.name)
    );
    
    return {
      ingredient,
      inPantry: !!matchedPantryItem,
      pantryItemName: matchedPantryItem?.name,
    };
  });
}
