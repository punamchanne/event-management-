import dbConfig from "@/config/db.config";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Event from "@/models/Event";
import Program from "@/models/Program";

dbConfig();
const _ = Event; // Prevent tree-shaking

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodedId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const userId = decodedId.id;
    const programs = await Program.find({ event: userId })
      .populate("event")
      .sort({ createdAt: -1 });
    return NextResponse.json({ programs }, { status: 200 });
  } catch (error) {
    console.log("Error in get-programs-by-organizer", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
