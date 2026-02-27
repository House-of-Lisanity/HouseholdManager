import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import WorkoutPlan from "@/models/WorkoutPlan";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const weekOf = request.nextUrl.searchParams.get("weekOf");

    if (!weekOf) {
      return NextResponse.json(
        { error: "weekOf parameter is required" },
        { status: 400 }
      );
    }

    const plan = await WorkoutPlan.findOne({ userId: auth.user.userId, weekOf }).lean();
    const response = NextResponse.json(plan);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/workouts error:", error);
    return NextResponse.json(
      { error: "Failed to load workout plan" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.weekOf) {
      return NextResponse.json(
        { error: "weekOf is required" },
        { status: 400 }
      );
    }

    const plan = await WorkoutPlan.findOneAndUpdate(
      { userId: auth.user.userId, weekOf: body.weekOf },
      { $set: { ...body, userId: auth.user.userId } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    const response = NextResponse.json(plan);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("PUT /api/workouts error:", error);
    return NextResponse.json(
      { error: "Failed to save workout plan" },
      { status: 500 }
    );
  }
}
