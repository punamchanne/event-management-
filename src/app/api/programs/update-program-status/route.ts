import dbConfig from "@/config/db.config";
import Program from "@/models/Program";
import Team from "@/models/Team";
import Event from "@/models/Event";
import College from "@/models/College";
import Student from "@/models/Student";
import { sendCertificateAvailableEmail } from "@/helper/emailService";
import { NextRequest, NextResponse } from "next/server";

dbConfig();
const _unused = [Event, College, Student]; // Prevent tree-shaking

export async function POST(req: NextRequest) {
  try {
    const { programId, status } = await req.json();
    if (!programId || !status) {
      return NextResponse.json(
        { message: "Program ID and status are required." },
        { status: 400 }
      );
    }
    
    // Update status in database
    await Program.findByIdAndUpdate(programId, { status });

    // If marked as completed, send certificate notification emails to all registered participants
    if (status === "completed") {
      // Run the email notification in background without blocking API response
      (async () => {
        try {
          const program = await Program.findById(programId).populate({
            path: "event",
            populate: { path: "college" },
          });

          if (!program) return;

          const teams = await Team.find({ program: programId })
            .populate("leader", "name email")
            .populate("members", "name email");

          const baseUrl = process.env.BASE_URL || "http://localhost:3000";

          for (const team of teams) {
            const participants = [];
            if (team.leader && typeof team.leader === "object") {
              participants.push(team.leader);
            }
            if (team.members && Array.isArray(team.members)) {
              for (const m of team.members) {
                if (m && typeof m === "object") {
                  participants.push(m);
                }
              }
            }

            for (const p of participants) {
              if (p.email) {
                const certificateLink = `${baseUrl}/student/registered-events/certificate/${team._id}`;
                await sendCertificateAvailableEmail({
                  to: p.email,
                  studentName: p.name,
                  programTitle: program.title,
                  eventTitle: program.event?.title || "College Festival",
                  collegeName: program.event?.college?.name || "Host College",
                  certificateLink,
                });
              }
            }
          }
        } catch (emailErr) {
          console.error("Error sending completion certificate emails:", emailErr);
        }
      })();
    }

    return NextResponse.json(
      { message: "Program status updated successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in update-program-status", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

