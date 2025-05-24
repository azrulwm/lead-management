// app/api/submit-form/route.ts

import { LeadFormData } from "@/components/LeadForm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: LeadFormData = await request.json();

    // Debug: Check if environment variable is loaded
    console.log("SHEET_URL:", process.env.SHEET_URL);

    if (!process.env.SHEET_URL) {
      return NextResponse.json(
        { message: "SHEET_URL environment variable is not set" },
        { status: 500 }
      );
    }

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Forward the request to Google Apps Script
    const response = await fetch(process.env.SHEET_URL, {
      method: "POST",
      body: JSON.stringify(body),
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
    console.error("Error submitting to Google Sheets:", error);
    return NextResponse.json(
      {
        message: "Error submitting form",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
