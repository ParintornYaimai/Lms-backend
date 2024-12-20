import mongoose, { Schema } from "mongoose";
import { assignmentTypeModel } from "src/types/assignment.type";


const assignmentSchema = new Schema<assignmentTypeModel>({
    homeworkId: [{ type: Schema.Types.ObjectId, ref:"Homework" , required: true}],
    createdbyteacher:{type: Schema.Types.ObjectId, ref:"Homework" , required: true},
    subject: { type: Schema.Types.ObjectId, required: true },
    course: [{ type: Schema.Types.ObjectId, ref: "Course", required: true }],
    passpercen: { type: Number, required: true },
    schedule: { 
        type: [Date], 
        required: true,
    },
    endDate: { 
        type: [Date], 
        required: true,
    },
    files: [{
       type: String
    }],
    score:{
        type: String
    },
    status:{
        type: String
    },
}, { timestamps: true });

assignmentSchema.methods.validateDates = function() {
    if (this.schedule.length !== 2 || this.schedule[0] >= this.schedule[1]) {
        throw new Error('The information is incorrect.');
    }
    if (this.endDate.length !== 2 || this.endDate[0] <= this.schedule[1] || this.endDate[1] <= this.schedule[1]) {
        throw new Error('The information is incorrect.');
    }
};

export const AssignmentModel = mongoose.model<assignmentTypeModel>("Assignment", assignmentSchema);

