import dbConfig from "@/config/db.config";
import Program from "@/models/Program";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const { programId, status } = await req.json();
    if (!programId || !status) {
      return NextResponse.json(
        { message: "Program ID and status are required." },
        { status: 400 }
      );
    }
    await Program.findByIdAndUpdate(programId, { status });
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
