import { NextResponse } from "next/server";
import { scrapeRecipe } from "@/lib/recipe-scraper";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const recipe = await scrapeRecipe(url);

    if (!recipe) {
      return NextResponse.json(
        { error: "No recipe data found at this URL" },
        { status: 404 }
      );
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("POST /api/parse-recipe error:", error);
    return NextResponse.json(
      { error: "Failed to parse recipe" },
      { status: 500 }
    );
  }
}
