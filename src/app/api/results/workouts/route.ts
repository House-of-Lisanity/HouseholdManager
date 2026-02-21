import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import WorkoutsResult from "@/models/WorkoutsResult";

export async function GET(request: NextRequest) {
  try {
    const weekOf = request.nextUrl.searchParams.get("weekOf");
    if (!weekOf) {
      return NextResponse.json({ error: "weekOf is required" }, { status: 400 });
    }

    await connectToDatabase();
    const result = await WorkoutsResult.findOne({ weekOf }).lean();

    if (!result) return NextResponse.json(null);

    const { _id, __v, ...data } = result as Record<string, unknown>;
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/results/workouts error:", error);
    return NextResponse.json(
      { error: "Failed to load workouts result" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.weekOf) {
      return NextResponse.json({ error: "weekOf is required" }, { status: 400 });
    }

    const result = await WorkoutsResult.findOneAndUpdate(
      { weekOf: body.weekOf },
      { $set: body },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT /api/results/workouts error:", error);
    return NextResponse.json(
      { error: "Failed to save workouts result" },
      { status: 500 }
    );
  }
}
