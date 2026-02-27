import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin, mergeAuthCookies } from "@/lib/apiAuth";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const users = await User.find()
      .select("email name role disabled lastLoginAt createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const response = NextResponse.json({
      users: users.map((u) => ({
        id: u._id.toString(),
        email: u.email,
        name: u.name,
        role: u.role,
        disabled: u.disabled ?? false,
        lastLoginAt: u.lastLoginAt ?? null,
        createdAt: u.createdAt,
      })),
    });

    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { error: "Failed to load users" },
      { status: 500 }
    );
  }
}
