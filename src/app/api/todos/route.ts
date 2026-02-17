import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import TodoItem from "@/models/TodoItem";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const completedParam = request.nextUrl.searchParams.get("completed");

    const filter: Record<string, boolean> = {};
    if (completedParam !== null) {
      filter.completed = completedParam === "true";
    }

    const items = await TodoItem.find(filter)
      .sort({ category: 1, subcategory: 1, createdAt: 1 })
      .lean();

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to load to-do items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.category) {
      return NextResponse.json(
        { error: "title and category are required" },
        { status: 400 }
      );
    }

    const item = await TodoItem.create(body);
    return NextResponse.json(item.toObject(), { status: 201 });
  } catch (error) {
    console.error("POST /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to create to-do item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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
    const item = await TodoItem.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!item) {
      return NextResponse.json(
        { error: "To-do item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to update to-do item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }

    await TodoItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/todos error:", error);
    return NextResponse.json(
      { error: "Failed to delete to-do item" },
      { status: 500 }
    );
  }
}
