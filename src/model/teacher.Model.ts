import mongoose, { Schema } from "mongoose";
import { TeacherModelType } from "../types/teacher.type";

const teacherSchema = new Schema<TeacherModelType>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'teacher' },
    phoneNumber: { type: String },
    department: { type: String },
    password: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    assignedAssignments: [{ type: Schema.Types.ObjectId, ref: "Assignment" }],
    profilepicture: { type: String, default: null },
    refreshTokens: [{ token: String, expiresAt: Date }]
}, { timestamps: true });

export const TeacherModel = mongoose.model<TeacherModelType>("Teacher", teacherSchema);