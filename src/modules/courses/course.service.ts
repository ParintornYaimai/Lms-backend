// import { TeacherModel } from "../../model/teacher.Model";
import { CourseModel } from "../../model/course.Model";
import { CreateCourse, UpdateCourse } from "../../types/course.type";
import { CategoryModel, SubCategoryModel } from "../../model/category.Model";
import { EnrolledModel } from "../../model/enrolled.Model";
import mongoose from "mongoose";
import { TeacherModel } from "../../model/teacher.Model";
import { AssignmentModel } from "../../model/assignment.Model";


class CourseService{
    
    async getAllForUser(studentId: string){
        if(!studentId) throw new Error('User Id is required')
        const enrolledData = await EnrolledModel.aggregate([
            { $match: { 
                student: new mongoose.Types.ObjectId(studentId),
                status: { $in: ["not started", "in-progress", "completed"] }
                } 
            },
            {
                $lookup: {
                    from: CourseModel.collection.name,
                    localField: "course",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            { $unwind: "$courseDetails" },
            {
                $group: {
                    _id: "$status",
                    total: { $sum: 1 },
                    courses: {
                        $push: {
                            enrolledId: "$_id",
                            courseId: "$course", 
                            title: "$courseDetails.title",
                            subtitle: "$courseDetails.subtitle",
                            thumbnailurl: "$courseDetails.thumbnailurl", 
                        }
                    },
                }
            }
        ]); 
        if(enrolledData.length === 0) throw new Error("Data not found")
        
        // const keycache = `course:all`
        // if(client) await client.setEx(keycache, 3600, JSON.stringify(enrolledData)); 
        return enrolledData
    }
    
    async startCourse(courseId: string, studentId: string) {
        const newCourseId = new mongoose.Types.ObjectId(courseId);
        
        const updateEnrolleStatus = await EnrolledModel
            .findOneAndUpdate(
                { student: studentId, course: newCourseId }, 
                { $set: { status: 'in-progress' } }, 
                { new: true }
            );
        
        if(!updateEnrolleStatus) throw new Error("You are not enrolled for this course");
        
        return updateEnrolleStatus;
    }       

    async getInProgressCourses(studentId: string, courseId: string, enrolledId: string) {
        if(!courseId || !studentId || !enrolledId) throw new Error("Course ID and Student ID and Enrolled Id are required");

        const enrolleData = await EnrolledModel.findOne({
            _id: enrolledId,
            student: studentId,
            course: courseId,
            status: "in-progress"
        })
        .populate({
            path: 'course',
            select: '_id title subtitle coursecrm coursecate coursesubjectcate coursetopic createby',
            populate: {
                path: 'createby',
                select: 'firstname lastname'
            }
        }).lean();

        if(!enrolleData) throw new Error("Enrolled record not found or not in-progress");
        if(!enrolleData.course) throw new Error("Course not found");

        return enrolleData.course;
    }

    async getAll(teacherId: string) {
        const courseData = await CourseModel.find({ createby: teacherId })
            .select('-createby -assignment -students')
            .populate({
            path: 'coursesubjectcate',
            select: 'name'
            })
            .sort({ createdAt: -1 })
            .lean();

        if (courseData.length === 0) throw new Error('No courses found for this teacher');

        return courseData;
    }

    async create(courseData: CreateCourse,teacherId: string) {
        const [existingTeacher, courses] = await Promise.all([
            TeacherModel.exists({_id: teacherId, role: "teacher"}),
            CourseModel.find({
                title: courseData.title,
                coursetopic: courseData.coursetopic,
                createby: teacherId,
            }).limit(2).select('_id').lean() 
        ]);
        
        if(!existingTeacher) throw new Error('Instructor does not exist.');
        if(courses.length >= 2) throw new Error('Cannot create more than 2 courses');
        
        return await CourseModel.collection.insertOne({
            ...courseData,
            createby: new mongoose.Types.ObjectId(teacherId),
            createdAt: new Date()
        });
    }

    
    async update(updateData: UpdateCourse ,courseId: string, teacherId: string){
        const existingCourse = await CourseModel.findById(courseId);
        if(!existingCourse || !existingCourse.createby.equals(teacherId)){
            throw new Error('Data not found or you are not the creator of this course');
        }
        
        existingCourse.set(updateData);
        return await existingCourse.save();
    }

    async delete(courseId: string, teacherId: string) {
        if (!courseId || !teacherId) throw new Error("CourseId and teacherId is required");

        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const deleteCourse = await CourseModel.findOne({
                _id: courseId,
                createby: teacherId,
            }).session(session);
    
            if (!deleteCourse) throw new Error('Course not found or you are not the creator of this course');

            await EnrolledModel.deleteMany({ courseId }).session(session);

            await AssignmentModel.deleteMany({ courseId }).session(session);

            await deleteCourse.deleteOne().session(session);

            await session.commitTransaction();

            session.endSession();
    
            return deleteCourse;
        } catch (error) {

            await session.abortTransaction();

            session.endSession();
    
            throw error;
        }
    }

    async getCate(){
        const cate = await CategoryModel.find().select('-createAt -updatedAt')
        if(cate.length === 0) throw new Error("Data not found");

        return cate
    }

    async getSubCateById(categoryId: string){
        if(!categoryId) throw new Error("Id is required")
            
        const subcate = await SubCategoryModel.find({categoryId}).select('-categoryId -createAt -updatedAt')
        if(subcate.length === 0) throw new Error("Data not found");

        return subcate
    }
    
}

export default new CourseService();