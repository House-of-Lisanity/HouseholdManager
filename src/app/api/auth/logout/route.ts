import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken, clearAuthCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    // Try to identify the user to clear their refresh token
    const accessToken = request.cookies.get("access_token")?.value;
    const refreshToken = request.cookies.get("refresh_token")?.value;

    let userId: string | null = null;

    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      if (payload) userId = payload.userId;
    }

    if (!userId && refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      if (payload) userId = payload.userId;
    }

    // Clear refresh token in DB
    if (userId) {
      await connectToDatabase();
      await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
    }

    // Clear cookies regardless
    const response = NextResponse.json({ success: true });
    clearAuthCookies(response);
    return response;
  } catch (err) {
    console.error("Logout error:", err);
    // Still clear cookies even if DB update fails
    const response = NextResponse.json({ success: true });
    clearAuthCookies(response);
    return response;
  }
}
