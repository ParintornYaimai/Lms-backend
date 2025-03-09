import mongoose from "mongoose";
import { CourseModel } from "../../model/course.Model";
import { FeedbackModel } from "../../model/feedback.Model";
import {CreateFeedback, DeleteFeedBack, UpdateFeedBack} from "../../types/feedback.type"
import { client } from "../../../config/connectToRedis";


class feedBackService{

    async getAll(courseId: string) {
    
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
        if(!feedBackInCourse || feedBackInCourse.length === 0) throw new Error('Feedback not found');
        
        const keyNote = `feedback:${courseId}`; 
        if(client)await client.setEx(keyNote, 3600, JSON.stringify(feedBackInCourse)); 

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

        const keyNote = `feedback:${courseData._id}`; 

        if(client){
            const cachedDataAll = await client.get(keyNote);
            let allNotes = cachedDataAll ? JSON.parse(cachedDataAll) : [];
    
            allNotes.push(newFeedBack);
    
            await client.setEx(keyNote, 3600, JSON.stringify(allNotes));
        }

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

        const keyNote = `feedback:${courseId}`;
        if(client) await client.del(keyNote);
    
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

        const keyNote = `feedback:${courseId}`;
        if(client) await client.del(keyNote);
       
        return deletedFeedback;
    }
}


export default new feedBackService();