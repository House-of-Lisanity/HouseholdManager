import { NextResponse } from "next/server";

export async function POST() {
  // Stubbed — LLM generation disabled during development
  return NextResponse.json(
    {
      error:
        "Nutrition estimation is disabled during development. Re-enable by connecting the LLM API.",
    },
    { status: 503 }
  );
}
