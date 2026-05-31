import jwt from "jsonwebtoken";
import dbConfig from "@/config/db.config";
import { NextRequest, NextResponse } from "next/server";
import Feedback from "@/models/Feedback";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    if (decoded.role !== "student") {
      return NextResponse.json({ message: "Access denied" }, { status: 403 });
    }

    const body = await req.json();
    const { programId, rating, comments } = body;

    if (!programId || !rating || !comments) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ message: "Rating must be a number between 1 and 5" }, { status: 400 });
    }

    // Check if feedback already exists for this student and program
    const existingFeedback = await Feedback.findOne({
      program: programId,
      user: decoded.id
    });

    if (existingFeedback) {
      return NextResponse.json({ message: "You have already submitted feedback for this program." }, { status: 400 });
    }

    const newFeedback = await Feedback.create({
      program: programId,
      user: decoded.id,
      rating: ratingNum,
      comments
    });

    return NextResponse.json({ success: true, feedback: newFeedback }, { status: 201 });
  } catch (error: any) {
    console.error("Error in creating student feedback:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
