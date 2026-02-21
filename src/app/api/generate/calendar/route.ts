import { NextRequest, NextResponse } from "next/server";
import { CalendarFormInput } from "@/types";
import { loadUserProfile } from "@/lib/profile-loader";
import { buildCalendarPrompt } from "@/lib/prompts/calendar-prompt";
import { generatePlanFromLLM } from "@/lib/llm-client";
import { connectToDatabase } from "@/lib/mongodb";
import CalendarResult from "@/models/CalendarResult";

export async function POST(request: NextRequest) {
  try {
    const formData: CalendarFormInput = await request.json();

    const profile = await loadUserProfile();
    const prompt = buildCalendarPrompt(formData, profile);
    const llmResponse = await generatePlanFromLLM(prompt, { maxTokens: 8000 });
    const result = JSON.parse(llmResponse);

    // Persist generated result
    const weekOf = result.weekOf || formData.weekOf;
    await connectToDatabase();
    await CalendarResult.findOneAndUpdate(
      { weekOf },
      { $set: { ...result, weekOf } },
      { upsert: true }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Calendar generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar plan" },
      { status: 500 }
    );
  }
}
