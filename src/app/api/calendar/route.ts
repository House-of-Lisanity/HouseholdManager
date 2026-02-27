import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import CalendarPlan from "@/models/CalendarPlan";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

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

    let query = CalendarPlan.findOne({ userId: auth.user.userId, weekOf });

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
    const response = NextResponse.json(plan);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/calendar error:", error);
    return NextResponse.json(
      { error: "Failed to load calendar plan" },
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

    const plan = await CalendarPlan.findOneAndUpdate(
      { userId: auth.user.userId, weekOf: body.weekOf },
      { $set: { ...body, userId: auth.user.userId } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    const response = NextResponse.json(plan);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("PUT /api/calendar error:", error);
    return NextResponse.json(
      { error: "Failed to save calendar plan" },
      { status: 500 }
    );
  }
}
