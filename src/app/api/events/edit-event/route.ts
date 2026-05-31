import dbConfig from "@/config/db.config";
import Event from "@/models/Event";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function PUT(req: NextRequest) {
  try {
    const { event } = await req.json();
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const decodeId = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    
    // Find the event and verify ownership
    const existingEvent = await Event.findOne({ _id: event._id, college: decodeId.id });
    if (!existingEvent) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }
    
    // Build update object
    const updateData: any = {
      title: event.title,
      slug: event.slug,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      status: event.status,
      coverImage: event.coverImage,
      tags: event.tags,
      organizer: {
        name: event.organizer.name,
        email: event.organizer.email,
        phone: event.organizer.phone,
        password: existingEvent.organizer?.password // Default to existing
      }
    };
    
    // If password is updated
    if (event.organizer.password && event.organizer.password.trim() !== "") {
      const newPassword = event.organizer.password.trim();
      // Simple check: bcrypt hashes are 60 chars long and start with $2a$ or $2b$
      const isHashed = newPassword.length === 60 && (newPassword.startsWith("$2a$") || newPassword.startsWith("$2b$"));
      if (!isHashed) {
        updateData.organizer.password = bcrypt.hashSync(newPassword, 10);
      }
    }
    
    const updated = await Event.findByIdAndUpdate(event._id, updateData, { new: true });
    return NextResponse.json({ message: "Event updated successfully", event: updated });
  } catch (error) {
    console.log("Error in edit-event", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
