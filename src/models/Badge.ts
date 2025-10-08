import mongoose, { Schema } from "mongoose";

const BadgeSchema = new Schema({
  name: { type: String, required: true, index: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  description: String,
  iconUrl: String,
  criteria: String, // e.g., "Completed 5 programs", "Top performer"
  createdAt: { type: Date, default: Date.now },
});

const Badge = mongoose.models.Badge || mongoose.model("Badge", BadgeSchema);
export default Badge;
