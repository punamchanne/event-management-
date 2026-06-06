import mongoose, { Schema } from "mongoose";

const ProgramSchema = new Schema(
  {
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", index: true },
    coverImage: String,
    manager: {
      name: String,
      email: String,
      phone: String,
      password: String,
    },
    title: { type: String, required: true, index: true },
    slug: { type: String, index: true },
    description: String,
    programType: {
      type: String,
      enum: [
        "hackathon",
        "coding",
        "quiz",
        "workshop",
        "other",
        "puzzle",
        "ideathon",
        "brainstorm",
      ],
      default: "other",
    },
    rules: String,
    roundsCount: { type: Number, default: 1 },
    rounds: [
      {
        // optional: small embedded summary of rounds
        name: String,
        order: Number,
        startTime: Date,
        endTime: Date,
        instructions: String,
        submissionAllowed: Boolean,
        scoringMethod: {
          type: String,
          enum: ["automatic", "manual", "hybrid"],
        },
        maxScore: Number,
      },
    ],
    type: { type: String, enum: ["individual", "team"], default: "team" },
    teamSize: { min: Number, max: Number },
    maxTeams: Number,
    pricePerTeam: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "published", "ongoing", "completed", "cancelled"],
      default: "draft",
      index: true,
    },
    submissionCriteria: String,
    prizes: [{ title: String, amount: Number }],
    registrationStart: Date,
    registrationEnd: Date,
    eventDate: Date,
    totalRegistrations: { type: Number, default: 0 }, // denormalized
    totalParticipants: { type: Number, default: 0 },
    leaderBoardCache: [
      { teamId: mongoose.Schema.Types.ObjectId, score: Number },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // ML
    tags: [String],
    embeddingId: String,
  },
  { timestamps: true }
);

const Program =
  mongoose.models.Program || mongoose.model("Program", ProgramSchema);
export default Program;
