import dbConfig from "@/config/db.config";
import Program from "@/models/Program";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function PUT(req: NextRequest) {
  try {
    const { program } = await req.json();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodeId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    
    // Find the program and verify owner
    const existingProgram = await Program.findById(program._id);
    if (!existingProgram) {
      return NextResponse.json({ message: "Program not found" }, { status: 404 });
    }
    
    // Build update object
    const updateData: any = {
      title: program.title,
      slug: program.slug,
      description: program.description,
      programType: program.programType,
      coverImage: program.coverImage,
      rules: program.rules,
      roundsCount: program.roundsCount,
      rounds: program.rounds,
      type: program.type,
      teamSize: program.teamSize,
      maxTeams: program.maxTeams,
      pricePerTeam: program.pricePerTeam,
      status: program.status,
      submissionCriteria: program.submissionCriteria,
      prizes: program.prizes,
      registrationStart: program.registrationStart,
      registrationEnd: program.registrationEnd,
      tags: program.tags,
      manager: {
        name: program.manager.name,
        email: program.manager.email,
        phone: program.manager.phone,
        password: existingProgram.manager?.password // Default to existing
      }
    };
    
    // If password is updated
    if (program.manager.password && program.manager.password.trim() !== "") {
      const newPassword = program.manager.password.trim();
      const isHashed = newPassword.length === 60 && (newPassword.startsWith("$2a$") || newPassword.startsWith("$2b$"));
      if (!isHashed) {
        updateData.manager.password = bcrypt.hashSync(newPassword, 10);
      }
    }
    
    const updated = await Program.findByIdAndUpdate(program._id, updateData, { new: true });
    return NextResponse.json({ message: "Program updated successfully", program: updated });
  } catch (error) {
    console.log("Error in edit-program", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
