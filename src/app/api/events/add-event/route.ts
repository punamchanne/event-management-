import dbConfig from "@/config/db.config";
import Event from "@/models/Event";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { event } = await req.json();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodeId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    event.college = decodeId.id;
    const encryptedPassword = bcrypt.hashSync(event.organizer.password, 10);
    event.organizer.password = encryptedPassword;
    const newEvent = new Event(event);
    await newEvent.save();
    return NextResponse.json({ message: "Event added successfully" });
  } catch (error) {
    console.log("Error in add-event", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
