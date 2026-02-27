import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  clearAuthCookies,
  JWTPayload,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "No refresh token" },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      const response = NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    await connectToDatabase();
    const user = await User.findById(payload.userId).select(
      "email name role refreshTokenHash"
    );

    // Verify token hash matches DB (detects token reuse)
    if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
      const response = NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
      clearAuthCookies(response);
      return response;
    }

    // Issue new token pair (rotation)
    const newPayload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(newPayload);
    const newRefreshToken = generateRefreshToken(user._id.toString());

    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    setAuthCookies(response, newAccessToken, newRefreshToken);
    return response;
  } catch (err) {
    console.error("Token refresh error:", err);
    return NextResponse.json(
      { error: "Token refresh failed" },
      { status: 500 }
    );
  }
}
