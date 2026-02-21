import { NextRequest, NextResponse } from "next/server";
import { MealsFormInput } from "@/types";
import { loadUserProfile } from "@/lib/profile-loader";
import { buildMealsPrompt } from "@/lib/prompts/meals-prompt";
import { generatePlanFromLLM } from "@/lib/llm-client";
import { connectToDatabase } from "@/lib/mongodb";
import MealsResult from "@/models/MealsResult";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekOf, ...formData } = body as MealsFormInput & { weekOf: string };

    const profile = await loadUserProfile();
    const prompt = buildMealsPrompt(formData, weekOf, profile);
    const llmResponse = await generatePlanFromLLM(prompt, { maxTokens: 4000 });
    const result = JSON.parse(llmResponse);

    // Persist generated result
    await connectToDatabase();
    await MealsResult.findOneAndUpdate(
      { weekOf: result.weekOf || weekOf },
      { $set: { ...result, weekOf: result.weekOf || weekOf } },
      { upsert: true }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Meals generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
