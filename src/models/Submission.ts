import mongoose, { Schema } from "mongoose";

const SubmissionSchema = new Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      index: true,
    },
    round: { type: mongoose.Schema.Types.ObjectId, ref: "Round" },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", index: true },
    files: [{ url: String, filename: String, size: Number, mimeType: String }],
    links: [String],
    description: String,
    score: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["submitted", "under_review", "accepted", "rejected"],
      default: "submitted",
    },
    createdAt: { type: Date, default: Date.now },
    review: [
      {
        comments: String,
        score: Number,
        createdAt: Date,
      },
    ],
    // For ML:
    textSummary: String,
    embeddingId: String,
  },
  { timestamps: true }
);

const Submission =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
export default Submission;
