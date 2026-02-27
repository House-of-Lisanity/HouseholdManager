import { NextRequest, NextResponse } from "next/server";
import { TodoItem } from "@/types";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import { loadUserProfile } from "@/lib/profile-loader";
import { buildCalendarPrompt } from "@/lib/prompts/calendar-prompt";
import { buildMealsPrompt } from "@/lib/prompts/meals-prompt";
import { buildWorkoutsPrompt } from "@/lib/prompts/workouts-prompt";
import { generatePlanFromLLM } from "@/lib/llm-client";
import CalendarPlan from "@/models/CalendarPlan";
import MealPlan from "@/models/MealPlan";
import WorkoutPlan from "@/models/WorkoutPlan";
import CalendarResult from "@/models/CalendarResult";
import MealsResult from "@/models/MealsResult";
import WorkoutsResult from "@/models/WorkoutsResult";
import TodoItemModel from "@/models/TodoItem";

const DEFAULT_CALENDAR_FORM = {
  weekOf: "",
  oneOffItems: [],
  recurringItems: [],
  eventNights: [],
  weeklyNotes: "",
};

const DEFAULT_MEALS_FORM = { weeklyFocus: "", meals: [] };
const DEFAULT_WORKOUTS_FORM = { weeklyFocus: "", workouts: [] };

type Section = "calendar" | "meals" | "workouts";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  const userId = auth.user.userId;

  try {
    const { weekOf, skip = [] } = await request.json() as {
      weekOf: string;
      skip?: Section[];
    };

    const needCalendar = !skip.includes("calendar");
    const needMeals = !skip.includes("meals");
    const needWorkouts = !skip.includes("workouts");

    if (!needCalendar && !needMeals && !needWorkouts) {
      const response = NextResponse.json({ calendar: null, meals: null, workouts: null });
      mergeAuthCookies(response, auth);
      return response;
    }

    await connectToDatabase();

    const [calendarDoc, mealsDoc, workoutsDoc, profile, taggedTodos] = await Promise.all([
      needCalendar ? CalendarPlan.findOne({ userId, weekOf }).lean() : null,
      needMeals ? MealPlan.findOne({ userId, weekOf }).lean() : null,
      needWorkouts ? WorkoutPlan.findOne({ userId, weekOf }).lean() : null,
      loadUserProfile(userId),
      needCalendar
        ? TodoItemModel.find({ userId, taggedForWeek: weekOf, completed: false }).lean<TodoItem[]>()
        : Promise.resolve([] as TodoItem[]),
    ]);

    const tasks: Promise<string>[] = [];
    const taskOrder: Section[] = [];

    if (needCalendar) {
      const form = calendarDoc || { ...DEFAULT_CALENDAR_FORM, weekOf };
      const prompt = buildCalendarPrompt(form, profile, taggedTodos);
      tasks.push(generatePlanFromLLM(prompt, { maxTokens: 8000 }));
      taskOrder.push("calendar");
    }

    if (needMeals) {
      const form = mealsDoc || DEFAULT_MEALS_FORM;
      const prompt = buildMealsPrompt(form, weekOf, profile);
      tasks.push(generatePlanFromLLM(prompt, { maxTokens: 4000 }));
      taskOrder.push("meals");
    }

    if (needWorkouts) {
      const form = workoutsDoc || DEFAULT_WORKOUTS_FORM;
      const prompt = buildWorkoutsPrompt(form, weekOf, profile);
      tasks.push(generatePlanFromLLM(prompt, { maxTokens: 2000 }));
      taskOrder.push("workouts");
    }

    const rawResults = await Promise.all(tasks);

    const results: Record<string, unknown> = {
      calendar: null,
      meals: null,
      workouts: null,
    };
    const saveOps: Promise<unknown>[] = [];

    rawResults.forEach((raw, i) => {
      const section = taskOrder[i];
      const parsed = JSON.parse(raw);
      results[section] = parsed;

      const resultWeekOf = parsed.weekOf || weekOf;
      const Model =
        section === "calendar" ? CalendarResult :
        section === "meals" ? MealsResult : WorkoutsResult;

      saveOps.push(
        Model.findOneAndUpdate(
          { userId, weekOf: resultWeekOf },
          { $set: { ...parsed, weekOf: resultWeekOf, userId } },
          { upsert: true }
        )
      );
    });

    await Promise.all(saveOps);

    const response = NextResponse.json(results);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("Generate all error:", error);
    return NextResponse.json(
      { error: "Failed to generate plans" },
      { status: 500 }
    );
  }
}
