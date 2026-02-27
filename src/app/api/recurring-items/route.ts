import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import RecurringItem from "@/models/RecurringItem";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const activeParam = request.nextUrl.searchParams.get("active");

    const filter: Record<string, unknown> = { userId: auth.user.userId };
    if (activeParam !== null) {
      filter.active = activeParam === "true";
    }

    const items = await RecurringItem.find(filter)
      .sort({ category: 1, frequency: 1 })
      .lean();

    const response = NextResponse.json(items);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/recurring-items error:", error);
    return NextResponse.json(
      { error: "Failed to load recurring items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.category || !body.frequency) {
      return NextResponse.json(
        { error: "title, category, and frequency are required" },
        { status: 400 }
      );
    }

    const item = await RecurringItem.create({ ...body, userId: auth.user.userId });
    const response = NextResponse.json(item.toObject(), { status: 201 });
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("POST /api/recurring-items error:", error);
    return NextResponse.json(
      { error: "Failed to create recurring item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body._id) {
      return NextResponse.json(
        { error: "_id is required" },
        { status: 400 }
      );
    }

    const { _id, ...updateData } = body;
    const item = await RecurringItem.findOneAndUpdate(
      { _id, userId: auth.user.userId },
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!item) {
      return NextResponse.json(
        { error: "Recurring item not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(item);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("PUT /api/recurring-items error:", error);
    return NextResponse.json(
      { error: "Failed to update recurring item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await RecurringItem.findOneAndDelete({ _id: id, userId: auth.user.userId });
    const response = NextResponse.json({ success: true });
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("DELETE /api/recurring-items error:", error);
    return NextResponse.json(
      { error: "Failed to delete recurring item" },
      { status: 500 }
    );
  }
}
