import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, index: true },
    password: { type: String },
    profileImage: { type: String },
    roles: {
      type: String,
      default: "student",
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      index: true,
    },
    enrollmentId: { type: String, index: true },
    profile: {
      bio: String,
      skills: [String], // for recommendations
      interests: [String], // tags for personalization
    },
    badges: [{ id: String, awardedAt: Date }],
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    createdAt: { type: Date, default: Date.now },
    lastSeen: { type: Date },
    // ML hints:
    textSummary: String,
    embeddingId: String,
  },
  { timestamps: true }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", StudentSchema);
export default Student;
