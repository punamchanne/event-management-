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
    const program = await Program.findOne({ slug })
      .populate("event")
      .populate({
        path: "event",
        populate: { path: "college" },
      });
    if (!program) {
      return NextResponse.json(
        { message: "Program not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(program, { status: 200 });
  } catch (error) {
    console.log("Error in fetching program details", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
