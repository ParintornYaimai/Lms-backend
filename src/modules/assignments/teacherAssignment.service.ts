import { AssignmentTypeModel } from '../../types/assignment.type';
import { AssignmentModel } from '../../model/assignment.Model'
import { CourseModel } from '../../model/course.Model'
import { SubmissionModel } from '../../model/submission.Model'
import { updateScoreInSubmission } from '../../types/submission.type';
import { EnrolledModel } from '../../model/enrolled.Model';
import mongoose from 'mongoose';
import { studentModel } from '../../model/student.Model';
import { SubCategoryModel } from '../../model/category.Model';


class teacherAssignment {

    private async checkAssignmentOwnership(assignmentId: string, teacherId: string) {

        if(!assignmentId || !teacherId){
            throw new Error("Assignment ID and Teacher ID are required");
        }
        if(!mongoose.Types.ObjectId.isValid(assignmentId)){
            throw new Error("Invalid assignment ID format");
        }
        if(!mongoose.Types.ObjectId.isValid(teacherId)){
            throw new Error("Invalid teacher ID format");
        }

        const [assignment] = await AssignmentModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(assignmentId) }
            },
            {
                $lookup: {
                    from: CourseModel.collection.name,
                    localField: 'courseId',
                    foreignField: '_id',
                    as: 'course'
                }
            },
            {
                $match: {
                    'course.createby': new mongoose.Types.ObjectId(teacherId)
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    date: 1,
                    courseId: 1,
                    course: { $arrayElemAt: ['$course', 0] }
                }
            }
        ]);

        if(!assignment) throw new Error("Assignment not found or you don't have permission to access it");
        
        return assignment;
    }

    //teacher
    async getAll(teacherId: string) {
        const assignmentData = await AssignmentModel.aggregate([
            {
                $lookup: {
                    from: CourseModel.collection.name,
                    localField: "courseId",
                    foreignField: "_id",
                    as: "courseInfo"
                }
            },
            { $unwind: "$courseInfo" },
            {
                $match: {
                    "courseInfo.createby": new mongoose.Types.ObjectId(teacherId)
                }
            },
            {
                $lookup: {
                    from: SubCategoryModel.collection.name, // ชื่อ collection ต้องตรงกับใน MongoDB
                    localField: "courseInfo.coursesubjectcate",
                    foreignField: "_id",
                    as: "subjectInfo"
                }
            },
            { $unwind: { path: "$subjectInfo", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    passpercen: 1,
                    totalmark: 1,
                    date: 1,
                    status: 1,
                    files: 1,
                    courseId: "$courseInfo._id",
                    courseTitle: "$courseInfo.title",
                    courseSubjectCate: "$subjectInfo.name" 
                }
            }
        ]);

        if(assignmentData.length === 0) throw new Error("Assignment not found");
        return assignmentData;
    }

    async getById(assignmentId: string){
        const assignmentData = await AssignmentModel.findById(assignmentId)
        .populate({
            path: 'courseId',
            select: 'title subtitle coursesubjectcate', 
            populate: {
            path: 'coursesubjectcate',
            select: 'name', 
            },
        });

        return assignmentData
    }

    async create({ title, courseId, passpercen, date, files, totalmark, status }: AssignmentTypeModel) {
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
        if(!updatedAssignment) throw new Error("Assignment not found");

        return updatedAssignment;
    }

    async getResult(assignmentId: string, teacherId: string) {
        await this.checkAssignmentOwnership(assignmentId, teacherId);
        
        const submitter = SubmissionModel.aggregate([
            {
                $match: { 
                    assignmentId: new mongoose.Types.ObjectId(assignmentId),
                    files: { $exists: true, $ne: [] },
                    score: 0
                }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup:{
                    from:studentModel.collection.name,
                    localField:'studentId',
                    foreignField:'_id',
                    as: 'studentInfo'
                }
            },
            {
                $unwind: "$studentInfo"
            },
            {
                $addFields: {
                    formattedCreatedAt: {
                        $dateToString: {
                        format: "%d/%m/%Y", //วัน-เดือน-ปี
                        date: "$createdAt",
                        timezone: "Asia/Bangkok" 
                        }
                    }
                }
            },
            {
                $project:{
                    _id: 1,
                    "formattedCreatedAt": 1,
                    "studentInfo._id":1,
                    "studentInfo.firstname": 1,
                    "studentInfo.lastname": 1,
                    "files":1,
                    "status":1,
                    "score":1,

                }
            }
        ]);

        return submitter ;
    }

    // update score
    async updateScore({ assignmentId, updates }: updateScoreInSubmission, teacherId: string) {
        await this.checkAssignmentOwnership(assignmentId, teacherId);
        if(!updates) throw new Error("No updates provided");

        const bulkOperations = updates.map(update => ({
            updateOne: {
                filter: { 
                    assignmentId, 
                    studentId: new mongoose.Types.ObjectId(update.studentId) 
                },
                update: { 
                    $set: { 
                        score: update.score,
                    } 
                }
            }
        }));

        const bulkResult = await SubmissionModel.bulkWrite(bulkOperations, {ordered: false});
        
        const successCount = bulkResult.modifiedCount; 
        if(successCount != 0) return "Scores updated successfully";
    }

    async delete(assignmentId: string, teacherId: string) {
        const checkRole = await this.checkAssignmentOwnership(assignmentId, teacherId);
        if(!checkRole) throw new Error("You can't delete");

        return AssignmentModel.findByIdAndDelete(assignmentId);
    }

    async checkOverdueSubmissions() {
        const currentDate = new Date();
        
        const overdueData = await AssignmentModel.aggregate([
            {
                $match: {
                    "date.end": { $lt: currentDate }
                }
            },
            {
                $lookup: {
                    from: EnrolledModel.collection.name,
                    localField: "courseId", 
                    foreignField: "course",
                    as: "enrolledStudents"
                }
            },
            {
                $lookup: {
                    from: SubmissionModel.collection.name,
                    localField: "_id",
                    foreignField: "assignmentId", 
                    as: "submissions"
                }
            },
            {
                $unwind: "$enrolledStudents"
            },
            {
                $match: {
                    $expr: {
                        $not: {
                            $in: ["$enrolledStudents.student", "$submissions.studentId"]
                        }
                    }
                }
            },
            {
                $project: {
                    assignmentId: "$_id",
                    studentId: "$enrolledStudents.student", 
                    status: { $literal: "Overdue" }
                }
            }
        ]);
        
        if(overdueData.length > 0){
            const bulkOps = overdueData.map(data => ({ insertOne: { document: data }}));
            
            await SubmissionModel.bulkWrite(bulkOps, { ordered: false });
        }
    }

}

export default new teacherAssignment();