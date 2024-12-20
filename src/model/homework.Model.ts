import mongoose, { Schema } from "mongoose";
import { homeworkTypeModel } from "../types/homework.type";

const homeworkSchema = new Schema<homeworkTypeModel>({
    student: { type: Schema.Types.ObjectId, ref:"User" , required: true},
    subject: { type: Schema.Types.ObjectId, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    files: [{
       type: String
    }],
}, { timestamps: true });

export const AssignmentModel = mongoose.model<homeworkTypeModel>("Homework", homeworkSchema);

