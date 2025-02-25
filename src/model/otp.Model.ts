import mongoose from "mongoose";
import { IOtp } from "../types/otp.type";

const otpSchema = new mongoose.Schema<IOtp>({
  email: {type: String, required: true},
  otp: {type: String, required: true},
  otpExpiresAt: {type: Date, required: true, expires: 300}
});

export const OtpModel = mongoose.model<IOtp>("Otp", otpSchema);