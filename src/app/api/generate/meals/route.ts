import { NextRequest, NextResponse } from "next/server";
import { MealsFormInput } from "@/types";
import { loadUserProfile } from "@/lib/profile-loader";
import { buildMealsPrompt } from "@/lib/prompts/meals-prompt";
import { generatePlanFromLLM } from "@/lib/llm-client";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import MealsResult from "@/models/MealsResult";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    const body = await request.json();
    const { weekOf, ...formData } = body as MealsFormInput & { weekOf: string };

    const profile = await loadUserProfile(auth.user.userId);
    const prompt = buildMealsPrompt(formData, weekOf, profile);
    const llmResponse = await generatePlanFromLLM(prompt, { maxTokens: 4000 });
    const result = JSON.parse(llmResponse);

    await connectToDatabase();
    const resultWeekOf = result.weekOf || weekOf;
    await MealsResult.findOneAndUpdate(
      { userId: auth.user.userId, weekOf: resultWeekOf },
      { $set: { ...result, weekOf: resultWeekOf, userId: auth.user.userId } },
      { upsert: true }
    );

    const response = NextResponse.json(result);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("Meals generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate meal plan" },
      { status: 500 }
    );
  }
}
