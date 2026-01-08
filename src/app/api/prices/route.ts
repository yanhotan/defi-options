import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://pricing.thetanuts.finance/", {
      next: { revalidate: 5 },
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
