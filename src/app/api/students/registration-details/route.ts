import jwt from "jsonwebtoken";
import dbConfig from "@/config/db.config";
import { NextRequest, NextResponse } from "next/server";
import Team from "@/models/Team";
import Program from "@/models/Program";
import Event from "@/models/Event";
import College from "@/models/College";
import Student from "@/models/Student";

dbConfig();
const _unused = [Event, College, Student, Program]; // Prevent tree-shaking

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const regId = searchParams.get("regId");
    if (!regId) {
      return NextResponse.json({ message: "Registration ID is required" }, { status: 400 });
    }

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
        role: string;
      };
    } catch (err) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
    }

    // Find the registration (Team model)
    const team = await Team.findById(regId)
      .populate("members", "name email phone profileImage")
      .populate("leader", "name email phone profileImage")
      .populate({
        path: "program",
        populate: {
          path: "event",
          populate: { path: "college" }
        }
      });

    if (!team) {
      return NextResponse.json({ message: "Registration not found" }, { status: 404 });
    }

    // Verify the user is a member of the team
    const membersList = team.members || [];
    const isMember = membersList.some((m: any) => m && m._id && m._id.toString() === decoded.id) ||
                     (team.leader && typeof team.leader === "object" && team.leader._id && team.leader._id.toString() === decoded.id) ||
                     (team.leader && typeof team.leader === "string" && team.leader === decoded.id);

    // If it's a student and not a member, block access
    if (decoded.role === "student" && !isMember) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({ success: true, registration: team, userId: decoded.id }, { status: 200 });
  } catch (error: any) {
    console.error("Error in fetching single registration details:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
