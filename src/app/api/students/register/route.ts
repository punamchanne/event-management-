import dbConfig from "@/config/db.config";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { student } = await req.json();
    console.log("Received student data:", student);
    const existingStudent = await Student.findOne({ email: student.email });
    if (existingStudent) {
      return NextResponse.json(
        { message: "Student already registered" },
        { status: 400 }
      );
    }
    const encryptedPassword = await bcrypt.hash(student.password, 10);
    student.password = encryptedPassword;
    student.lastSeen = new Date();
    const newStudent = new Student(student);
    await newStudent.save();
    return NextResponse.json(
      { message: "Student registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in student registration route:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
