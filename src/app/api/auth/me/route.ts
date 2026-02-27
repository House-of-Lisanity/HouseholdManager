import { NextRequest, NextResponse } from "next/server";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

const NAME_MAX_LENGTH = 100;

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const user = await User.findById(auth.user.userId).select(
      "email name role createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });

    mergeAuthCookies(response, auth);
    return response;
  } catch (err) {
    console.error("Get user error:", err);
    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    const trimmed = name.trim();
    if (trimmed.length > NAME_MAX_LENGTH) {
      return NextResponse.json(
        { error: `Name must be ${NAME_MAX_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(auth.user.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.name = trimmed;
    await user.save();

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });

    mergeAuthCookies(response, auth);
    return response;
  } catch (err) {
    console.error("Update user error:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
