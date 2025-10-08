import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    payer: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    program: { type: mongoose.Schema.Types.ObjectId, ref: "Program" },
    amount: Number,
    platformCut: Number,
    paymentGatewayRef: String,
    status: {
      type: String,
      enum: ["initiated", "paid", "failed", "refunded"],
      default: "initiated",
    },
    createdAt: Date,
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
export default Payment;
