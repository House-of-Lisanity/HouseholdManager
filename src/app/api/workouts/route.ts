import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import WorkoutPlan from "@/models/WorkoutPlan";

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

    const plan = await WorkoutPlan.findOne({ weekOf }).lean();
    return NextResponse.json(plan);
  } catch (error) {
    console.error("GET /api/workouts error:", error);
    return NextResponse.json(
      { error: "Failed to load workout plan" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
      { weekOf: body.weekOf },
      { $set: body },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json(plan);
  } catch (error) {
    console.error("PUT /api/workouts error:", error);
    return NextResponse.json(
      { error: "Failed to save workout plan" },
      { status: 500 }
    );
  }
}
