import mongoose, { Schema } from "mongoose";
import { SubmissionTypeModel } from "../types/submission.type";  // คุณอาจต้องเพิ่มการอ้างอิงที่เหมาะสมใน type

const submissionSchema = new Schema<SubmissionTypeModel>({
    assignmentId: { type: Schema.Types.ObjectId, ref: "Assignment", required: true},
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    score: { type: Number, default: 0 },
    files: [{
        url: { type: String, required: true },
        type: { type: String, enum: ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png"], required: true },
        size: { type: Number }  // ขนาดไฟล์ KB/MB
    }],
    status: { type: String, enum: ['Pending', 'Submitted', 'Overdue'], default: 'Pending' }, //Submitted = ส่งงานเเล้ว  Overdue = เกินกำหนด  Pending = รอดำเนินการ 
}, { timestamps: true });

export const SubmissionModel = mongoose.model<SubmissionTypeModel>("Submission", submissionSchema);
