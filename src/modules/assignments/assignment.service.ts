import { CreateAssignment, UpdateScoreAssignment } from '../../types/assignment.type';
import {AssignmentModel} from '../../model/assignment.Model'
import {CourseModel} from '../../model/course.Model'
import { TeacherModel } from '../../model/teacher.Model';
import mongoose from 'mongoose';


class assignmentService{
    //student
    async getAlls(limit:number ,page: number){
        const skip = (page - 1) * limit;

        const assignments = await AssignmentModel.find().skip(skip).limit(limit).populate('course');
        if(assignments.length === 0) throw new Error('Data not found');

        const totalAssignments = await AssignmentModel.countDocuments();
        const totalPages = Math.ceil(totalAssignments / limit);

        return { page, limit, totalAssignments, totalPages, assignments};
    }

    async creates(){
        
    }
     
    //teacher
    async getById(assignmentId:string, teacherId: string){
        const assignments = await AssignmentModel.findById(assignmentId).populate({ path: "course", select: "createby",});
        if(!assignments) throw new Error('Data not found');
        
        const teacherIdFromCourse = (assignments.course as any).createby._id.toString();
        if (teacherIdFromCourse !== teacherId) {
            throw new Error("Forbidden: You do not have access to this assignment");
        }

        return assignments;
    }
    
    async create({subject, courseId, passpercen, schedule, endDate, files, status, action, submissions, score}: CreateAssignment){
        const checkCourses = await CourseModel.findById({courseId}); 
        if(!checkCourses) throw new Error('Course not found');

        if (isNaN(passpercen) || passpercen <= 0 || passpercen >= 100) {
            throw new Error('Pass percentage must be a number between 0 and 100');
        }

        if (!Array.isArray(schedule) || schedule.length !== 2 || !Array.isArray(endDate) || endDate.length !== 2) {
            throw new Error('Schedule and endDate must be arrays containing exactly two dates');
        }

        const [scheduleStart, scheduleEnd] = schedule.map((date) => new Date(date));
        const [endStart, endEnd] = endDate.map((date) => new Date(date));

        if (isNaN(scheduleStart.getTime()) || isNaN(scheduleEnd.getTime()) || isNaN(endStart.getTime()) || isNaN(endEnd.getTime())) {
            throw new Error('Invalid date format in schedule or endDate');
        }
        
        if (scheduleStart >= scheduleEnd) {
            throw new Error("Schedule start date must be earlier than the end date");
        }
        if (endStart <= scheduleEnd) {
            throw new Error("End date must be after the schedule end date");
        }

        const newAssignment = await AssignmentModel.create({
            subject,
            course: courseId,
            passpercen,
            schedule: { start: scheduleStart.toISOString(), end: scheduleEnd.toISOString() },
            endDate: { start: endStart.toISOString(), end: endEnd.toISOString() },
            files,
            status,
            action,
            submissions: Array.isArray(checkCourses.students)
            ? checkCourses.students.map(_id => ({
                studentId:_id,
                score: null,  
                file: null,   
                status: 'not submitted',  
            }))
            : [],
        });

        return newAssignment;
    }

    //ให้คะเเนน
    async update({assignmentId,scores}: UpdateScoreAssignment){
        const session = await mongoose.startSession();  
        session.startTransaction(); 

        try {
            const assignment = await AssignmentModel.findById(assignmentId).session(session);
            if (!assignment) {
                throw new Error('Assignment not found');
            }
            
            const updatedSubmissions = assignment.submissions.map(submission => {
                const scoreData = scores.find(data => data.studentId === submission.studentId.toString());
                if (scoreData) {
                    submission.score = scoreData.score;  
                    submission.status = 'graded';
                }
                return submission;
            });
            
            assignment.submissions = updatedSubmissions;
            
            await assignment.save({ session });
            
            await session.commitTransaction();
            
            session.endSession();
    
            return assignment;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }   

    async delete(assignmentId: string, teacherId: string){
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const teacherData = await TeacherModel.findById(teacherId).select('assignedAssignments').populate('Course');
            if(!teacherData) throw new Error('User not found');

            const hasPermission = teacherData.assignedAssignments.some((assignment: any) => assignment._id.equals(assignmentId));
            if (!hasPermission) {
                throw new Error('Forbidden: You do not have access to delete this assignment');
            }
            
            const assignment = await AssignmentModel.findByIdAndDelete(assignmentId, { session });
            if (!assignment) {
                throw new Error("Assignment ID not found");
            }
            
            await TeacherModel.updateMany(
                { assignedAssignments: assignmentId },
                { $pull: { assignedAssignments: assignmentId } },
                { session }
            );

            await session.commitTransaction();
            return assignment;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

export default new assignmentService();