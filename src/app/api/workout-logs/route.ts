import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import WorkoutLog from "@/models/WorkoutLog";

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

    const logs = await WorkoutLog.find({ userId: auth.user.userId, weekOf })
      .sort({ date: 1 })
      .lean();

    const response = NextResponse.json(logs);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "Failed to load workout logs" },
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

    if (!body.weekOf || !body.completionType || !body.workoutType) {
      return NextResponse.json(
        { error: "weekOf, completionType, and workoutType are required" },
        { status: 400 }
      );
    }

    const log = await WorkoutLog.create({ ...body, userId: auth.user.userId });
    const response = NextResponse.json(log.toObject(), { status: 201 });
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("POST /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "Failed to create workout log" },
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
    const log = await WorkoutLog.findOneAndUpdate(
      { _id, userId: auth.user.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!log) {
      return NextResponse.json(
        { error: "Workout log not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(log);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("PUT /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "Failed to update workout log" },
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

    await WorkoutLog.findOneAndDelete({ _id: id, userId: auth.user.userId });
    const response = NextResponse.json({ success: true });
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("DELETE /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "Failed to delete workout log" },
      { status: 500 }
    );
  }
}
