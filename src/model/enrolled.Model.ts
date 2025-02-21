import mongoose, { Schema } from "mongoose";
import { EnrolledTypeModel } from "../types/enrolled.type";

const EnrolledSchema = new Schema<EnrolledTypeModel>({
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    status: {
        type: String,
        enum: ['not started',  'in-progress', 'active', 'completed'], 
        default: 'not started',
    },
}, { timestamps: true });

export const EnrolledModel = mongoose.model<EnrolledTypeModel>('Enrolled', EnrolledSchema); 