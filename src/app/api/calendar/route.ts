import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import CalendarPlan from "@/models/CalendarPlan";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const weekOf = request.nextUrl.searchParams.get("weekOf");
    const fields = request.nextUrl.searchParams.get("fields");

    if (!weekOf) {
      return NextResponse.json(
        { error: "weekOf parameter is required" },
        { status: 400 }
      );
    }

    let query = CalendarPlan.findOne({ weekOf });

    // Support partial field reads for cross-page data sharing
    if (fields) {
      const projection = fields.split(",").reduce(
        (acc, field) => {
          acc[field.trim()] = 1;
          return acc;
        },
        {} as Record<string, number>
      );
      query = query.select(projection);
    }

    const plan = await query.lean();
    return NextResponse.json(plan);
  } catch (error) {
    console.error("GET /api/calendar error:", error);
    return NextResponse.json(
      { error: "Failed to load calendar plan" },
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

    const plan = await CalendarPlan.findOneAndUpdate(
      { weekOf: body.weekOf },
      { $set: body },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    return NextResponse.json(plan);
  } catch (error) {
    console.error("PUT /api/calendar error:", error);
    return NextResponse.json(
      { error: "Failed to save calendar plan" },
      { status: 500 }
    );
  }
}
