import { NutritionInfo } from "@/types";

interface ParsedNutritionLabel {
  mealName?: string;
  nutrition: NutritionInfo;
}

/**
 * Attempts to parse a pasted nutrition label (e.g., from Tovala or any
 * standard nutrition facts panel). Returns null if the text doesn't look
 * like a nutrition label.
 */
export function parseNutritionLabel(
  text: string
): ParsedNutritionLabel | null {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Must contain "Calories" somewhere to qualify as a nutrition label
  const hasCalories = lines.some((l) => /^calories$/i.test(l) || /^calories\s+\d/i.test(l));
  if (!hasCalories) return null;

  const result: ParsedNutritionLabel = {
    nutrition: {},
  };

  // Extract meal name: everything before "Nutrition" header
  const nutritionIndex = lines.findIndex((l) => /^nutrition$/i.test(l));
  if (nutritionIndex > 0) {
    result.mealName = lines.slice(0, nutritionIndex).join(" ");
  }

  // Parse key-value pairs from the label
  // Nutrition labels come in two formats:
  // 1. "Calories 630" (key + value on same line)
  // 2. "Calories" then "630" (key on one line, value on next)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || "";

    // Calories — same line: "Calories 630" or next line is a number
    if (/^calories$/i.test(line)) {
      const num = extractNumber(nextLine);
      if (num !== null) {
        result.nutrition.calories = num;
        i++;
      }
    } else if (/^calories\s+(\d[\d,.]*)/i.test(line)) {
      const match = line.match(/^calories\s+(\d[\d,.]*)/i);
      if (match) result.nutrition.calories = cleanNumber(match[1]);
    }

    // Protein
    if (/^protein$/i.test(line)) {
      const num = extractNumber(nextLine);
      if (num !== null) {
        result.nutrition.protein = num;
        i++;
      }
    } else if (/^protein\s+(\d[\d,.]*)/i.test(line)) {
      const match = line.match(/^protein\s+(\d[\d,.]*)/i);
      if (match) result.nutrition.protein = cleanNumber(match[1]);
    }

    // Carbs (may appear as "Carbs", "Total Carbohydrate", "Total Carbs")
    if (/^(total\s+)?carb(ohydrate)?s?$/i.test(line)) {
      const num = extractNumber(nextLine);
      if (num !== null) {
        result.nutrition.carbs = num;
        i++;
      }
    } else if (/^(total\s+)?carb(ohydrate)?s?\s+(\d[\d,.]*)/i.test(line)) {
      const match = line.match(/(\d[\d,.]*)\s*g?/);
      if (match) result.nutrition.carbs = cleanNumber(match[1]);
    }

    // Fat (use "Total Fat" to avoid matching "Saturated Fat", "Trans Fat")
    if (/^total\s+fat$/i.test(line)) {
      const num = extractNumber(nextLine);
      if (num !== null) {
        result.nutrition.fat = num;
        i++;
      }
    } else if (/^total\s+fat\s+(\d[\d,.]*)/i.test(line)) {
      const match = line.match(/^total\s+fat\s+(\d[\d,.]*)/i);
      if (match) result.nutrition.fat = cleanNumber(match[1]);
    }
  }

  // Must have at least calories to be considered valid
  if (!result.nutrition.calories) return null;

  return result;
}

/** Extract a number from a string like "630", "45g", "17g" */
function extractNumber(text: string): string | null {
  const match = text.match(/^(\d[\d,.]*)/);
  return match ? cleanNumber(match[1]) : null;
}

/** Remove commas from numbers */
function cleanNumber(value: string): string {
  return value.replace(/,/g, "");
}
