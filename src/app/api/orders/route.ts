import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://round-snowflake-9c31.devops-118.workers.dev/",
      { next: { revalidate: 10 } }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
