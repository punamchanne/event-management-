import dbConfig from "@/config/db.config";
import Program from "@/models/Program";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ message: "Program ID is required" }, { status: 400 });
    }
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const program = await Program.findById(id);
    if (!program) {
      return NextResponse.json({ message: "Program not found" }, { status: 404 });
    }
    
    // Delete the program
    await Program.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Program deleted successfully" }, { status: 200 });
  } catch (error) {
    console.log("Error in delete-program", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
