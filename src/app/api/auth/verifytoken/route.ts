import dbConfig from "@/config/db.config";
import College from "@/models/College";
import Event from "@/models/Event";
import Student from "@/models/Student";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };
    if (!data) {
      return NextResponse.json({ error: "Invalid token" });
    }
    switch (data.role) {
      case "admin":
        return NextResponse.json({ user: data, status: 200 });
      case "student":
        const user = await Student.findById(data.id).select("-password");
        if (!user) {
          return NextResponse.json({ error: "User not found" });
        }
        return NextResponse.json({ user, status: 200 });
      case "college":
        const college = await College.findById(data.id).select("-password");
        if (!college) {
          return NextResponse.json({ error: "College not found" });
        }
        return NextResponse.json({ user: college, status: 200 });
      case "organizer":
        const event = await Event.findById(data.id).select("-password");
        if (!event) {
          return NextResponse.json({ error: "Organizer not found" });
        }
        return NextResponse.json({ user: event, status: 200 });
      default:
        return NextResponse.json({ error: "Invalid role" });
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 401 });
  }
}
