import mongoose, { Schema } from "mongoose";

const TeamSchema = new Schema(
  {
    program: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      index: true,
    },
    credentials: {
      teamCode: String,
      password: String,
    },
    name: { type: String, required: true, unique: true, index: true },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    invited: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
      },
    ],
    status: {
      type: String,
      enum: ["open", "locked", "disqualified"],
      default: "open",
      index: true,
    },
    createdAt: { type: Date, default: Date.now },
    points: { type: Number, default: 0 }, // aggregated from rounds
    submissionCount: { type: Number, default: 0 },
    meta: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

const Team = mongoose.models.Team || mongoose.model("Team", TeamSchema);
export default Team;
