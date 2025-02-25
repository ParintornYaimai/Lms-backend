import { EnrolledModel } from "../../model/enrolled.Model";
import { SubmissionModel } from "../../model/submission.Model";


class dashboardService{

    async finishAssignment(userId: string) {
        const EnrolledData = await EnrolledModel.find({student: userId, status: "in-progress"}).populate('course').lean();
        if(EnrolledData.length === 0) throw new Error('Assignments not found');
    
        const SubmissionData = await SubmissionModel.find({studentId: userId, status: "Submitted"}).populate({ path: 'assignmentId',select: 'courseId'}).lean();
        if(SubmissionData.length === 0){
            return {
                totalCourses: EnrolledData.length,
                totalSubmissions: 0,
            };
        }

        const uniqueSubmittedCourses = new Set(SubmissionData.map(submission => (submission.assignmentId as any)?.courseId?.toString()).filter(courseId => courseId));
        return {
            totalCourses: EnrolledData.length, 
            totalSubmissions: uniqueSubmittedCourses.size 
        };
    }
    
}

export default new dashboardService();