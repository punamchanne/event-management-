import dbConfig from "@/config/db.config";
import Program from "@/models/Program";
import Team from "@/models/Team";
import Event from "@/models/Event";
import College from "@/models/College";
import Student from "@/models/Student";
import { NextRequest, NextResponse } from "next/server";
import { sendProgramReminderEmail } from "@/helper/emailService";

dbConfig();
const _unused = [Event, College, Student];

const getSimulatedVenue = (programType: string = "other", title: string = "") => {
  const type = programType.toLowerCase();
  const lowerTitle = title.toLowerCase();
  if (type === "hackathon" || lowerTitle.includes("hack")) {
    return { name: "Main Auditorium & Innovation Center", block: "A Block - Ground Floor" };
  } else if (type === "coding" || lowerTitle.includes("code") || lowerTitle.includes("compile")) {
    return { name: "Advanced Programming Lab (CS-3)", block: "B Block - 2nd Floor, Room 204" };
  } else if (type === "quiz" || lowerTitle.includes("quiz") || lowerTitle.includes("trivia")) {
    return { name: "Sir MV Seminar Hall", block: "C Block - 1st Floor" };
  } else if (type === "workshop" || lowerTitle.includes("workshop") || lowerTitle.includes("learn")) {
    return { name: "Research Seminar Hall", block: "D Block - 1st Floor" };
  } else if (type === "puzzle" || lowerTitle.includes("puzzle") || lowerTitle.includes("treasure")) {
    return { name: "Recreation Hub & Outdoor Lawns", block: "Campus Main Grounds" };
  } else {
    return { name: "Conference Hall & Presentation Room", block: "A Block - 1st Floor, Room 102" };
  }
};

async function processReminders(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const programId = searchParams.get("programId");
    
    let programsToRemind = [];
    
    if (programId) {
      // Manual trigger for a specific program
      const programObj = await Program.findById(programId)
        .populate({
          path: "event",
          populate: { path: "college" }
        });
      if (programObj) {
        programsToRemind.push(programObj);
      }
    } else {
      // Automated scan: Find programs starting tomorrow (next 24-48 hours)
      const now = new Date();
      const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 0, 0, 0);
      
      const allActivePrograms = await Program.find({ 
        status: { $in: ["published", "ongoing"] } 
      }).populate({
        path: "event",
        populate: { path: "college" }
      });
      
      for (const prog of allActivePrograms) {
        let isTomorrow = false;
        
        // 1. Check parent event start date
        if (prog.event && prog.event.startDate) {
          const evStart = new Date(prog.event.startDate);
          if (evStart >= tomorrowStart && evStart < tomorrowEnd) {
            isTomorrow = true;
          }
        }
        
        // 2. Check rounds start time
        if (prog.rounds && prog.rounds.length > 0 && prog.rounds[0].startTime) {
          const roundStart = new Date(prog.rounds[0].startTime);
          if (roundStart >= tomorrowStart && roundStart < tomorrowEnd) {
            isTomorrow = true;
          }
        }
        
        // 3. Check program-specific eventDate
        if (prog.eventDate) {
          const evDate = new Date(prog.eventDate);
          if (evDate >= tomorrowStart && evDate < tomorrowEnd) {
            isTomorrow = true;
          }
        }
        
        if (isTomorrow) {
          programsToRemind.push(prog);
        }
      }
    }
    
    if (programsToRemind.length === 0) {
      return NextResponse.json({ success: true, message: "No programs scheduled for tomorrow.", sentCount: 0 });
    }
    
    let emailsSent = [];
    
    for (const prog of programsToRemind) {
      const teams = await Team.find({ program: prog._id })
        .populate("leader", "name email")
        .populate("members", "name email");
        
      const venue = getSimulatedVenue(prog.programType, prog.title);
      const startTime = (prog.rounds && prog.rounds.length > 0 && prog.rounds[0].startTime)
        ? prog.rounds[0].startTime
        : (prog.event?.startDate || new Date());
        
      for (const team of teams) {
        // Collect all participants
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
        
        // Send email to each participant
        for (const p of participants) {
          if (p.email) {
            await sendProgramReminderEmail({
              to: p.email,
              studentName: p.name,
              programTitle: prog.title,
              eventTitle: prog.event?.title || "College Festival",
              collegeName: prog.event?.college?.name || "Host College",
              venueName: venue.name,
              blockName: venue.block,
              startTime: startTime,
            });
            emailsSent.push({ email: p.email, student: p.name, program: prog.title });
          }
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Scanned and processed reminders.`,
      sentCount: emailsSent.length,
      sentEmails: emailsSent
    }, { status: 200 });
  } catch (error: any) {
    console.error("Error in reminders cron route:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return processReminders(req);
}

export async function POST(req: NextRequest) {
  return processReminders(req);
}
