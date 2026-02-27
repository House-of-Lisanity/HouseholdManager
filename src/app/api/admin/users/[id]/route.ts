import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin, mergeAuthCookies } from "@/lib/apiAuth";
import User from "@/models/User";

/** Collections that store per-user data (keyed by userId) */
const USER_DATA_COLLECTIONS = [
  "profiles",
  "calendarplans",
  "calendarresults",
  "mealplans",
  "mealsresults",
  "workoutplans",
  "workoutsresults",
  "todoitems",
  "recurringitems",
  "meallogs",
  "workoutlogs",
];

/**
 * PATCH /api/admin/users/[id]
 * Update a user's role or disabled status.
 * Body: { role?: "admin" | "user", disabled?: boolean }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.success) return auth.response;

  try {
    const { id } = await params;
    const body = await request.json();

    // Prevent admins from modifying themselves
    if (id === auth.user.userId) {
      return NextResponse.json(
        { error: "You cannot modify your own account from the admin panel" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update role
    if (body.role !== undefined) {
      if (!["admin", "user"].includes(body.role)) {
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        );
      }
      user.role = body.role;
    }

    // Update disabled status
    if (body.disabled !== undefined) {
      user.disabled = Boolean(body.disabled);

      // If disabling, clear their refresh token so active sessions end
      if (user.disabled) {
        user.refreshTokenHash = null;
      }
    }

    await user.save();

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        disabled: user.disabled,
      },
    });

    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user and all their data.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (!auth.success) return auth.response;

  try {
    const { id } = await params;

    // Prevent admins from deleting themselves
    if (id === auth.user.userId) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete all user data from every collection
    const db = mongoose.connection.db;
    if (db) {
      for (const collectionName of USER_DATA_COLLECTIONS) {
        await db.collection(collectionName).deleteMany({ userId: id });
      }
    }

    // Delete the user record itself
    await User.findByIdAndDelete(id);

    const response = NextResponse.json({
      message: "User and all associated data deleted",
    });

    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
