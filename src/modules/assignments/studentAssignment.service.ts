import { createSubmissionTypeModel, SubmissionTypeModel } from "src/types/submission.type";
import { AssignmentModel } from "../../model/assignment.Model";
import { SubmissionModel } from "../../model/submission.Model";
import { EnrolledModel } from "../../model/enrolled.Model";

class studentAssignment{
       
    //student
    async getAll(limit:number ,page: number, courseId: string, userId: string,){
        const skip = (page - 1) * limit;

        const assignments = await AssignmentModel.find().skip(skip).limit(limit).populate('courseId');
        if(assignments.length === 0) throw new Error('Data not found');

        const totalAssignments = await AssignmentModel.countDocuments();
        const totalPages = Math.ceil(totalAssignments / limit);

        return { page, limit, totalAssignments, totalPages, assignments};
    }

    async create({ assignmentId, studentId, files }: createSubmissionTypeModel) {
        const checkAssignmentAndEnrollment = async () => {
            const [assignmentData, enrollmentData] = await Promise.all([
                AssignmentModel.findById(assignmentId),
                EnrolledModel.findOne({ student: studentId, status: "in-progress" })
            ]);
    
            if (!assignmentData) throw new Error('Assignment not found');
            if (!enrollmentData) throw new Error('User is not enrolled in the course or not in-progress');
    
            return assignmentData;
        };
    
        const assignmentData = await checkAssignmentAndEnrollment();
        
        const currentDate = new Date();
        const status = assignmentData.date.end < currentDate ? "Overdue" : "Submitted";
    
        const existingSubmission = await SubmissionModel.findOne({ assignmentId, studentId });
    
        if(existingSubmission){
            const updatedSubmission = await SubmissionModel.findByIdAndUpdate(
                existingSubmission._id,
                { files, status },
                { new: true }
            );
            if (!updatedSubmission) throw new Error('Submission update failed');
            return updatedSubmission;
        }

        const newSubmission = await SubmissionModel.create({
            assignmentId,
            studentId,
            files,
            status
        });
    
        if (!newSubmission) throw new Error('Submission creation failed');
        return newSubmission;
    }
    
}

export default new studentAssignment();

