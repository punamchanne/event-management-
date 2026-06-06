import dbConfig from "@/config/db.config";
import Message from "@/models/Message";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function GET(req: NextRequest) {
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

    const searchParams = req.nextUrl.searchParams;
    const programId = searchParams.get("programId");
    if (!programId) {
      return NextResponse.json({ success: false, message: "Program ID is required" }, { status: 400 });
    }

    let studentId = "";
    if (decoded.role === "student") {
      studentId = decoded.id;
    } else if (decoded.role === "program-manager") {
      studentId = searchParams.get("studentId") || "";
    } else {
      return NextResponse.json({ success: false, message: "Forbidden role" }, { status: 403 });
    }

    if (!studentId) {
      return NextResponse.json({ success: false, message: "Student ID is required" }, { status: 400 });
    }

    // Query messages between this student and this program manager
    const messages = await Message.find({
      programId,
      $or: [
        { senderId: studentId, receiverId: programId },
        { senderId: programId, receiverId: studentId },
      ],
    }).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/chat/messages:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
