import { NextResponse } from "next/server";

const BASEURL = "https://api.deezer.com"; // Your Deezer base URL

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const response = await fetch(`${BASEURL}/search/artist?q=${query}`);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching artists:", error);
    return NextResponse.json({ error: "Error fetching artists" }, { status: 500 });
  }
}
