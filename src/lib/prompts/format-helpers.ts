import {
  PantryItem,
  MealEntry,
  GymSession,
  OneOffItem,
  RecurringItem,
} from "@/types";
import { categorizeIngredients } from "@/lib/ingredient-matcher";

export function formatPantryForPrompt(items: PantryItem[]): string {
  if (items.length === 0) {
    return "No pantry items specified.";
  }

  const categorized: Record<string, PantryItem[]> = {
    protein: [],
    dairy: [],
    produce: [],
    grains: [],
    snacks: [],
    condiments: [],
    frozen: [],
    other: [],
  };

  items.forEach((item) => {
    const category = item.category || "other";
    if (categorized[category]) {
      categorized[category].push(item);
    } else {
      categorized.other.push(item);
    }
  });

  let output = "";
  Object.entries(categorized).forEach(([category, categoryItems]) => {
    if (categoryItems.length > 0) {
      output += `\n${category.toUpperCase()}:\n`;
      categoryItems.forEach((item) => {
        let itemLine = `- ${item.name} (${item.quantity} ${item.unit})`;
        if (item.expiresInDays !== undefined && item.expiresInDays <= 7) {
          itemLine += ` - EXPIRES IN ${item.expiresInDays} DAYS - USE SOON`;
        }
        if (item.notes) {
          itemLine += ` - ${item.notes}`;
        }
        output += itemLine + "\n";
      });
    }
  });

  return output;
}

export function formatMealEntries(
  meals: MealEntry[],
  pantryItems: PantryItem[]
): { pinned: string; available: string } {
  const pinned = meals.filter((m) => m.pinnedToDay && m.day);
  const available = meals.filter((m) => !m.pinnedToDay || !m.day);

  const formatMeal = (meal: MealEntry): string => {
    let line = `\n${meal.mealName}:\n`;
    line += `  Slot: ${meal.mealSlot}\n`;
    if (meal.day) line += `  Day: ${meal.day}\n`;
    if (meal.recipeUrl) line += `  Recipe: ${meal.recipeUrl}\n`;
    if (meal.nutrition) {
      const parts: string[] = [];
      if (meal.nutrition.calories) parts.push(`${meal.nutrition.calories} cal`);
      if (meal.nutrition.protein) parts.push(`${meal.nutrition.protein}g protein`);
      if (meal.nutrition.carbs) parts.push(`${meal.nutrition.carbs}g carbs`);
      if (meal.nutrition.fat) parts.push(`${meal.nutrition.fat}g fat`);
      if (parts.length > 0) line += `  Nutrition: ${parts.join(", ")}\n`;
    }
    if (meal.ingredients) {
      const ingredientMatches = categorizeIngredients(
        meal.ingredients,
        pantryItems
      );
      const fromPantry = ingredientMatches.filter((m) => m.inPantry);
      const toBuy = ingredientMatches.filter((m) => !m.inPantry);
      if (fromPantry.length > 0) {
        line += `  From Pantry: ${fromPantry.map((m) => m.ingredient).join(", ")}\n`;
      }
      if (toBuy.length > 0) {
        line += `  Need to Buy: ${toBuy.map((m) => m.ingredient).join(", ")}\n`;
      }
    }
    return line;
  };

  return {
    pinned: pinned.length > 0
      ? pinned.map(formatMeal).join("")
      : "No pinned meals.",
    available: available.length > 0
      ? available.map(formatMeal).join("")
      : "No additional meals specified.",
  };
}

export function formatGymSessions(sessions: GymSession[]): string {
  if (sessions.length === 0) {
    return "No gym sessions specified.";
  }

  const DAYS = [
    "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday", "Sunday",
  ];
  let output = "";

  DAYS.forEach((day) => {
    const daySession = sessions.find((s) => s.day === day);
    if (daySession) {
      output += `${day}: ${daySession.startTime} - ${daySession.endTime}`;
      if (daySession.gymType) {
        output += ` (${daySession.gymType})`;
      }
      output += "\n";
    }
  });

  return output;
}

export function formatOneOffItems(items: OneOffItem[]): string {
  if (items.length === 0) {
    return "No one-off items this week.";
  }

  const meetings = items.filter((i) => i.type === "meeting");
  const appointments = items.filter((i) => i.type === "appointment");
  const events = items.filter((i) => i.type === "event");

  let output = "";

  if (meetings.length > 0) {
    output += "\nMEETINGS:\n";
    meetings.forEach((m) => {
      output += `- ${m.day}: ${m.description} (${m.startTime} - ${m.endTime})\n`;
    });
  }

  if (appointments.length > 0) {
    output += "\nAPPOINTMENTS:\n";
    appointments.forEach((a) => {
      output += `- ${a.day}: ${a.description} (${a.startTime} - ${a.endTime})\n`;
    });
  }

  if (events.length > 0) {
    output += "\nEVENTS:\n";
    events.forEach((e) => {
      output += `- ${e.day}: ${e.description} (${e.startTime} - ${e.endTime})\n`;
    });
  }

  return output;
}

export function formatRecurringItems(items: RecurringItem[]): string {
  const activeItems = items.filter((i) => i.includeThisWeek);

  if (activeItems.length === 0) {
    return "No recurring items this week.";
  }

  const meetings = activeItems.filter((i) => i.type === "meeting");
  const chores = activeItems.filter((i) => i.type === "chore");

  let output = "";

  if (meetings.length > 0) {
    output += "\nRECURRING MEETINGS:\n";
    meetings.forEach((m) => {
      output += `- ${m.day}: ${m.description}`;
      if (m.startTime && m.endTime) {
        output += ` (${m.startTime} - ${m.endTime})`;
      }
      output += "\n";
    });
  }

  if (chores.length > 0) {
    output += "\nRECURRING CHORES:\n";
    chores.forEach((c) => {
      output += `- ${c.description} (${c.day})\n`;
    });
  }

  return output;
}
