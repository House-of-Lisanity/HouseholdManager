import { NextRequest, NextResponse } from "next/server";
import { CalendarFormInput, TodoItem } from "@/types";
import { loadUserProfile } from "@/lib/profile-loader";
import { buildCalendarPrompt } from "@/lib/prompts/calendar-prompt";
import { generatePlanFromLLM } from "@/lib/llm-client";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import CalendarResult from "@/models/CalendarResult";
import TodoItemModel from "@/models/TodoItem";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    const formData: CalendarFormInput = await request.json();

    const profile = await loadUserProfile(auth.user.userId);
    await connectToDatabase();
    const taggedTodos: TodoItem[] = await TodoItemModel.find({
      userId: auth.user.userId,
      taggedForWeek: formData.weekOf,
      completed: false,
    }).lean();
    const prompt = buildCalendarPrompt(formData, profile, taggedTodos);
    const llmResponse = await generatePlanFromLLM(prompt, { maxTokens: 8000 });
    const result = JSON.parse(llmResponse);

    const weekOf = result.weekOf || formData.weekOf;
    await CalendarResult.findOneAndUpdate(
      { userId: auth.user.userId, weekOf },
      { $set: { ...result, weekOf, userId: auth.user.userId } },
      { upsert: true }
    );

    const response = NextResponse.json(result);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("Calendar generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate calendar plan" },
      { status: 500 }
    );
  }
}
