import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import Profile from "@/models/Profile";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const profile = await Profile.findOne({ userId: auth.user.userId }).lean();

    if (!profile) {
      const response = NextResponse.json(null);
      mergeAuthCookies(response, auth);
      return response;
    }

    const response = NextResponse.json(profile);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to load profile" },
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

    const profile = await Profile.findOneAndUpdate(
      { userId: auth.user.userId },
      { $set: { ...body, userId: auth.user.userId } },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    const response = NextResponse.json(profile);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { error: "Failed to save profile" },
      { status: 500 }
    );
  }
}
