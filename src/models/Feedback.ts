import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  program: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  rating: { type: Number, min: 1, max: 5 },
  comments: String,
  createdAt: { type: Date, default: Date.now },
});

const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
export default Feedback;
