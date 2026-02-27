import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import MealLog from "@/models/MealLog";

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

    const logs = await MealLog.find({ userId: auth.user.userId, weekOf })
      .sort({ date: 1, mealSlot: 1 })
      .lean();

    const response = NextResponse.json(logs);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/meal-logs error:", error);
    return NextResponse.json(
      { error: "Failed to load meal logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.weekOf || !body.completionType || !body.mealSlot) {
      return NextResponse.json(
        { error: "weekOf, completionType, and mealSlot are required" },
        { status: 400 }
      );
    }

    const log = await MealLog.create({ ...body, userId: auth.user.userId });
    const response = NextResponse.json(log.toObject(), { status: 201 });
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("POST /api/meal-logs error:", error);
    return NextResponse.json(
      { error: "Failed to create meal log" },
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

    if (!body._id) {
      return NextResponse.json(
        { error: "_id is required" },
        { status: 400 }
      );
    }

    const { _id, ...updateData } = body;
    const log = await MealLog.findOneAndUpdate(
      { _id, userId: auth.user.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!log) {
      return NextResponse.json(
        { error: "Meal log not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(log);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("PUT /api/meal-logs error:", error);
    return NextResponse.json(
      { error: "Failed to update meal log" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await MealLog.findOneAndDelete({ _id: id, userId: auth.user.userId });
    const response = NextResponse.json({ success: true });
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("DELETE /api/meal-logs error:", error);
    return NextResponse.json(
      { error: "Failed to delete meal log" },
      { status: 500 }
    );
  }
}
