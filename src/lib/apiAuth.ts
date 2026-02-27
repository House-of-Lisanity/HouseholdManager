import { NextRequest, NextResponse } from "next/server";
import {
  verifyAccessToken,
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  JWTPayload,
} from "./auth";
import { connectToDatabase } from "./mongodb";
import User from "@/models/User";

interface AuthSuccess {
  success: true;
  user: JWTPayload;
  response?: NextResponse; // Present when tokens were refreshed (caller should merge cookies)
}

interface AuthFailure {
  success: false;
  response: NextResponse;
}

type AuthCheck = AuthSuccess | AuthFailure;

/**
 * Require authentication on an API route.
 * If the access token is expired but the refresh token is valid,
 * new tokens are issued transparently.
 */
export async function requireAuth(request: NextRequest): Promise<AuthCheck> {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  // Try access token first
  if (accessToken) {
    const payload = verifyAccessToken(accessToken);
    if (payload) {
      return { success: true, user: payload };
    }
  }

  // Access token missing or expired — try refresh
  if (!refreshToken) {
    return {
      success: false,
      response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  const refreshPayload = verifyRefreshToken(refreshToken);
  if (!refreshPayload) {
    return {
      success: false,
      response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  // Verify refresh token matches what's stored in DB
  await connectToDatabase();
  const user = await User.findById(refreshPayload.userId).select(
    "email name role disabled refreshTokenHash"
  );

  if (!user || user.refreshTokenHash !== hashToken(refreshToken)) {
    return {
      success: false,
      response: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }

  if (user.disabled) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Account disabled" },
        { status: 403 }
      ),
    };
  }

  // Issue new tokens
  const newPayload: JWTPayload = {
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(user._id.toString());

  // Store new refresh token hash
  user.refreshTokenHash = hashToken(newRefreshToken);
  await user.save();

  // Create a response to carry the new cookies
  const tokenResponse = new NextResponse();
  setAuthCookies(tokenResponse, newAccessToken, newRefreshToken);

  return { success: true, user: newPayload, response: tokenResponse };
}

/**
 * Require admin role on an API route.
 */
export async function requireAdmin(request: NextRequest): Promise<AuthCheck> {
  const auth = await requireAuth(request);
  if (!auth.success) return auth;

  if (auth.user.role !== "admin") {
    return {
      success: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return auth;
}

/**
 * Merge refreshed auth cookies onto an outgoing response.
 * Call this when requireAuth returns a `response` with new tokens.
 */
export function mergeAuthCookies(
  target: NextResponse,
  authResult: AuthSuccess
): void {
  if (!authResult.response) return;

  for (const cookie of authResult.response.cookies.getAll()) {
    target.cookies.set(cookie.name, cookie.value);
  }
}
