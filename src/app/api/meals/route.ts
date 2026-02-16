import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import MealPlan from "@/models/MealPlan";

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

    const plan = await MealPlan.findOne({ weekOf }).lean();
    return NextResponse.json(plan);
  } catch (error) {
    console.error("GET /api/meals error:", error);
    return NextResponse.json(
      { error: "Failed to load meal plan" },
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

    const plan = await MealPlan.findOneAndUpdate(
      { weekOf: body.weekOf },
      { $set: body },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json(plan);
  } catch (error) {
    console.error("PUT /api/meals error:", error);
    return NextResponse.json(
      { error: "Failed to save meal plan" },
      { status: 500 }
    );
  }
}
