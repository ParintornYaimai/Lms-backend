import mongoose, { Schema } from "mongoose";
import { assignmentTypeModel } from "src/types/assignment.type";

// one-to-many
const assignmentSchema = new Schema<assignmentTypeModel>({
    subject: { type: Schema.Types.ObjectId, required: true },
    course: { type: Schema.Types.ObjectId, ref:"Course" ,required: true, },
    passpercen: { type: Number, required: true },
    schedule: { 
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    endDate: { 
        start: { type: Date, required: true },
        end: { type: Date, required: true }
    },
    files: [ {
        url: { type: String, required: true },
        type: { type: String, enum: ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg","png",], required: true },
        size: { type: Number } // ขนาดไฟล์ KB/MB
    }],
    submissions: [{
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "User",  
            required: true
        },
        score: { type: Number, default: 0 },
        file: [{ type: String, default: null }], 
        status: { type: String, enum: ['not_submitted', 'submitted','graded','overdue'], default: 'not_submitted' },
    }],
    score: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Progress', 'Done',], default: 'Pending' },
    action: [{type: String}]
}, { timestamps: true });

assignmentSchema.methods.validateDates = function() {
    if (this.schedule.start >= this.schedule.end) {
        throw new Error('Schedule start date must be before the end date.');
    }
    if (this.endDate.start <= this.schedule.end || this.endDate.end <= this.schedule.end) {
        throw new Error('EndDate must be after the schedule end date.');
      }
};

export const AssignmentModel = mongoose.model<assignmentTypeModel>("Assignment", assignmentSchema);

