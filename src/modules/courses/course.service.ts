// import { TeacherModel } from "../../model/teacher.Model";
import { CourseModel } from "../../model/course.Model";
import { CreateCourse, UpdateCourse } from "../../types/course.type";
import { CategoryModel, SubCategoryModel } from "../../model/category.Model";
import { EnrolledModel } from "../../model/enrolled.Model";
import mongoose from "mongoose";
import { TeacherModel } from "../../model/teacher.Model";
import { userModel } from "../../model/user.Model";

class CourseService{
    
    async getAllForUser(studentId: string){
        if(!studentId) throw new Error('User Id is required')

        const enrolledData = await EnrolledModel.aggregate([
            { $match: { student: new mongoose.Types.ObjectId(studentId) } },
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
                            courseId: "$course", 
                            title: "$courseDetails.title",
                            subtitle: "$courseDetails.subtitle",
                            thumbnailurl: "$courseDetails.thumbnailurl", 
                        }
                    },
                    enrolledIds: { $first: "$_id"  }
                }
            }]); 
        if(enrolledData.length === 0) throw new Error("Data not found")
        
        return enrolledData
    }
    
    async startCourse(courseId: string, studentId: string){
        if(!courseId) throw new Error("Course ID is required");
        const newCourseId = new mongoose.Types.ObjectId(courseId);

        const enrolledExisting = await EnrolledModel.exists({ student: studentId, course: newCourseId });
        if (!enrolledExisting) throw new Error("You are not enrolled for this course.");

        const updateEnrolleStatus = await EnrolledModel
        .findOneAndUpdate({student: studentId, course: newCourseId},{ $set:{status: 'in-progress'}},{new: true})
        if(!updateEnrolleStatus) throw new Error("Unable to start the course")

        return updateEnrolleStatus;
    }

    async getInProgressCourses(studentId: string, courseId: string, enrolledId: string){
        if (!courseId || !studentId || !enrolledId)throw new Error("Course ID and Student ID and Enrolled Id are required");

        const enrolleData = await EnrolledModel.findOne({
            _id: enrolledId,
            student: studentId,
            course: courseId,
            status: "in-progress"
        });
        if(!enrolleData) throw new Error("Enrolled record not found or not in-progress");

        const courseData = await CourseModel.findById(courseId).lean();
        if (!courseData) throw new Error("Course not found");

        return courseData;
    }

    async getAll(teacherId: string){
        const courseData = await CourseModel.find({createby: teacherId})
        .select('-createby -assignment -students').sort({ createdAt: -1 }).lean(); 
        if(courseData.length === 0) throw new Error('No courses found for this teacher');

        return courseData;
    }

    //เปลี่ยน Model เป้น Teacher 
    async create(courseData: CreateCourse,teacherId: string){
        const existingTeacher = await userModel.exists({_id: teacherId, role: "teacher"})
        if(!existingTeacher) throw new Error('Instructor does not exist.')

        const existingCourse = await CourseModel.countDocuments({
            title: courseData.title,
            coursetopic: courseData.coursetopic,
            createby: teacherId,
        });
        
        if (existingCourse >= 2) throw new Error('You cannot create more than 2 courses with the same title and topic');

        const newCourse = new CourseModel({...courseData,createby:teacherId});
        return await newCourse.save();
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
        if(!courseId || !teacherId) throw new Error("CourseId and teacherId is required")
        const deleteCourse = await CourseModel.findOneAndDelete({
            _id: courseId,
            createby: teacherId,
        });
    
        if(!deleteCourse) throw new Error('Course not found or you are not the creator of this course');
    
        return deleteCourse;
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