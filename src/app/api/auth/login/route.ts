import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  JWTPayload,
} from "@/lib/auth";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email: email.toLowerCase() });

    // Generic message to avoid revealing whether email exists
    const invalidMsg = "Invalid email or password";

    if (!user) {
      return NextResponse.json({ error: invalidMsg }, { status: 401 });
    }

    // Check if account is disabled
    if (user.disabled) {
      return NextResponse.json(
        { error: "This account has been disabled. Contact an administrator." },
        { status: 403 }
      );
    }

    // Check lockout
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockoutUntil.getTime() - Date.now()) / 60000
      );
      return NextResponse.json(
        {
          error: `Account temporarily locked. Try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.`,
        },
        { status: 429 }
      );
    }

    // Compare password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      // Increment failed attempts
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockoutUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
        user.failedLoginAttempts = 0;
      }

      await user.save();
      return NextResponse.json({ error: invalidMsg }, { status: 401 });
    }

    // Successful login — reset failed attempts, track login time
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    user.lastLoginAt = new Date();

    // Generate tokens
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
