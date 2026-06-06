import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    senderId: { type: String, required: true, index: true },
    receiverId: { type: String, required: true, index: true },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    senderRole: {
      type: String,
      enum: ["student", "program-manager"],
      required: true,
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;
