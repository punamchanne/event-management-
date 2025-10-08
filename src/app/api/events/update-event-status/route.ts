import dbConfig from "@/config/db.config";
import Event from "@/models/Event";
import { NextRequest, NextResponse } from "next/server";

dbConfig();
export async function POST(req: NextRequest) {
  try {
    const { eventId, status } = await req.json();
    if (!eventId || !status) {
      return NextResponse.json(
        { message: "Event ID and status are required." },
        { status: 400 }
      );
    }
    await Event.findByIdAndUpdate(eventId, { status });
    return NextResponse.json(
      { message: "Event status updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in update-event-status", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
