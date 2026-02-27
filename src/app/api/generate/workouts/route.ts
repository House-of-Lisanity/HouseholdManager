import { NextRequest, NextResponse } from "next/server";
import { WorkoutsFormInput } from "@/types";
import { loadUserProfile } from "@/lib/profile-loader";
import { buildWorkoutsPrompt } from "@/lib/prompts/workouts-prompt";
import { generatePlanFromLLM } from "@/lib/llm-client";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import WorkoutsResult from "@/models/WorkoutsResult";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    const body = await request.json();
    const { weekOf, ...formData } = body as WorkoutsFormInput & { weekOf: string };

    const profile = await loadUserProfile(auth.user.userId);
    const prompt = buildWorkoutsPrompt(formData, weekOf, profile);
    const llmResponse = await generatePlanFromLLM(prompt, { maxTokens: 2000 });
    const result = JSON.parse(llmResponse);

    await connectToDatabase();
    const resultWeekOf = result.weekOf || weekOf;
    await WorkoutsResult.findOneAndUpdate(
      { userId: auth.user.userId, weekOf: resultWeekOf },
      { $set: { ...result, weekOf: resultWeekOf, userId: auth.user.userId } },
      { upsert: true }
    );

    const response = NextResponse.json(result);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("Workouts generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate workout plan" },
      { status: 500 }
    );
  }
}
