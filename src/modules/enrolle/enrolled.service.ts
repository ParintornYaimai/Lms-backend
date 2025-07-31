import { EnrolledModel } from "../../model/enrolled.Model";
import { CategoryModel, SubCategoryModel } from "../../model/category.Model";
import { CourseModel } from "../../model/course.Model";
import mongoose, { PipelineStage } from "mongoose";
import { client } from "../../../config/connectToRedis";
import { FeedbackModel } from "../../model/feedback.Model";



class enrolledService {
    async getCate(){
        const cate = await CategoryModel.find().select('-createAt -updatedAt').lean();
        if(cate.length === 0) throw new Error("Cate not found")
        // const cacheKey = `cate:all`; 
        // if(client)await client.setEx(cacheKey, 604800, JSON.stringify(cate)); 

        return cate
    }

    async getSubCate(categoryId: string){
        const subCate = await SubCategoryModel.find({categoryId}).select('-createAt -updatedAt').lean();
        if(subCate.length === 0) throw new Error("Cate not found")
        
        const cacheKey = `subcate:${categoryId}`; 
        if(client)await client.setEx(cacheKey, 604800, JSON.stringify(subCate)); 

        return subCate
    }
    
    
    // ค้นหาจาก subcateId
    async getCourseBySubCate(sortBy: string, skip: number, limit: number, category?: string | string[]) {
        const pipeline: PipelineStage[] = [];
        
        // เพิ่ม match condition เฉพาะเมื่อมี category
        if(category){
            let categories: string[];
            
            if(Array.isArray(category)) {
                categories = category;
            }else{
                categories = typeof category === 'string' ? category.split(',') : [category];
            }
            
            categories = categories
                .map(id => id.trim())
                .filter(id => id.length > 0 && /^[0-9a-fA-F]{24}$/.test(id));
            
            if(categories.length > 0){
                const cat = categories.map(id => new mongoose.Types.ObjectId(id));
                pipeline.push({
                    $match: {
                        coursesubjectcate: { $in: cat }
                    }
                });
            }
        }

        const sortByData = sortBy === 'Latest' ? -1 : 1;

        pipeline.push(
            {
                $lookup: {
                    from: EnrolledModel.collection.name,
                    localField: "_id",
                    foreignField: "course",
                    as: "enrolledDocs"
                }
            },
            {
                $lookup: {
                from: FeedbackModel.collection.name,
                localField: "_id",
                foreignField: "courseId",
                as: "feedbackDocs"
                }
            },
            {
                $lookup: {
                    from: CategoryModel.collection.name, 
                    localField: "coursecate",
                    foreignField: "_id",
                    as: "coursecateInfo",
                },
            },
            {
                $lookup: {
                    from: SubCategoryModel.collection.name, 
                    localField: "coursesubjectcate",
                    foreignField: "_id",
                    as: "coursesubjectcateInfo",
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    subtitle: 1,
                    coursecateInfo: 1,
                    coursesubjectcateInfo: 1,
                    thumbnailurl: 1,
                    studentCount: { $size: "$enrolledDocs" },
                    averageRating: { $avg: "$feedbackDocs.rating" },
                    totalFeedback: { $size: { $ifNull: ["$feedbackDocs", []] }},
                    createdAt: 1,
                },
            },
            {
                $sort: { createdAt: sortByData },
            }
        );

        if(skip) pipeline.push({ $skip: skip });
        if(limit) pipeline.push({ $limit: limit });

        const courseData = await CourseModel.aggregate(pipeline);

        return courseData;
    }

    
    async getById(courseId: string){
        if(!courseId) throw new Error("Course ID is required")

        const courseData = await CourseModel.findById(courseId)
        .populate([
            { path: 'coursecate', select: '-value' },
            { path: 'coursesubjectcate', select: '-value -categoryId -updatedAt' },
            { path: 'createby', select: '-_id firstname lastname profilepicture '}
        ]).lean();

        if(!courseData) throw new Error('Course not found');
        const keyNote = `enrolle:${courseData._id}`; 
        if(client)await client.setEx(keyNote, 3600, JSON.stringify(courseData));
        
        return courseData
    }

    
    async enrolled(courseId: string, studentId: string) {
        if(!courseId || !studentId) throw new Error("Course ID and Student ID are required");
    
        const [courseExists, existingEnrollment] = await Promise.all([
            CourseModel.exists({ _id: new mongoose.Types.ObjectId(courseId) }).lean(),
            EnrolledModel.findOne({ course:  new mongoose.Types.ObjectId(studentId)}).lean()
        ]);
        
        if(!courseExists) throw new Error('Course not found');
        if(existingEnrollment) throw new Error("Already enrolled in the course");
        
        const enrolled = await EnrolledModel.create({
            student: new mongoose.Types.ObjectId(courseId),
            course: new mongoose.Types.ObjectId(studentId),
            status: "not started"
        });
        
        return enrolled;
    }
    
}

export default new enrolledService();
