import dbConfig from "@/config/db.config";
import Event from "@/models/Event";
import Program from "@/models/Program";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Event ID is required" }, { status: 400 });
    }
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodeId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    
    // Ensure the event belongs to this college
    const event = await Event.findOne({ _id: id, college: decodeId.id });
    if (!event) {
      return NextResponse.json({ message: "Event not found or unauthorized" }, { status: 404 });
    }
    
    // Delete associated programs
    await Program.deleteMany({ event: id });
    
    // Delete the event
    await Event.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Event cancelled/deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error in delete-event", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
