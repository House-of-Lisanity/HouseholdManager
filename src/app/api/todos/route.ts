import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAuth, mergeAuthCookies } from "@/lib/apiAuth";
import TodoItem from "@/models/TodoItem";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.success) return auth.response;

  try {
    await connectToDatabase();

    const completedParam = request.nextUrl.searchParams.get("completed");

    const filter: Record<string, unknown> = { userId: auth.user.userId };
    if (completedParam !== null) {
      filter.completed = completedParam === "true";
    }

    const items = await TodoItem.find(filter)
      .sort({ category: 1, subcategory: 1, createdAt: 1 })
      .lean();

    const response = NextResponse.json(items);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to load to-do items" },
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

    if (!body.title || !body.category) {
      return NextResponse.json(
        { error: "title and category are required" },
        { status: 400 }
      );
    }

    const item = await TodoItem.create({ ...body, userId: auth.user.userId });
    const response = NextResponse.json(item.toObject(), { status: 201 });
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to create to-do item" },
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

    const clearableFields = [
      "weeklyPriority",
      "weeklyHoursMax",
      "taggedForWeek",
      "completedAt",
      "subcategory",
      "location",
    ];
    const unsetFields: Record<string, 1> = {};
    for (const field of clearableFields) {
      if (field in updateData && updateData[field] == null) {
        unsetFields[field] = 1;
        delete updateData[field];
      }
    }

    const updateOp: Record<string, unknown> = { $set: updateData };
    if (Object.keys(unsetFields).length > 0) {
      updateOp.$unset = unsetFields;
    }

    const item = await TodoItem.findOneAndUpdate(
      { _id, userId: auth.user.userId },
      updateOp,
      { new: true, runValidators: true }
    ).lean();

    if (!item) {
      return NextResponse.json(
        { error: "To-do item not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(item);
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("PUT /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to update to-do item" },
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

    await TodoItem.findOneAndDelete({ _id: id, userId: auth.user.userId });
    const response = NextResponse.json({ success: true });
    mergeAuthCookies(response, auth);
    return response;
  } catch (error) {
    console.error("DELETE /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to delete to-do item" },
      { status: 500 }
    );
  }
}
