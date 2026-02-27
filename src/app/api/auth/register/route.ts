import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import {
  hashPassword,
  validatePassword,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  setAuthCookies,
  JWTPayload,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, confirmPassword } = await request.json();

    // Validate required fields
    if (!email || !name || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return NextResponse.json(
        { error: "Password requirements not met", details: passwordCheck.errors },
        { status: 400 }
      );
    }

    // Confirm passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check for existing email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // First user becomes admin
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? "admin" : "user";

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      password: hashedPassword,
      role,
    });

    // Generate tokens
    const payload: JWTPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(user._id.toString());

    // Store refresh token hash
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();

    // Set cookies and respond
    const response = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );

    setAuthCookies(response, accessToken, refreshToken);
    return response;
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
