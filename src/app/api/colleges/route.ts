import dbConfig from "@/config/db.config";
import College from "@/models/College";
import { NextResponse } from "next/server";

dbConfig();

export async function GET() {
  try {
    const colleges = await College.find().select("-password");
    return NextResponse.json({ colleges }, { status: 200 });
  } catch (error) {
    console.log("Error while fetching colleges:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
