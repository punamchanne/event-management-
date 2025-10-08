import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import College from "@/models/College";
import dbConfig from "@/config/db.config";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { college } = await req.json();
    if (!college) {
      return NextResponse.json(
        { message: "College name is required" },
        { status: 400 }
      );
    }
    const collegeExists = await College.findOne({ name: college.name });
    if (collegeExists) {
      return NextResponse.json(
        { message: "College already exists" },
        { status: 400 }
      );
    }
    const encryptedPassword = await bcrypt.hash(college.admin.password, 10);
    college.admin.password = encryptedPassword;
    const newCollege = new College(college);
    await newCollege.save();
    return NextResponse.json(
      { message: "College added successfully", college: newCollege },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in adding college", error);
    return NextResponse.json(
      { message: "Error in adding college" },
      { status: 500 }
    );
  }
}
