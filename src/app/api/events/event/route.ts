import Event from "@/models/Event";
import Program from "@/models/Program";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    if (!slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }
    const event = await Event.findOne({ slug }).populate("college");
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    const programs = await Program.find({ event: event._id });
    event.popularityScore = event.popularityScore + 1;
    await event.save();
    return NextResponse.json({ event, programs }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
