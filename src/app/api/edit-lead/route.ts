import { LeadStatus, UpdateStatusRequest } from "@/types/Lead";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: UpdateStatusRequest = await request.json();

    // Debug: Check if environment variable is loaded
    console.log("SHEET_URL:", process.env.SHEET_URL);

    if (!process.env.SHEET_URL) {
      return NextResponse.json(
        { message: "SHEET_URL environment variable is not set" },
        { status: 500 }
      );
    }

    if (!body.id || !body.status) {
      return NextResponse.json(
        { message: "Missing required fields: id and status" },
        { status: 400 }
      );
    }

    const validStatuses = Object.values(LeadStatus);
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        {
          message: `Invalid status. Must be one of: ${validStatuses.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    const response = await fetch(process.env.SHEET_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "updateStatus",
        id: body.id,
        status: body.status,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.result === "error") {
      return NextResponse.json(
        { message: data.message || "Error updating status" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating lead status:", error);
    return NextResponse.json(
      {
        message: "Error updating lead status",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
