import { NextRequest, NextResponse } from "next/server";
import { WorkoutsFormInput } from "@/types";
import { loadUserProfile } from "@/lib/profile-loader";
import { buildWorkoutsPrompt } from "@/lib/prompts/workouts-prompt";
import { generatePlanFromLLM } from "@/lib/llm-client";
import { connectToDatabase } from "@/lib/mongodb";
import WorkoutsResult from "@/models/WorkoutsResult";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekOf, ...formData } = body as WorkoutsFormInput & { weekOf: string };

    const profile = await loadUserProfile();
    const prompt = buildWorkoutsPrompt(formData, weekOf, profile);
    const llmResponse = await generatePlanFromLLM(prompt, { maxTokens: 2000 });
    const result = JSON.parse(llmResponse);

    // Persist generated result
    await connectToDatabase();
    await WorkoutsResult.findOneAndUpdate(
      { weekOf: result.weekOf || weekOf },
      { $set: { ...result, weekOf: result.weekOf || weekOf } },
      { upsert: true }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Workouts generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate workout plan" },
      { status: 500 }
    );
  }
}
