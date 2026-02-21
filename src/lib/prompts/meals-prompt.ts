import { MealsFormInput, UserProfile } from "@/types";
import { WEEKLY_TEMPLATE } from "@/lib/template";
import { formatPantryForPrompt, formatMealEntries } from "./format-helpers";

export function buildMealsPrompt(
  formData: MealsFormInput,
  weekOf: string,
  profile: UserProfile
): string {
  const mealsText = formatMealEntries(
    formData.meals || [],
    profile.pantryItems
  );
  const pantryText = formatPantryForPrompt(profile.pantryItems);
  const templateJSON = JSON.stringify(WEEKLY_TEMPLATE, null, 2);

  const appliancesList = profile.cookingAppliances.length > 0
    ? profile.cookingAppliances.join(", ")
    : "Standard kitchen appliances";

  return `You are a meal planning assistant for someone who is 10 years post-gastric bypass surgery. This person is 48 years old, in menopause, lifts heavy weights, and does CrossFit 5+ days per week. Their goal is to build muscle and lose fat.

CRITICAL CONTEXT:
- Post-gastric bypass: Small portions (2.5-4 oz protein per meal), high protein, minimal leftovers
- Protein target: ${profile.targetProtein}g per day
${profile.targetCalories ? `- Calorie target: ${profile.targetCalories} per day` : "- Calorie target: Flexible (not strict)"}
- Prefers salty/savory foods, low fruit/vegetable intake
- Has ${profile.dailyAlcohol || "1 drink most days"}
${profile.allergies ? `- Allergies: ${profile.allergies}` : ""}
${profile.dietaryStyle && profile.dietaryStyle !== "none" ? `- Dietary style: ${profile.dietaryStyle}` : ""}
- Cooking appliances: ${appliancesList}

MEAL PLAN REQUEST:
Week of: ${weekOf}

${formData.weeklyFocus ? `WEEKLY FOCUS:\n${formData.weeklyFocus}\n` : ""}
===== MEALS =====

PINNED MEALS (must stay on assigned day/slot):
${mealsText.pinned}

AVAILABLE MEALS (AI assigns day/slot):
${mealsText.available}

CURRENT PANTRY INVENTORY:
${pantryText}

MEAL TEMPLATE REFERENCE:
${templateJSON}

PREFERENCES:
- Foods to avoid: ${profile.foodsToAvoid || "None"}
- Cravings/preferences: ${profile.cravingsPreferences || "None"}

===== INSTRUCTIONS =====

1. MEAL PLANNING:
   - Prioritize pantry items, especially those expiring soon
   - Use pinned meals exactly as specified on their assigned day and slot
   - Incorporate available (unpinned) meals on appropriate days/slots
   - For open slots: EITHER use simple pantry-based meals (e.g., "1/2 cup cottage cheese + 1/4 cup almonds") with average nutritional values, OR search online for real recipes with actual links
   - When suggesting a recipe-based meal, include the recipe link in brackets: "Meal Name [recipe URL]"
   - Use provided nutrition data for user meals; get nutrition from recipes or verified databases for AI-suggested meals
   - All ingredients for suggested meals should appear in the shopping list (either "from pantry" or "to buy")
   - Meet daily protein target of ${profile.targetProtein}g
   - Consider post-workout protein timing (25-30g within 1-2 hours)

2. SHOPPING LIST:
   - FROM PANTRY: List pantry items that will be used in meals
   - TO BUY: List items needed for meals (including custom meal ingredients not in pantry)
   - Group items by category: produce, dairy, meat & seafood, frozen, grains, pantry staples, etc.
   - Return each item as a structured object with: name (lowercase canonical food name), quantity (readable string with unit), form (fresh/frozen/canned/dried — only when it matters), notes (optional usage context)
   - Use canonical food names: "chicken breast" not "Chicken Breast", "spinach" not "Baby Spinach (organic)"
   - If the same ingredient is needed in different forms (e.g., fresh spinach AND frozen spinach), list them as separate items with the form field set

OUTPUT FORMAT:
Return a JSON object with this exact structure:

{
  "weekOf": "${weekOf}",
  "proteinTarget": "${profile.targetProtein}g",
  "dailyMeals": [
    {
      "day": "Sunday",
      "breakfast": "Specific breakfast with protein amount",
      "lunch": "Specific lunch with protein amount",
      "dinner": "Dinner name + [Recipe Link] OR simple dinner",
      "snacks": "1-3 high-protein snacks with amounts"
    }
  ],
  "shoppingList": {
    "fromPantry": [
      {
        "category": "Protein",
        "items": [
          { "name": "chicken breast", "quantity": "1 lb" }
        ]
      }
    ],
    "toBuy": [
      {
        "category": "Produce",
        "items": [
          { "name": "spinach", "quantity": "1 bag", "form": "fresh" }
        ]
      }
    ]
  }
}

Include all 7 days (Sunday through Saturday) in dailyMeals.

IMPORTANT:
- Ensure all meal ingredients appear in the shopping list appropriately
- Use verified nutritional information from recipes or databases
- For simple meals, use standard USDA nutritional averages
- When suggesting recipe-based meals, search for real recipes and include actual links
- Place pinned meals on their assigned day/slot exactly

Return ONLY the JSON object, no other text.`;
}
