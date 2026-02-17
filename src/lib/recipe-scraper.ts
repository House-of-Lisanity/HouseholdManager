import * as cheerio from "cheerio";

export interface ScrapedRecipe {
  title?: string;
  calories?: string;
  protein?: string;
  carbs?: string;
  fat?: string;
  servings?: string;
  ingredients?: string[];
}

function stripUnits(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.replace(/[^\d.]/g, "").trim();
}

function findRecipeInJsonLd(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
    return null;
  }

  const obj = data as Record<string, unknown>;

  if (obj["@type"] === "Recipe") return obj;

  if (
    Array.isArray(obj["@type"]) &&
    (obj["@type"] as string[]).includes("Recipe")
  ) {
    return obj;
  }

  if (obj["@graph"] && Array.isArray(obj["@graph"])) {
    for (const item of obj["@graph"]) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
  }

  return null;
}

export async function scrapeRecipe(
  url: string
): Promise<ScrapedRecipe | null> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; WeeklyPlanner/1.0; recipe-parser)",
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) return null;

  const html = await response.text();
  const $ = cheerio.load(html);

  const scripts = $('script[type="application/ld+json"]');
  if (scripts.length === 0) return null;

  for (let i = 0; i < scripts.length; i++) {
    try {
      const raw = $(scripts[i]).html();
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      const recipe = findRecipeInJsonLd(parsed);

      if (!recipe) continue;

      const nutrition = recipe.nutrition as Record<string, unknown> | undefined;
      const ingredients = recipe.recipeIngredient as string[] | undefined;

      return {
        title: (recipe.name as string) || undefined,
        calories: nutrition ? stripUnits(nutrition.calories) : undefined,
        protein: nutrition ? stripUnits(nutrition.proteinContent) : undefined,
        carbs: nutrition
          ? stripUnits(nutrition.carbohydrateContent)
          : undefined,
        fat: nutrition ? stripUnits(nutrition.fatContent) : undefined,
        servings:
          typeof recipe.recipeYield === "string"
            ? stripUnits(recipe.recipeYield)
            : Array.isArray(recipe.recipeYield)
              ? stripUnits((recipe.recipeYield as string[])[0])
              : undefined,
        ingredients: ingredients || undefined,
      };
    } catch {
      continue;
    }
  }

  return null;
}
