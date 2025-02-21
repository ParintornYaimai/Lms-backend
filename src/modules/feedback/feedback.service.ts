import mongoose from "mongoose";
import { CourseModel } from "../../model/course.Model";
import { FeedbackModel } from "../../model/feedback.Model";
import {CreateFeedback, DeleteFeedBack, UpdateFeedBack} from "../../types/feedback.type"


class feedBackService{
    //find By courseId - get All Feedback In the Course
    async getAll(courseId: string) {
        if (!courseId) throw new Error("Course ID is Required");
    
        const feedBackInCourse = await FeedbackModel.aggregate([
            { $match: { course: new mongoose.Types.ObjectId(courseId) } }, 
            {
                $lookup: {
                    from: "users",
                    localField: "student",
                    foreignField: "_id",
                    as: "studentDetails"
                }
            },
            {
                $project: {
                    _id: 1,
                    rating: 1,
                    text: 1,
                    studentDetails: { firstname: 1, lastname: 1, profilepicture: 1 },
                    createdAt: 1
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalFeedbacks: { $sum: 1 },  
                    feedbacks: { $push: "$$ROOT" } 
                }
            }
        ]);
    
        if (!feedBackInCourse || feedBackInCourse.length === 0) throw new Error('Feedback not found');
        return feedBackInCourse;
    }

    async create(userId: string, {courseId,rating, text }: CreateFeedback){
        if(!courseId || !userId) throw new Error("Course ID and User ID is required");

        const courseData = await CourseModel.findById(courseId);
        if(!courseData) throw new Error("Course not found");
        
        const newFeedBack = await FeedbackModel.create({
            course: new mongoose.Types.ObjectId(courseId),
            student: new mongoose.Types.ObjectId(userId),
            rating,
            text
        })

        return newFeedBack;
    }

    async updated({ courseId, feedbackId, rating, text }: UpdateFeedBack, userId: string) {
        if(!courseId || !userId) throw new Error("Course ID and User ID are required");
    
        const courseData = await CourseModel.findById(courseId);
        if(!courseData) throw new Error("Course not found");
    
        const update = await FeedbackModel.findOneAndUpdate(
            { _id: feedbackId, student: userId }, 
            { course: courseId, rating, text },
            { new: true }
        );
    
        if(!update) throw new Error("Cannot update feedback");
    
        return update;
    }
    
    async delete({ courseId, feedbackId }: DeleteFeedBack, userId: string) {
        if(!userId) throw new Error("User ID is required");

        const courseData = await CourseModel.findById(courseId)
        if(!courseData) throw new Error("Course not found");

        const deletedFeedback = await FeedbackModel.findOneAndDelete(
            { _id: feedbackId, student: userId,}
        );

        if(!deletedFeedback) throw new Error("Cannot delete feedback or feedback not found");
       
        return deletedFeedback;
    }
}


export default new feedBackService();