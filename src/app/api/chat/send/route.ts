import dbConfig from "@/config/db.config";
import Message from "@/models/Message";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: string;
      };
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { programId, receiverId, message } = await req.json();
    if (!programId || !receiverId || !message || !message.trim()) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    let senderRole: "student" | "program-manager";
    if (decoded.role === "student") {
      senderRole = "student";
    } else if (decoded.role === "program-manager") {
      senderRole = "program-manager";
    } else {
      return NextResponse.json({ success: false, message: "Forbidden role" }, { status: 403 });
    }

    const newMessage = await Message.create({
      senderId: decoded.id,
      receiverId,
      programId,
      senderRole,
      message: message.trim(),
    });

    return NextResponse.json({ success: true, message: newMessage }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/chat/send:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
