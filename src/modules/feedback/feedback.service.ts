import mongoose from "mongoose";
import { CourseModel } from "../../model/course.Model";
import { FeedbackModel } from "../../model/feedback.Model";
import { CreateFeedback, DeleteFeedBack, UpdateFeedBack } from "../../types/feedback.type"
import { client } from "../../../config/connectToRedis";


class feedBackService {

    async getAll(courseId: string) {
        const feedBackInCourse = await FeedbackModel.aggregate([
            { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
            {
                $lookup: {
                    from: "students",
                    localField: "studentId",
                    foreignField: "_id",
                    as: "studentDetails"
                }
            },
            { $unwind: { path: "$studentDetails", preserveNullAndEmptyArrays: true } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                    totalFeedbacks: { $sum: 1 },
                    feedbacks: {
                        $push: {
                            _id: "$_id",
                            rating: "$rating",
                            text: "$text",
                            studentDetails: {
                                firstname: "$studentDetails.firstname",
                                lastname: "$studentDetails.lastname",
                                profilepicture: "$studentDetails.profilepicture"
                            },
                            createdAt: "$createdAt"
                        }
                    }
                }
            }
        ]);
        // if (!feedBackInCourse || feedBackInCourse.length === 0) return feedBackInCourse;

        // const keyNote = `feedback:${courseId}`; 
        // if(client)await client.setEx(keyNote, 3600, JSON.stringify(feedBackInCourse)); 

        return feedBackInCourse;
    }

    async create(userId: string, { courseId, rating, text }: CreateFeedback) {
        if (!courseId || !userId) throw new Error("Course ID and User ID is required");

        const courseData = await CourseModel.findById(courseId);
        if (!courseData) throw new Error("Course not found");

        const newFeedBack = await FeedbackModel.create({
            courseId: new mongoose.Types.ObjectId(courseId),
            studentId: new mongoose.Types.ObjectId(userId),
            rating,
            text
        })
        await newFeedBack.populate({
            path: 'studentId',
            select: 'firstname lastname  profilepicture' 
        });

        const keyNote = `feedback:${courseData._id}`;

        if(client){
            const cachedDataAll = await client.get(keyNote);
            let allNotes = cachedDataAll ? JSON.parse(cachedDataAll) : [];

            allNotes.push(newFeedBack);

            await client.setEx(keyNote, 3600, JSON.stringify(allNotes));
        }

        return {
            _id:newFeedBack._id,
            rating:newFeedBack.rating,
            studentDetails:newFeedBack.studentId,
            text:newFeedBack.text,
            createdAt: newFeedBack.createdAt 
        };
    }

    async updated({ courseId, feedbackId, rating, text }: UpdateFeedBack, userId: string) {
        if (!courseId || !userId) throw new Error("Course ID and User ID are required");

        const courseData = await CourseModel.findById(courseId);
        if (!courseData) throw new Error("Course not found");
        const update = await FeedbackModel.findOneAndUpdate(
            { _id: feedbackId, studentId: userId },
            { courseId: courseId, rating, text },
            { new: true }
        );
        if (!update) throw new Error("Cannot update feedback");

        const keyNote = `feedback:${courseId}`;
        if (client) await client.del(keyNote);

        return update;
    }

    async delete({ courseId, feedbackId }: DeleteFeedBack, userId: string) {
        if (!userId) throw new Error("User ID is required");

        const courseData = await CourseModel.findById(courseId)
        if (!courseData) throw new Error("Course not found");

        const deletedFeedback = await FeedbackModel.findOneAndDelete(
            { _id: feedbackId, studentId: userId, }
        );
        if (!deletedFeedback) throw new Error("Cannot delete feedback or feedback not found");

        const keyNote = `feedback:${courseId}`;
        if (client) await client.del(keyNote);

        return deletedFeedback;
    }
}


export default new feedBackService();