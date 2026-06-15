import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConfig from "@/config/db.config";
import Student from "@/models/Student";
import College from "@/models/College";
import Event from "@/models/Event";
import Program from "@/models/Program";

dbConfig();

const createTokenAndResponse = (data: object, route: string) => {
  const token = jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "7d" });
  const response = NextResponse.json({
    message: "Login successful",
    route,
    token,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    path: "/",
  });
  return response;
};

export async function POST(req: NextRequest) {
  const { email, password, role } = await req.json();
  console.log(email, password, role);
  if (!email || !password) {
    return NextResponse.json(
      { message: "Please fill all the fields" },
      { status: 400 }
    );
  }
  try {
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      return createTokenAndResponse(
        {
          id: "Admin",
          email,
          role: "admin",
          name: "Admin",
          profileImage:
            "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg",
          isVerified: true,
        },
        "/admin/dashboard"
      );
    }
    switch (role) {
      case "Student": {
        const student = await Student.findOne({ email });
        if (!student) {
          return NextResponse.json(
            { message: "Student not found. Please register first." },
            { status: 404 }
          );
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          student.password
        );
        if (!isPasswordValid) {
          return NextResponse.json(
            { message: "Invalid password. Please try again." },
            { status: 401 }
          );
        }
        var data = {
          id: student._id,
          email: student.email,
          role: "student",
          name: student.name,
          profileImage: student.profileImage,
          isVerified: student.isVerified,
        };
        return createTokenAndResponse(data, "/user/dashboard");
      }
      case "college": {
        const college = await College.findOne({
          $or: [{ email }, { "admin.email": email }],
        });
        if (!college) {
          return NextResponse.json(
            { message: "College not found. Please register first." },
            { status: 404 }
          );
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          college.admin.password
        );
        if (!isPasswordValid) {
          return NextResponse.json(
            { message: "Invalid password. Please try again." },
            { status: 401 }
          );
        }
        data = {
          id: college._id,
          email: college.admin.email,
          role: "college",
          name: college.admin.name,
          profileImage: college.profileImage,
          isVerified: true,
        };
        return createTokenAndResponse(data, "/college/dashboard");
      }
      case "organizer": {
        const event = await Event.findOne({ "organizer.email": email });
        if (!event) {
          return NextResponse.json(
            { message: "Event not found. Please register first." },
            { status: 404 }
          );
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          event.organizer.password
        );
        if (!isPasswordValid) {
          return NextResponse.json(
            { message: "Invalid password. Please try again." },
            { status: 401 }
          );
        }
        data = {
          id: event._id,
          email: event.organizer.email,
          role: "organizer",
          name: event.organizer.name,
          profileImage: event.organizer.profileImage,
          isVerified: true,
        };
        return createTokenAndResponse(data, "/organizer/dashboard");
      }
      case "program manager": {
        const program = await Program.findOne({ "manager.email": email });
        if (!program) {
          return NextResponse.json(
            { message: "Program not found. Please register first." },
            { status: 404 }
          );
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          program.manager.password
        );
        if (!isPasswordValid) {
          return NextResponse.json(
            { message: "Invalid password. Please try again." },
            { status: 401 }
          );
        }
        data = {
          id: program._id,
          email: program.manager.email,
          role: "program-manager",
          name: program.manager.name,
          profileImage: program.coverImage,
          isVerified: true,
        };
        return createTokenAndResponse(data, "/program-manager/dashboard");
      }
      case "student":
        const student = await Student.findOne({ email });
        if (!student) {
          return NextResponse.json(
            { message: "Student not found. Please register first." },
            { status: 404 }
          );
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          student.password
        );
        if (!isPasswordValid) {
          return NextResponse.json(
            { message: "Invalid password. Please try again." },
            { status: 401 }
          );
        }
        data = {
          id: student._id,
          email: student.email,
          role: "student",
          name: student.name,
          profileImage: student.profileImage,
          isVerified: true,
        };
        return createTokenAndResponse(data, "/student/dashboard");
      default:
        return NextResponse.json(
          { message: "Invalid role selected. Please try again." },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while logging in" },
      { status: 500 }
    );
  }
}
