import Event from "@/models/Event";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ongoingEvents = await Event.find({ status: "published" })
      .populate("college")
      .sort({ createdAt: -1 })
      .sort({ popularityScore: -1 });
    return NextResponse.json({ events: ongoingEvents });
  } catch (error) {
    console.log("Error fetching ongoing events:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
