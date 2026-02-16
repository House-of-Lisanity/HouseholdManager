import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import WorkoutLog from "@/models/WorkoutLog";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const weekOf = request.nextUrl.searchParams.get("weekOf");

    if (!weekOf) {
      return NextResponse.json(
        { error: "weekOf parameter is required" },
        { status: 400 }
      );
    }

    const logs = await WorkoutLog.find({ weekOf })
      .sort({ date: 1 })
      .lean();

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "Failed to load workout logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.weekOf || !body.completionType || !body.workoutType) {
      return NextResponse.json(
        { error: "weekOf, completionType, and workoutType are required" },
        { status: 400 }
      );
    }

    const log = await WorkoutLog.create(body);
    return NextResponse.json(log.toObject(), { status: 201 });
  } catch (error) {
    console.error("POST /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "Failed to create workout log" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    const log = await WorkoutLog.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!log) {
      return NextResponse.json(
        { error: "Workout log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error("PUT /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "Failed to update workout log" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await WorkoutLog.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/workout-logs error:", error);
    return NextResponse.json(
      { error: "Failed to delete workout log" },
      { status: 500 }
    );
  }
}
