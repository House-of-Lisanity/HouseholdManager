import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import MealsResult from "@/models/MealsResult";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    const weekOf = request.nextUrl.searchParams.get("weekOf");
    if (!weekOf) {
      return NextResponse.json({ error: "weekOf is required" }, { status: 400 });
    }

    await connectToDatabase();
    const result = await MealsResult.findOne({ userId: auth.user.userId, weekOf }).lean();

    if (!result) {
      const response = NextResponse.json(null);
      mergeAuthCookies(response, auth);
      return response;
    }

    const { _id, __v, ...data } = result as Record<string, unknown>;
    const response = NextResponse.json(data);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/results/meals error:", error);
    return NextResponse.json(
      { error: "Failed to load meals result" },
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
      return NextResponse.json({ error: "weekOf is required" }, { status: 400 });
    }

    const result = await MealsResult.findOneAndUpdate(
      { userId: auth.user.userId, weekOf: body.weekOf },
      { $set: { ...body, userId: auth.user.userId } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    const response = NextResponse.json(result);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("PUT /api/results/meals error:", error);
    return NextResponse.json(
      { error: "Failed to save meals result" },
      { status: 500 }
    );
  }
}
