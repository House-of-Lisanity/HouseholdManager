import { NextRequest, NextResponse } from "next/server";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword, hashPassword, validatePassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    const { currentPassword, newPassword, confirmPassword } =
      await request.json();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate new password strength
    const passwordCheck = validatePassword(newPassword);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: "Password requirements not met", details: passwordCheck.errors },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New passwords do not match" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(auth.user.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );
    }

    // Update password
    user.password = await hashPassword(newPassword);
    await user.save();

    const response = NextResponse.json({
      message: "Password changed successfully",
    });

    mergeAuthCookies(response, auth);
    return response;
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "Password change failed" },
      { status: 500 }
    );
  }
}
