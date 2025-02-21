import mongoose, { Schema } from "mongoose";
import { AssignmentTypeModel } from "../types/assignment.type";

const assignmentSchema = new Schema<AssignmentTypeModel>({
    title: {type: String, required: true},
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    passpercen: { type: Number, required: true },
    date: {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    files: [{
        url: { type: String, required: true },
        name: {type: String, required: true},
        type: { type: String, enum: ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png"], required: true },
        size: { type: Number }
    }],
    totalmark: { type: Number, default: 0 },  
}, { timestamps: true });

export const AssignmentModel = mongoose.model<AssignmentTypeModel>("Assignment", assignmentSchema);