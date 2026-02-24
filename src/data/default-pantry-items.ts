import { PantryItem } from "@/types";
import { generateId } from "@/lib/constants";

interface DefaultEntry {
  name: string;
  category: PantryItem["category"];
}

const ENTRIES: DefaultEntry[] = [
  // Dry Goods
  { name: "Rice", category: "dry_goods" },
  { name: "Pasta", category: "dry_goods" },
  { name: "Oats", category: "dry_goods" },
  { name: "Flour", category: "dry_goods" },
  { name: "Sugar", category: "dry_goods" },
  { name: "Brown sugar", category: "dry_goods" },
  { name: "Baking soda", category: "dry_goods" },
  { name: "Baking powder", category: "dry_goods" },
  { name: "Olive oil", category: "dry_goods" },
  { name: "Vegetable oil", category: "dry_goods" },
  { name: "Vinegar", category: "dry_goods" },
  { name: "Soy sauce", category: "dry_goods" },
  { name: "Canned tomatoes", category: "dry_goods" },
  { name: "Canned beans", category: "dry_goods" },
  { name: "Chicken broth", category: "dry_goods" },
  { name: "Peanut butter", category: "dry_goods" },
  { name: "Honey", category: "dry_goods" },
  { name: "Cornstarch", category: "dry_goods" },

  // Frozen
  { name: "Frozen vegetables (mixed)", category: "frozen" },
  { name: "Frozen berries", category: "frozen" },
  { name: "Frozen chicken breasts", category: "frozen" },
  { name: "Frozen ground beef", category: "frozen" },
  { name: "Frozen fish fillets", category: "frozen" },
  { name: "Frozen corn", category: "frozen" },
  { name: "Frozen broccoli", category: "frozen" },
  { name: "Frozen pizza", category: "frozen" },
  { name: "Frozen bread/rolls", category: "frozen" },
  { name: "Ice cream", category: "frozen" },

  // Refrigerated
  { name: "Milk", category: "refrigerated" },
  { name: "Eggs", category: "refrigerated" },
  { name: "Butter", category: "refrigerated" },
  { name: "Shredded cheese", category: "refrigerated" },
  { name: "Sliced cheese", category: "refrigerated" },
  { name: "Yogurt", category: "refrigerated" },
  { name: "Cream cheese", category: "refrigerated" },
  { name: "Sour cream", category: "refrigerated" },
  { name: "Lunch meat", category: "refrigerated" },
  { name: "Salad mix", category: "refrigerated" },
  { name: "Lemons", category: "refrigerated" },
  { name: "Ketchup", category: "refrigerated" },
  { name: "Mustard", category: "refrigerated" },
  { name: "Mayo", category: "refrigerated" },
  { name: "Fresh herbs", category: "refrigerated" },

  // Spices
  { name: "Salt", category: "spices" },
  { name: "Black pepper", category: "spices" },
  { name: "Garlic powder", category: "spices" },
  { name: "Onion powder", category: "spices" },
  { name: "Paprika", category: "spices" },
  { name: "Cumin", category: "spices" },
  { name: "Chili powder", category: "spices" },
  { name: "Italian seasoning", category: "spices" },
  { name: "Oregano", category: "spices" },
  { name: "Cinnamon", category: "spices" },
  { name: "Red pepper flakes", category: "spices" },
  { name: "Bay leaves", category: "spices" },
  { name: "Thyme", category: "spices" },
  { name: "Turmeric", category: "spices" },
  { name: "Cayenne pepper", category: "spices" },
];

/**
 * Returns default pantry items with unique IDs.
 * Filters out any names that already exist in the current pantry (case-insensitive).
 */
export function getDefaultPantryItems(
  existingItems: PantryItem[]
): PantryItem[] {
  const existingNames = new Set(
    existingItems.map((item) => item.name.toLowerCase())
  );

  return ENTRIES.filter((entry) => !existingNames.has(entry.name.toLowerCase()))
    .map((entry, i) => ({
      id: generateId(`pantry-${i}`),
      name: entry.name,
      category: entry.category,
    }));
}
