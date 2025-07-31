import mongoose, { Schema } from "mongoose";
import { FeedbackType } from "../types/feedback.type";


const feedbackSchema = new Schema<FeedbackType>({
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: false },
},{ timestamps: true });
  
export const FeedbackModel = mongoose.model<FeedbackType>("Feedback", feedbackSchema);