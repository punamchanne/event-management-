import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, unique: true, index: true },
    description: String,
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      index: true,
    },
    organizer: {
      name: String,
      email: String,
      phone: String,
      password: String,
    },
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ["draft", "published", "archived", "completed", "cancelled"],
      default: "draft",
      index: true,
    },
    coverImage: String,
    tags: [String],
    programsCount: { type: Number, default: 0 },
    meta: { type: mongoose.Schema.Types.Mixed },
    // ML hints:
    popularityScore: { type: Number, default: 0, index: true }, // for ranking
    textSummary: String,
    embeddingId: String,
  },
  { timestamps: true }
);

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);
export default Event;
