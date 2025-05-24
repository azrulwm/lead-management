import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("SHEET_URL:", process.env.SHEET_URL);

    if (!process.env.SHEET_URL) {
      return NextResponse.json(
        { message: "SHEET_URL environment variable is not set" },
        { status: 500 }
      );
    }

    const response = await fetch(`${process.env.SHEET_URL}?action=get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error retrieving data from Google Sheets:", error);
    return NextResponse.json(
      {
        message: "Error retrieving leads data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
