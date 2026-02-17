import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import RecurringItem from "@/models/RecurringItem";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const activeParam = request.nextUrl.searchParams.get("active");

    const filter: Record<string, boolean> = {};
    if (activeParam !== null) {
      filter.active = activeParam === "true";
    }

    const items = await RecurringItem.find(filter)
      .sort({ category: 1, frequency: 1 })
      .lean();

    return NextResponse.json(items);
  } catch (error) {
    console.error("GET /api/recurring-items error:", error);
    return NextResponse.json(
      { error: "Failed to load recurring items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body.title || !body.category || !body.frequency) {
      return NextResponse.json(
        { error: "title, category, and frequency are required" },
        { status: 400 }
      );
    }

    const item = await RecurringItem.create(body);
    return NextResponse.json(item.toObject(), { status: 201 });
  } catch (error) {
    console.error("POST /api/recurring-items error:", error);
    return NextResponse.json(
      { error: "Failed to create recurring item" },
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
    const item = await RecurringItem.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!item) {
      return NextResponse.json(
        { error: "Recurring item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("PUT /api/recurring-items error:", error);
    return NextResponse.json(
      { error: "Failed to update recurring item" },
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

    await RecurringItem.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/recurring-items error:", error);
    return NextResponse.json(
      { error: "Failed to delete recurring item" },
      { status: 500 }
    );
  }
}
