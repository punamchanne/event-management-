import mongoose, { Schema } from "mongoose";

const CollegeSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  code: { type: String, index: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: String,
  profileImage: String,
  address: {
    street: String,
    taluka: String,
    district: String,
    state: String,
    pincode: String,
  },
  website: String,
  admin: {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    phone: String,
    password: String,
  },
  stats: {
    totalEvents: { type: Number, default: 0 },
    totalStudents: { type: Number, default: 0 },
  },
});

const College =
  mongoose.models.College || mongoose.model("College", CollegeSchema);
export default College;
