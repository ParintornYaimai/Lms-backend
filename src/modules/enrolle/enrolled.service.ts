import { EnrolledModel } from "../../model/enrolled.Model";
import { CategoryModel, SubCategoryModel } from "../../model/category.Model";
import { CourseModel } from "../../model/course.Model";
import { userModel } from "../../model/user.Model";
import { EnrolledCourseData } from "../../types/enrolled.type";
import mongoose, { PipelineStage } from "mongoose";

class enrolledService {
    async getCate(){
        const cate = await CategoryModel.find().select('-createAt -updatedAt');
        if(cate.length === 0) throw new Error("Cate not found")

        return cate
    }

    async getSubCate(categoryId: string){
        const subCate = await SubCategoryModel.find({categoryId}).select('-createAt -updatedAt');
        if(subCate.length === 0) throw new Error("Cate not found")

        return subCate
    }

    // ค้นหาจาก subcateId
    async getCourseBySubCate(filter: object = {}): Promise<EnrolledCourseData[]> {
        
        const matchCondition = Object.keys(filter).length > 0 ? { $match: { coursesubjectcate: filter } } : null;
    
        const pipeline: PipelineStage[] = [
            ...(matchCondition ? [matchCondition] : []), 
            {
                $lookup: {
                    from: userModel.collection.name,
                    localField: "students",
                    foreignField: "_id",
                    as: "studentsInfo",
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    subtitle: 1,
                    coursecate: 1,
                    coursesubjectcate: 1,
                    thumbnailurl: 1,
                    studentCount: { $size: "$studentsInfo" },
                    rating: 1,
                    createdAt: 1,
                },
            },
            {
                $sort: { createdAt: -1 }, 
            },
        ];
    
        const courseData = await CourseModel.aggregate(pipeline);
    
        if(courseData.length === 0) throw new Error("Course not found");
    
        return courseData;
    }
    

    async getById(courseId: string){
        if(!courseId) throw new Error("Course ID is required")

        const isExist = await CourseModel.exists({ _id: courseId });
        if(!isExist) throw new Error("Course not found");
            
        const courseData = await CourseModel.findById(courseId)
        .populate([
            { path: 'coursecate', select: '-value' },
            { path: 'coursesubjectcate', select: '-value -categoryId -updatedAt' },
            { path: 'createby' }
        ]).select('-assignment -students').lean();
        
        if(!courseData) throw new Error('Course not found');

        return courseData
    }

    
    async enrolled(courseId: string, studentId: string) {
        if(!courseId) throw new Error("Course ID is required");
        const newCourseId = new mongoose.Types.ObjectId(courseId);
    
        // ตรวจสอบว่ามีคอร์สนี้ในฐานข้อมูลหรือไม่
        const checkCourse = await CourseModel.exists({ _id: newCourseId });
        if(!checkCourse) throw new Error('Course not found');
    
        // ตรวจสอบการลงทะเบียนคอร์สแล้ว
        const check = await EnrolledModel.findOne({ course: newCourseId, student: studentId });
        if(check) throw new Error("Already enrolled in the course");
        
        // ลงทะเบียนคอร์สใหม่
        const enrolled = await EnrolledModel.create({
            student: studentId,
            course: newCourseId,
            status: "not started",
        });
        if(!enrolled) throw new Error("Failed to enroll in the course");
    
        return enrolled;
    }
    
}

export default new enrolledService();