import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin, mergeAuthCookies } from "@/lib/apiAuth";
import User from "@/models/User";
import { hashPassword, validatePassword } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.success) return auth.response;

  try {
    const { id } = await params;
    const { newPassword } = await request.json();

    if (!newPassword) {
      return NextResponse.json(
        { error: "New password is required" },
        { status: 400 }
      );
    }

    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: "Password requirements not met", details: passwordCheck.errors },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    user.password = await hashPassword(newPassword);
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    user.refreshTokenHash = null;
    await user.save();

    const response = NextResponse.json({
      message: "Password reset successfully",
    });

    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("Admin password reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
