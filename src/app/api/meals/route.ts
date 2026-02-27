import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import MealPlan from "@/models/MealPlan";

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

    const plan = await MealPlan.findOne({ userId: auth.user.userId, weekOf }).lean();
    const response = NextResponse.json(plan);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/meals error:", error);
    return NextResponse.json(
      { error: "Failed to load meal plan" },
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

    const plan = await MealPlan.findOneAndUpdate(
      { userId: auth.user.userId, weekOf: body.weekOf },
      { $set: { ...body, userId: auth.user.userId } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    const response = NextResponse.json(plan);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("PUT /api/meals error:", error);
    return NextResponse.json(
      { error: "Failed to save meal plan" },
      { status: 500 }
    );
  }
}
