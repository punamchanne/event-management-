import dbConfig from "@/config/db.config";
import Message from "@/models/Message";
import Program from "@/models/Program";
import Student from "@/models/Student";
import Event from "@/models/Event";
import College from "@/models/College";
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

    if (decoded.role === "student") {
      const studentId = decoded.id;

      // Find unique programs where student has chatted
      const uniquePrograms = await Message.distinct("programId", {
        $or: [{ senderId: studentId }, { receiverId: studentId }],
      });

      const conversations = [];
      for (const progId of uniquePrograms) {
        const program = await Program.findById(progId).populate({
          path: "event",
          populate: { path: "college" },
        });
        if (!program) continue;

        const lastMsg = await Message.findOne({
          programId: progId,
          $or: [
            { senderId: studentId, receiverId: progId.toString() },
            { senderId: progId.toString(), receiverId: studentId },
          ],
        }).sort({ createdAt: -1 });

        conversations.push({
          program,
          lastMessage: lastMsg ? lastMsg.message : "No messages yet",
          lastMessageTime: lastMsg ? lastMsg.createdAt : program.createdAt,
        });
      }

      conversations.sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );

      return NextResponse.json({ success: true, conversations }, { status: 200 });
    } else if (decoded.role === "program-manager") {
      const programId = decoded.id;

      // Find unique student IDs from messages for this program
      const uniqueStudentIds = await Message.distinct("senderId", {
        programId,
        senderId: { $ne: programId },
      });

      const uniqueReceiverIds = await Message.distinct("receiverId", {
        programId,
        receiverId: { $ne: programId },
      });

      const studentIdsSet = new Set<string>([...uniqueStudentIds, ...uniqueReceiverIds]);

      const conversations = [];
      for (const studId of Array.from(studentIdsSet)) {
        const student = await Student.findById(studId).select("name email phone profileImage");
        if (!student) continue;

        const lastMsg = await Message.findOne({
          programId,
          $or: [
            { senderId: studId, receiverId: programId },
            { senderId: programId, receiverId: studId },
          ],
        }).sort({ createdAt: -1 });

        conversations.push({
          student,
          lastMessage: lastMsg ? lastMsg.message : "No messages yet",
          lastMessageTime: lastMsg ? lastMsg.createdAt : new Date(),
        });
      }

      conversations.sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );

      return NextResponse.json({ success: true, conversations }, { status: 200 });
    } else {
      return NextResponse.json({ success: false, message: "Forbidden role" }, { status: 403 });
    }
  } catch (error: any) {
    console.error("Error in GET /api/chat/conversations:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
