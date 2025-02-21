import {AssignmentTypeModel, ICourseDocument } from '../../types/assignment.type';
import {AssignmentModel} from '../../model/assignment.Model'
import {CourseModel} from '../../model/course.Model'
import { TeacherModel } from '../../model/teacher.Model';
import {SubmissionModel} from '../../model/submission.Model'
import { updateScoreInSubmission } from '../../types/submission.type';
import { EnrolledModel } from '../../model/enrolled.Model';


class teacherAssignment{
    
    private async checkAssignmentOwnership(assignmentId: string, teacherId: string) {

        const assignment = await AssignmentModel.findById(assignmentId).populate<{ courseId: ICourseDocument }>('courseId');

        if(!assignment) throw new Error("Assignment not found");

        const courseOwnerId = assignment.courseId.createby.toString();
        if(courseOwnerId !== teacherId) throw new Error("You don't have permission to access this assignment");

        return assignment;
    }

    //teacher
    async getAll(teacherId: string){
        const courseData = await CourseModel.find({createby: teacherId}).lean();
        if(courseData.length === 0) throw new Error("Course not found");
            
        const courseDataId = courseData.map(course=> course._id);
        const assignmentData = await AssignmentModel.find({courseId: courseDataId}).select('-createdAt -updatedAt').lean()
        if(assignmentData.length === 0 ) throw new Error("Assignment not found");

        return assignmentData;
    }

    async create({title, courseId, passpercen, date, files, totalmark, status}:AssignmentTypeModel){
        const course = await CourseModel.findById(courseId).lean();
        if(!course) throw new Error("Course not found");
        
        return await AssignmentModel.create({
            title, 
            courseId, 
            passpercen, 
            date, 
            files, 
            totalmark, 
            status
        });
    }

    // update assignment 
    async updateAssignment(assignmentId: string, updateData: Partial<AssignmentTypeModel>, teacherId: string) {
        await this.checkAssignmentOwnership(assignmentId, teacherId);
    
        const updatedAssignment = await AssignmentModel.findByIdAndUpdate(assignmentId, updateData, { new: true });
        if (!updatedAssignment) throw new Error("Assignment not found");
    
        return updatedAssignment;
    }

    async getResult(assignmentId: string,teacherId: string){
        await this.checkAssignmentOwnership(assignmentId, teacherId);

        const userInSubmissios = await SubmissionModel.find({assignmentId}).select('-_id -status -createdAt -updatedAt').lean();
        if(userInSubmissios.length === 0) throw new Error("Data not found");
        
        return userInSubmissios;
    }

    // update score
    async updateScore({assignmentId, updates}: updateScoreInSubmission,teacherId: string){
        await this.checkAssignmentOwnership(assignmentId, teacherId);

        const updatePromises = updates.map(update =>
            SubmissionModel.updateOne(
                { assignmentId, studentId: update.studentId },
                { $set: { score: update.score } }
            )
        );
        const results = await Promise.all(updatePromises);
        const allUpdated = results.every(result => result.modifiedCount > 0);

        if(allUpdated){
            return "Scores updated successfully";
        }else{
            throw new Error("Update failed");
        }
    }

    async delete(assignmentId: string, teacherId: string) {
        const checkRole = await this.checkAssignmentOwnership(assignmentId, teacherId);
        if(!checkRole) throw new Error("You can't delete");

        return AssignmentModel.findByIdAndDelete(assignmentId);
    }

    async checkOverdueSubmissions(){
        const currentDate = new Date();

        //find Assignment over value duedate
        const assignments = await AssignmentModel.find({
            "date.end": { $lt: currentDate }
        }).lean();

        const bulkOps:any[] = [];
        for(const assignment of assignments){
            //find all submission in assignment
            const submissions = await SubmissionModel.find({ assignmentId: assignment._id });

            // find student is enrolled in Course
            const studentInCourse = await EnrolledModel.find({ course: assignment.courseId }).populate("student").lean();
            if(!studentInCourse) throw new Error("Student not found");

            for(const student of studentInCourse){
                if(student.student){
                    //find student in course not submit Assignment
                    const submissionExists = submissions.find(sub => sub.studentId.toString() === student._id.toString());
                    if(!submissionExists){
                        bulkOps.push({
                            insertOne: {
                                document: {
                                    assignmentId: assignment._id,
                                    studentId: student.student._id,
                                    status: "Overdue",
                                }
                            }
                        });
                    }
                }
            }  
        }

        if(bulkOps.length > 0) await SubmissionModel.bulkWrite(bulkOps);
    }
    
}

export default new teacherAssignment();