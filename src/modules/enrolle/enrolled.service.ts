import { EnrolledModel } from "../../model/enrolled.Model";
import { CategoryModel, SubCategoryModel } from "../../model/category.Model";
import { CourseModel } from "../../model/course.Model";
import { studentModel } from "../../model/student.Model";
import mongoose, { PipelineStage } from "mongoose";
import { client } from "../../../config/connectToRedis";

class enrolledService {
    async getCate(){
        const cate = await CategoryModel.find().select('-createAt -updatedAt');
        if(cate.length === 0) throw new Error("Cate not found")
        
        const cacheKey = `cate:all`; 
        if(client)await client.setEx(cacheKey, 604800, JSON.stringify(cate)); 

        return cate
    }

    async getSubCate(categoryId: string){
        const subCate = await SubCategoryModel.find({categoryId}).select('-createAt -updatedAt');
        if(subCate.length === 0) throw new Error("Cate not found")
        
        const cacheKey = `subcate:${categoryId}`; 
        if(client)await client.setEx(cacheKey, 604800, JSON.stringify(subCate)); 

        return subCate
    }

    // ค้นหาจาก subcateId
    async getCourseBySubCate(filter: object = {}){
        
        const isFilterApplied = Object.keys(filter).length > 0;
        const cacheKey = isFilterApplied ? `enrolle:${JSON.stringify(filter)}` : "enrolle:all";
    
        // สร้าง match condition
        const matchCondition = isFilterApplied ? { $match: { coursesubjectcate: filter } } : null;
        
        const pipeline: PipelineStage[] = [
            ...(matchCondition ? [matchCondition] : []), 
            {
                $lookup: {
                    from: studentModel.collection.name,
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

        if(client) await client.setEx(cacheKey, 3600, JSON.stringify(courseData));
    
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

        const keyNote = `enrolle:${courseData._id}`; 
        if(client)await client.setEx(keyNote, 3600, JSON.stringify(courseData));

        return courseData
    }

    
    async enrolled(courseId: string, studentId: string) {
        if(!courseId) throw new Error("Course ID is required");
        const newCourseId = new mongoose.Types.ObjectId(courseId);
    
        const checkCourse = await CourseModel.exists({ _id: newCourseId });
        if(!checkCourse) throw new Error('Course not found');
    
        const check = await EnrolledModel.findOne({ course: newCourseId, student: studentId });
        if(check) throw new Error("Already enrolled in the course");
        
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